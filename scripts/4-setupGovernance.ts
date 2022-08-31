import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDaoGovernorJson from "../artifacts/contracts/HOWDAOGovern.sol/HowDAO.json";
import * as TimeLockJson from "../artifacts/contracts/TimeLock.sol/TimeLock.json";
import { setupProvider } from "./utils";
import { ADDRESS_ZERO } from "./constants";


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
  console.log("Setup HowDaoGovernor");

  const timeLock = new ethers.Contract("0x20D541eF4F41708ae6C1549C411997a390E6f116", TimeLockJson.abi, signer)
  const governor = new ethers.Contract("0x596F0609909E112479591AC54bcEeD0B93F35F73", HowDaoGovernorJson.abi, signer)

  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

  const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
  await proposerTx.wait()
  console.log(`Proposer transaction completed. Hash: ${proposerTx.hash}`);
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
  await executorTx.wait()
  console.log(`Executor transaction completed. Hash: ${executorTx.hash}`);
  const revokeTx = await timeLock.revokeRole(adminRole, signer.address)
  await revokeTx.wait()
  console.log(`Revoke admin transaction completed. Hash: ${revokeTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});