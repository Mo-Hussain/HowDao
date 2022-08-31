import { BytesLike, ethers } from "ethers";
import "dotenv/config";
import * as HowDAOJson from "../artifacts/contracts/HOWDAOGovern.sol/HowDAO.json";
import * as VaultJson from "../artifacts/contracts/Vault.sol/Vault.json";
import { setupProvider } from "./utils";
import { AMOUNT, FUNC, PROPOSAL_DESCRIPTION } from "./constants";


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

  console.log("Propose withdrawal of the vault");

  const governor = new ethers.Contract("0x596F0609909E112479591AC54bcEeD0B93F35F73", HowDAOJson.abi, signer)
  const vault = new ethers.Contract("0xb8552591a5A2B07dFcd75D7C0A1226B35955C1B4", VaultJson.abi, signer)
  const encodedFunctionCall = vault.interface.encodeFunctionData(FUNC, [ethers.utils.parseEther(AMOUNT)]);
  console.log(`Proposing ${FUNC} on ${vault.address} with ${AMOUNT}`)
  console.log(`Proposal Description:\n  ${PROPOSAL_DESCRIPTION}`)
  const proposeTx = await governor.propose(
    [vault.address],
    [0],
    [encodedFunctionCall],
    PROPOSAL_DESCRIPTION
  )

  const proposeReceipt = await proposeTx.wait()
  const proposalId = proposeReceipt.events[0].args.proposalId
  console.log(`Proposed with proposal ID:\n  ${proposalId}`)

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});