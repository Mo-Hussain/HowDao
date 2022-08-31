import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDAOJson from "../artifacts/contracts/HOWDAOGovern.sol/HowDAO.json";
import { setupProvider } from "./utils";
import { PROPOSAL_ID, VOTE_WAY, REASON } from "./constants";


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

  console.log("Vote for a proposal");

  const governor = new ethers.Contract("0x596F0609909E112479591AC54bcEeD0B93F35F73", HowDAOJson.abi, signer)
  
  const voteTx = await governor.castVoteWithReason(PROPOSAL_ID, VOTE_WAY, REASON)
  const voteTxReceipt = await voteTx.wait(1)
  console.log(voteTxReceipt.events[0].args.reason)
  const proposalState = await governor.state(PROPOSAL_ID)
  console.log(`Current Proposal State: ${proposalState}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});