import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDaoGovernorJson from "../artifacts/contracts/HowDaoGovernor.sol/HowDaoGovernor.json";
import { setupProvider } from "./utils";
import { QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } from "./constants";

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
  console.log("Deploying HowDaoGovernor contract");

  const HowDaoFactory = new ethers.ContractFactory(
    HowDaoGovernorJson.abi,
    HowDaoGovernorJson.bytecode,
    signer
  );

  const HowDaoContract = await HowDaoFactory.deploy(
    ethers.utils.getAddress("0xA7B06fB5478eC61a7e8dadf1AAdD1162ce1657c0"),
    ethers.utils.getAddress("0x547fAd03C8f8F9E0a1b57B4761F977DAd09E0817"),
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY
  );
  console.log("Awaiting confirmations");

  await HowDaoContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${HowDaoContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
