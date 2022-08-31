import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDaoGovernorJson from "../artifacts/contracts/HOWDAOGovern.sol/HowDAO.json";
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
  console.log("Deploying HowDaoGovernor contract");

  const HowDaoFactory = new ethers.ContractFactory(
    HowDaoGovernorJson.abi,
    HowDaoGovernorJson.bytecode,
    signer
  );

  const HowDaoContract = await HowDaoFactory.deploy(
    ethers.utils.getAddress("0x81d1613D4EB2ad0B16B6025D87fc5C64A2e1a8C1"),
    ethers.utils.getAddress("0x20D541eF4F41708ae6C1549C411997a390E6f116")
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

// 0x596F0609909E112479591AC54bcEeD0B93F35F73