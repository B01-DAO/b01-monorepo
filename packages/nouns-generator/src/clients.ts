import dotenv from 'dotenv';
import { Contract, providers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import { NounsTokenABI } from '@nouns/contracts';

dotenv.config();

/**
 * IFPS Storage Client
 */
export const storage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY || '' });

/**
 * Infura RPC Provider
 */
export const infuraProvider = new providers.InfuraProvider(
  Number(process.env.CHAIN_ID),
  process.env.INFURA_API_KEY,
);

/**
 * Nouns ERC721 Token Contract
 */
export const nounsTokenContract = new Contract(
  process.env.NOUNS_TOKEN_ADDRESS || '',
  NounsTokenABI,
  infuraProvider,
);
