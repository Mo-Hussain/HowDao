import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as VaultJson from "../artifacts/contracts/Vault.sol/Vault.json";
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
  console.log("Deploying Vault contract");

  const VaultFactory = new ethers.ContractFactory(
    VaultJson.abi,
    VaultJson.bytecode,
    signer
  );
  const VaultContract = await VaultFactory.deploy(ethers.utils.getAddress("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"));
  console.log("Awaiting confirmations");

  await VaultContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${VaultContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xb8552591a5A2B07dFcd75D7C0A1226B35955C1B4