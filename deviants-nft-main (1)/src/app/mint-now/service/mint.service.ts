import { Injectable } from '@angular/core';
import { CommonContractService } from 'src/app/shared/common-contract.service';
import { WalletConnectService } from 'ng-blockchainx';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class MintService {
  public mintContract: any;
  public mintContractAddress: any;
  public purchasedDetails: any = {};
  public txHash:any
  constructor(private commonContractService: CommonContractService,private walletConnectService:WalletConnectService) {
    this.init();
  }



  /**
   * Inits airdrop contract service
   */
  
  public async init() {
    this.mintContract = await this.commonContractService.getContract('PREMINT');
    this.mintContractAddress =
      await this.commonContractService.getContractAddress('PREMINT');
  }

  async getDetails(address: any) {
    let diamondPurchased: number = await this.mintContract.methods
      ._diamondCounter(address)
      .call({
        from:address
      });
    let goldPurchased: number = await this.mintContract.methods
      ._goldCounter(address)
      .call();
    let silverPurchased: number = await this.mintContract.methods
      ._silverCounter(address)
      .call();
      let tokenIdOfUser = await this.mintContract.methods.tokenIdOfUser(address).call()

    // let diamondListed = await this.mintContract.methods
    //   .diamondListed(address)
    //   .call();
    // let goldListed = await this.mintContract.methods.goldListed(address).call();

    // let ownedId = await this.mintContract.methods.tokenIdOfUser(address).call();

    return {
      diamondPurchased,
      goldPurchased,
      silverPurchased,
      tokenIdOfUser

      // diamondListed,
      // goldListed,

      // ownedId,
    };
  }

  async count(address:any){
    return this.mintContract.methods.countOfUser(address).call()
  }
  async getDetails2() {
    let totalDiamondLimit = await this.mintContract.methods
      .totalDiamondLimit()
      .call();
    let totalGoldLimit = await this.mintContract.methods
      .totalGoldLimit()
      .call();
    let totalSilverLimit = await this.mintContract.methods
      .totalSilverLimit()
      .call();
    let goldRate: number = await this.mintContract.methods.goldRate().call();
    let silverRate: number = await this.mintContract.methods
      .silverRate()
      .call();
    let goldLimit: number = await this.mintContract.methods.goldLimit().call();
    let diamondLimit: number = await this.mintContract.methods
      .diamondLimit()
      .call();
    let totalDiamondPurchased: number = await this.mintContract.methods
      .purchasedDiamond()
      .call();
    let totalGoldPurchased: number = await this.mintContract.methods
      .purchasedGold()
      .call();
    let totalSilverPurchased: number = await this.mintContract.methods
      .purchasedSilver()
      .call();
    return {
      totalDiamondLimit,
      totalGoldLimit,
      totalSilverLimit,
      goldRate,
      silverRate,
      goldLimit,
      diamondLimit,
      totalDiamondPurchased,
      totalGoldPurchased,
      totalSilverPurchased,
    };
  }
  async mintNow() {
    let buy = this.mintContract.methods.mint().send();
  }

  public async createAbi(dAmount: any,key: any) {
    
    const params = [dAmount];
    return await this.mintContract.methods.tokenMint(...params).encodeABI();
  }

  public mintToken(walletAddress: string, createTokenAbi: any,method:number, fee: string) {
    
    
    return new Promise((resolve, reject) => {
      if(method==1){
      const message = {
        method: 'eth_sendTransaction',
        from: walletAddress,
        to: this.mintContractAddress,
        data: createTokenAbi,
        value: fee,
      };
      console.log(message);
      this.commonContractService.ethWeb3.eth
        .sendTransaction(message)
        .then((receipt: any) => {
          resolve({ status: true, data: receipt });
        })
        .catch((error: any) => {
          reject({ status: false, data: error });
        });
      }
     
        if(method==2){
          const message = {
            method: 'eth_sendTransaction',
            from: walletAddress,
            to: this.mintContractAddress,
            data: createTokenAbi,
            value: fee,
          };
          console.log("message",message);
          this.walletConnectService.send(message)
            .then((response) => {
              resolve({status:true,data:response})
              console.log(response)
              this.txHash = response as string;
              // this.buyNftProcess(response as string);
            })
            .catch((error) => {
              reject({ status: false, data: error });
              if (error.code === 4001) alert('User rejected');
              // this.isBuyNftShownBuy = false;
              // this.tradeLoader = false;
              // if (error.code === 4001) this.toastr.error('User rejected');
              // else this.toastr.error('Transaction Failed');
              console.log('Error')
            })
        }
      }
    );
  }
  
}

  

