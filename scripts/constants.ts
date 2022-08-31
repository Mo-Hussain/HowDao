import { ethers } from "ethers";

export const developmentChains = ["hardhat", "localhost"]
export const proposalsFile = "proposals.json"

// Governor Values
export const MIN_DELAY = 900 // 15 min - after a vote passes, you have 15 min before you can enact

// All
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

// For proposal
export const AMOUNT = "51000000000000000"
export const FUNC = "withDrawAmount"
export const PROPOSAL_DESCRIPTION = "Proposal #5 withdraw 51000000000000000 from the vault."

// For voting
export const PROPOSAL_ID = ethers.BigNumber.from("65185563373109245497785385042191915652483365482746294297796245238804532907213"); 
export const VOTE_WAY = 1
export const REASON = "because why not"


// #1 proposal
// 16771503784583606265813338608760989807292291883506209473135542542532424837102
// #2 proposal
// 9708803575658498242187827380032421453685992414909331601410761460949552521578
// #3 proposal
// 48149338464110885928667609870468791222409976441829687303376046682783379835096

// #5
// 65185563373109245497785385042191915652483365482746294297796245238804532907213