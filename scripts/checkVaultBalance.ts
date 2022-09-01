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

  console.log("Check vault balance");

  const vault = new ethers.Contract("0x92968b7Fdef540928E01C1dfA0510D1deabE95d1", VaultJson.abi, signer)

  const depositTx = await vault.retrieve();
  console.log(`Vault balance: ${ethers.utils.formatEther(depositTx)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});