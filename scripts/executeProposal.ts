import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDAOJson from "../artifacts/contracts/HOWDAOGovern.sol/HowDAO.json";
import * as VaultJson from "../artifacts/contracts/Vault.sol/Vault.json";
import { setupProvider } from "./utils";
import { AMOUNT, FUNC, PROPOSAL_DESCRIPTION, TO } from "./constants";


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

  console.log("Queue and execute a proposal");

  

  const governor = new ethers.Contract("0x596F0609909E112479591AC54bcEeD0B93F35F73", HowDAOJson.abi, signer)
  const vault = new ethers.Contract("0x92968b7Fdef540928E01C1dfA0510D1deabE95d1", VaultJson.abi, signer)

  const initBalance = await vault.retrieve();
  console.log(`Initial vault balance: ${ethers.utils.formatEther(initBalance)}`);

  const encodedFunctionCall = vault.interface.encodeFunctionData(FUNC, [TO, AMOUNT]);
  const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION);

  console.log("Executing...")
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [vault.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  )
  await executeTx.wait()
  
  const afterBalance = await vault.retrieve();
  console.log(`After execution vault balance: ${ethers.utils.formatEther(afterBalance)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});