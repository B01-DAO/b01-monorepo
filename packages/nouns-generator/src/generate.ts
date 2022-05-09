import type { NounSeed, NounMetadata } from '@nouns/sdk';
import { tryF, isError } from 'ts-try';
import { File } from 'nft.storage';
import { storage, nounsTokenContract } from './clients';
import { Wallet } from 'ethers';

export interface NounUploadMetadata {
  name: string;
  description: string;
  image: typeof File;
  background_color: string;
  animation_url: typeof File;
  animation_data: typeof File;
}

/**
 * Generate assets for a provided seed, upload them to IPFS, and update the contract.
 *
 * @param nounId
 * @param seed
 */
const generate = async (nounId: number, seed: NounSeed) => {
  // generate assets
  const [image, gltf, webm] = ['', '', ''];

  const imageFile = new File([image], `${nounId}.png`, { type: 'image/png' });
  const gltfFile = new File([gltf], `${nounId}.gltf`, { type: 'model/gltf' });
  const webmFile = new File([webm], `${nounId}.webm`, { type: 'video/webm' });

  // construct metadata
  const metadata: NounUploadMetadata = {
    name: `Noun ${nounId}`,
    description: `Noun ${nounId} is a member of the Nouns DAO`,
    image: imageFile,
    animation_url: webmFile,
    animation_data: gltfFile,
    background_color: '#ffffff',
  };

  // upload asset to IPFS
  // image, animation_url, and animation_data will be uploaded to IPFS as separate assets and attached
  const cid = await tryF(() => storage.store(metadata));
  if (isError(cid)) {
    console.error(`Error uploading metadata for token ID ${nounId}: ${cid.message}`);
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
const generateSafe = async (nounId: number, seed: NounSeed) => {
  // confirm a job isn't already generatening for this noun
  // read the contract and confirm tokenURI is not already set
  generate(nounId, seed);
};

export default generateSafe;
