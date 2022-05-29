import { generateAssets } from '@nouns/generation-ssr';
import { NounSeed, NounMetadata, convertContractSeedToSeed } from '@nouns/sdk';
import { INounsSeeder } from '@nouns/contracts/typechain-types/INounsToken';
import { tryF, isError } from 'ts-try';
import { File } from 'nft.storage';
import { storage, nounsTokenContract } from '../clients';
import { Wallet } from 'ethers';

// B01 TODO: where should this be stored?
const TEMP_NOUNS_HASH = 'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';

export interface NounUploadMetadata {
  name: string;
  description: string;
  background_color: string;
  external_url: string;
  image: typeof File;
  animation_url: typeof File;
  animation_data: typeof File;
}

let activeJob: number | undefined = undefined;

/**
 * Generate assets for a provided seed, upload them to IPFS, and update the contract.
 *
 * @param nounId
 * @param seed
 */
const generate = async (nounId: number, seed: NounSeed) => {
  // generate assets
  const { image, gltf, webm } = await generateAssets();

  const imageFile = new File([image], `${nounId}.png`, { type: 'image/png' });
  const gltfFile = new File([gltf], `${nounId}.gltf`, { type: 'model/gltf' });
  const webmFile = new File([webm], `${nounId}.webm`, { type: 'video/webm' });

  // construct metadata
  // B01 TODO: update payload
  const metadata: NounUploadMetadata = {
    name: `Noun ${nounId}`,
    description: `Noun ${nounId} is a member of the Nouns DAO`,
    image: imageFile,
    external_url: `https://nouns.wtf/noun/${nounId}`,
    animation_url: webmFile,
    animation_data: gltfFile,
    background_color: '#ffffff',
  };

  // upload asset to IPFS
  // image, animation_url, and animation_data will be uploaded to IPFS as separate assets and attached
  const cid = await tryF(() => storage.store(metadata));
  if (isError(cid)) {
    console.error(`Error uploading metadata for token ID ${nounId}: ${cid.message}`);
    // TODO: consider storing assets somewhere
    return;
  }
  const tokenUri = cid.url;

  console.log('Successfully uploaded metadata for token ID to IPFS', nounId, tokenUri);

  // update contract
  if (process.env.TOKEN_URI_PRIVATE_KEY) {
    const signer = new Wallet(process.env.TOKEN_URI_PRIVATE_KEY, nounsTokenContract.provider);
    const upgradedContract = nounsTokenContract.connect(signer);
    const update = await tryF(() => upgradedContract.setTokenURI(nounId, tokenUri));
    if (isError(update)) {
      console.error(`Error updating tokenURI for token ID ${nounId}: ${update.message}`);
      return;
    }

    console.log('Successfully updated tokenURI for token ID', nounId, tokenUri);
  }
};
/**
 * A wrapper of 'generate' which first checks if a job is already generatening for the noun & confirms tokenURI is not already set.
 *
 * @param nounId
 * @param seed
 */
const generateSafe = async (nounId: number, seed?: NounSeed) => {
  // confirm a job isn't already generatening for this noun
  if (activeJob === nounId) {
    console.error(
      `Skipping generation for noun ${nounId} because another job is already running for it`,
    );
    return;
  }

  if (activeJob !== undefined) {
    console.error(
      `Skipping generation for noun ${nounId} because another job is already running for another noun: ${activeJob}`,
    );
    return;
  }

  // read the contract and confirm tokenURI is not already set
  const tokenUri = await tryF(() => nounsTokenContract.tokenURI(nounId));
  if (tokenUri?.length > 0 && tokenUri !== TEMP_NOUNS_HASH) {
    console.error(`Skipping generation for noun ${nounId} because it's already set: ${tokenUri}`);
    return;
  }

  // set seed if not provided
  const cSeed: INounsSeeder.SeedStruct = await tryF(() => nounsTokenContract.seeds(nounId));
  if (isError(seed)) {
    console.error(`Error reading seed from contract for token ID ${nounId}: ${seed.message}`);
    return;
  }

  if (!seed) {
    seed = convertContractSeedToSeed(cSeed);
  }

  // sanity test
  const seedDuplicate = convertContractSeedToSeed(cSeed);
  if (JSON.stringify(seed) !== JSON.stringify(seedDuplicate)) {
    console.error(
      `Seed for token ID ${nounId} is not the same as the seed in the contract.`,
      seed,
      seedDuplicate,
    );
    return;
  }

  // lock
  activeJob = nounId;
  // run
  await generate(nounId, seed);
  // release lock
  activeJob = undefined;
};

export { generateSafe };
