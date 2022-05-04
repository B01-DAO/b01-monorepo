import { ChainId, ContractAddresses } from './types';

const chainIdToAddresses: { [chainId: number]: ContractAddresses } = {
  [ChainId.Mainnet]: {
    nounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    nounsSeeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
    nounsDescriptor: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
    nftDescriptor: '0x0BBAd8c947210ab6284699605ce2a61780958264',
    nounsAuctionHouse: '0xF15a943787014461d94da08aD4040f79Cd7c124e',
    nounsAuctionHouseProxy: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    nounsAuctionHouseProxyAdmin: '0xC1C119932d78aB9080862C5fcb964029f086401e',
    nounsDaoExecutor: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    nounsDAOProxy: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    nounsDAOLogicV1: '0xa43aFE317985726E4e194eb061Af77fbCb43F944',
  },
  [ChainId.Rinkeby]: {
    nounsToken: '0x03Dc6C4241B64732f3Eb196850596cE4d1864750',
    nounsSeeder: '0xFD2105b5F8A4Cec826a6bC8893089ac5a9D3a9B4',
    nounsDescriptor: '0x8Fa0E339e282606eBFB01618284d32Bd23c3F53F',
    nftDescriptor: '0x1F28f148ef5f9BD182cCEfeAD4240A505C54dc9B',
    nounsAuctionHouse: '0x05bE4B70A2B4A659b5c32a6f07c1fb8341eA09Df',
    nounsAuctionHouseProxy: '0xB420FC1F7D971d3ba18fcDF7ceb566aa3a9f4C6F',
    nounsAuctionHouseProxyAdmin: '0xE0e0372f49381ec343985BC2b288184bA09B6268',
    nounsDaoExecutor: '0x50A6A52AD349236576b46aEf2043ce4470b1C342',
    nounsDAOProxy: '0x1a9731B6c429B47D2A82B5319c812081b11aEC80',
    nounsDAOLogicV1: '0xf5C56394a6cEcA757BDeE47b4AE9880d5c712693',
  },
  [ChainId.Local]: {
    nounsToken: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    nounsSeeder: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    nounsDescriptor: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    nftDescriptor: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    nounsAuctionHouse: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    nounsAuctionHouseProxy: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    nounsAuctionHouseProxyAdmin: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    nounsDaoExecutor: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    nounsDAOProxy: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    nounsDAOLogicV1: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  },
};

/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
export const getContractAddressesForChainOrThrow = (chainId: number): ContractAddresses => {
  if (!chainIdToAddresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return chainIdToAddresses[chainId];
};
