import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ethers, EventFilter, BytesLike } from 'ethers';
import TokenContract from 'src/assets/contracts/HowDAOToken.json';
import WETHContract from 'src/assets/contracts/WETH9.json';
import VaultContract from 'src/assets/contracts/Vault.json';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  provider: ethers.providers.BaseProvider;
  wallet: ethers.Wallet;
  userWallet: ethers.Wallet;
  tokenContractInstance: ethers.Contract;
  WETHContractInstance: ethers.Contract;
  VaultContractInstance: ethers.Contract;

  constructor() {
    
    this.provider = this.getProvider();
    this.wallet = new ethers.Wallet(environment.private_key as BytesLike);
    this.userWallet = this.wallet.connect(this.provider);
    this.tokenContractInstance = new ethers.Contract(
      environment.tokenContractAddress,
      TokenContract.abi
    ).connect(this.userWallet);
    this.WETHContractInstance = new ethers.Contract(
      environment.WETHContractAddress,
      WETHContract.abi
    ).connect(this.userWallet);
    this.VaultContractInstance = new ethers.Contract(
      environment.vaultAddress,
      VaultContract.abi
    ).connect(this.userWallet);
  }

  getProvider() {
    const options = {
      infura: environment.infure_api_key,
      quorum: 1,
    };
    const provider = ethers.providers.getDefaultProvider("goerli", options);
    return provider;
  }

  async address() {
    const address = this.userWallet.address;
    return address;
  }

  async etherBalance() {
    const etherBalanceBN = await this.provider.getBalance(
      this.userWallet.address
    );
    const etherBalance = ethers.utils.formatEther(etherBalanceBN) + ' ETH';
    return etherBalance;
  }

  async networkName() {
    const networkName = environment.network;
    return networkName;
  }

  async number() {
    const number = await this.provider.getBlockNumber();
    return number.toFixed(0);
  }

  async tokenAddress() {
    const tokenAddress = environment.tokenContractAddress;
    return tokenAddress;
  }

  async WETHtokenAddress() {
    const tokenAddress = environment.WETHContractAddress;
    return tokenAddress;
  }

  async vaultAddress() {
    const tokenAddress = environment.vaultAddress;
    return tokenAddress;
  }

  async tokenName() {
    const tokenName = await this.tokenContractInstance['name']();
    return tokenName;
  }

  async symbol() {
    const symbol = await this.tokenContractInstance['symbol']();
    return symbol;
  }

  async supply() {
    const supplyBN = await this.tokenContractInstance['totalSupply']();
    const supply = ethers.utils.formatEther(supplyBN);
    return supply + ' Tokens';
  }

  async tokenBalance() {
    const tokenBalanceBN = await this.tokenContractInstance['balanceOf'](
      this.userWallet.address
    );
    const tokenBalance = ethers.utils.formatEther(tokenBalanceBN);
    return tokenBalance + ' Tokens';
  }

  async WETHtokenBalance() {
    const tokenBalanceBN = await this.WETHContractInstance['balanceOf'](
      this.userWallet.address
    );
    const tokenBalance = ethers.utils.formatEther(tokenBalanceBN);
    return tokenBalance + ' Tokens';
  }

  async vaultBalance() {
    const tokenBalanceBN = await this.VaultContractInstance['retrieve']();
    const tokenBalance = ethers.utils.formatEther(tokenBalanceBN);
    return tokenBalance + ' Tokens';
  }

  async depositToken(amount: number) {
    console.log(amount);
    // amount.toFixed(18)
    await this.WETHContractInstance['approve'](
      this.VaultContractInstance.address,
      amount
    );
    await this.VaultContractInstance['depositToken'](
      amount
    );
  }

  watchBlockNumber(callbackFn: (...arg0: any) => void) {
    const filter = 'block';
    this.provider.on(filter, (event) => callbackFn(event));
  }

  watchUserBalanceEther(callbackFn: (...arg0: any) => void) {
    const filter = [ethers.utils.hexZeroPad(this.userWallet.address, 32)];
    this.provider.on(filter, (event) => callbackFn(event));
  }

  watchContractSupply(callbackFn: (...arg0: any) => void) {
    const filter = this.tokenContractInstance.filters['Transfer']();
    this.provider.on(filter, (event) => callbackFn(event));
  }

  watchUserBalanceToken(callbackFn: (...arg0: any) => void) {
    const filterFrom = this.tokenContractInstance.filters['Transfer'](
      this.userWallet.address
    );
    const filterTo = this.tokenContractInstance.filters['Transfer'](
      null,
      this.userWallet.address
    );
    this.tokenContractInstance.on(filterFrom, (event) => callbackFn(event));
    this.tokenContractInstance.on(filterTo, (event) => callbackFn(event));
  }

  async signTokenRequest(amount: number) {
    const signatureObject = {
      address: this.userWallet.address,
      amount: amount,
    };
    const signatureMessage = JSON.stringify(signatureObject);
    const signature = await this.userWallet.signMessage(signatureMessage)
    return signature;
  }
}
