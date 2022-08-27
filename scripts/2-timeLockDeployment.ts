import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as TimeLockJson from "../artifacts/contracts/TimeLock.sol/TimeLock.json";
import { setupProvider } from "./utils";
import { MIN_DELAY } from "./constants";

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
  console.log("Deploying TimeLock contract");

  const TimeLockFactory = new ethers.ContractFactory(
    TimeLockJson.abi,
    TimeLockJson.bytecode,
    signer
  );
  const TimeLockContract = await TimeLockFactory.deploy(MIN_DELAY, [], []);
  console.log("Awaiting confirmations");

  await TimeLockContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${TimeLockContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// timelock contract: 0x40a6244E7027a48862d9e4C8C8BB26121a110FfE