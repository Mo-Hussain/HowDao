import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as WETHJson from "../artifacts/contracts/WETH.sol/WETH9.json";
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

  const amount = "0.001"
  console.log("Deposit to vault");

  const weth = new ethers.Contract("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", WETHJson.abi, signer)
  const vault = new ethers.Contract("0xb8552591a5A2B07dFcd75D7C0A1226B35955C1B4", VaultJson.abi, signer)

  const approveTx = await weth.approve(ethers.utils.getAddress("0xb8552591a5A2B07dFcd75D7C0A1226B35955C1B4"), ethers.utils.parseEther(amount));
  await approveTx.wait();
  console.log(`Approve WETH transaction completed. Hash: ${approveTx.hash}`);

  const depositTx = await vault.depositToken(ethers.utils.parseEther(amount));
  await depositTx.wait();
  console.log(`Deposit transaction completed. Hash: ${depositTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});