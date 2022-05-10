import { BigNumberish } from 'ethers';

export type NounSeed = {
  volumeCount: number;
  maxVolumeHeight: number;
  waterFeatureCount: number;
  grassFeatureCount: number;
  treeCount: number;
  bushCount: number;
  peopleCount: number;
  lighting: number;
  season: number;
  environment: number;
  greenRooftopP: number;
  siteEdgeOffset: BigNumberish;
  orientation: BigNumberish;
};

export interface NounMetadata {
  name: string;
  description: string;
  image: string; // IPFS CID to JPEG
  external_url: string;
  background_color: string;
  animation_url: string; // IPFS CID to webmd
  animation_data: string; // IPFS CID to gltf
}
