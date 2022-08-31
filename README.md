# HowDAO Setup:
```
1. Deploy DAO Token 
2. Deploy TimeLock
3. Deploy DAO Govern with token and time lock
4. Change TimeLock roles:
    1. grantRole proposer to DAO Govern
    2. grantRole executors to 0x000.. address (all)
    3. revokeRole admin role for the deployer of TimeLock
5. Deploy Vault with WETH address
6. Change Vault ownership to TimeLock address
You made a HowDAO!
```

# Interaction with DAO:

1. **Deposit** - Anyone can deposit WETH to the Vault. (In order to deposit WETH you need to approve the vault address in  the WETH contract)
2. **Withdraw** - First you need to create a proposal where the members of the DAO need to vote if they want to allow your withdrawal. This proposal need to include the amount of WETH that you would like to withdraw from the Vault. (In order to vote make sure that you delegate your voting power to yourself in the DAO token contract). If the proposal is successful you can queue and execute the proposal.
3. **Retrieve** - You can check the balance of the Vault.