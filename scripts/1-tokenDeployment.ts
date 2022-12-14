import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDaoTokenJson from "../artifacts/contracts/HOWDAOToken.sol/HowDAOToken.json";
import { setupProvider } from "./utils";


async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY as BytesLike);
  console.log(`Using address ${wallet.address}`);

  const provider = setupProvider();
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));

  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  console.log("Deploying HowDaoToken contract");

  const TokenFactory = new ethers.ContractFactory(
    HowDaoTokenJson.abi,
    HowDaoTokenJson.bytecode,
    signer
  );
  const HowDaoTokenContract = await TokenFactory.deploy();
  console.log("Awaiting confirmations");

  await HowDaoTokenContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${HowDaoTokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0x81d1613D4EB2ad0B16B6025D87fc5C64A2e1a8C1