const GATEWAY = 'https://ipfs.io/';

export const fetchFromIpfs = async (ipfsHash: string): Promise<Object> => {
  const resp = await fetch(`${GATEWAY}/ipfs/${ipfsHash}`);
  const json = await resp.json();

  if (!json) {
    return {};
  }

  return json;
};
