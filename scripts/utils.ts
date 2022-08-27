import { ethers } from "ethers";

export function setupProvider() {
  const options = {
    // alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    quorum: 1,
  };
  const provider = ethers.providers.getDefaultProvider("goerli", options);
  return provider;
}
