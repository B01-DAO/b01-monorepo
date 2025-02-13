import { useContractCall, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, BigNumberish, utils } from 'ethers';
import { NounsTokenABI } from '@nouns/contracts';
import config from '../config';
import { fetchFromIpfs } from '../utils/fetchFromIpfs';

interface NounToken {
  name: string;
  description: string;
  image: string;
}

export interface INounSeed {
  volumeCount: number;
  maxVolumeHeight: number;
  waterFeatureCount: number;
  grassFeatureCount: number;
  treeCount: number;
  bushCount: number;
  peopleCount: number;
  timeOfDay: number;
  season: number;
  greenRooftopP: number;
  siteEdgeOffset: BigNumberish;
  orientation: BigNumberish;
}

const abi = new utils.Interface(NounsTokenABI);

export const useNounToken = async (nounId: EthersBN): Promise<NounToken | undefined> => {
  const [tokenUri] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'tokenURI',
      args: [nounId],
    }) || [];

  if (!tokenUri) {
    return;
  }

  const json = await fetchFromIpfs(tokenUri);

  return json as NounToken;
};

export const useNounSeed = (nounId: EthersBN) => {
  const seed = useContractCall<INounSeed>({
    abi,
    address: config.addresses.nounsToken,
    method: 'seeds',
    args: [nounId],
  });
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'delegates',
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { account } = useEthers();

  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.nounsToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};
