import { Injectable } from '@angular/core';
import { CommonContractService } from 'src/app/shared/common-contract.service';
import { WalletConnectService } from 'ng-blockchainx';
import Web3 from 'web3';
import { MintNowComponent } from '../mint-now.component';
@Injectable({
  providedIn: 'root',
})
export class MintService {
  public mintContract: any;
  public mintContractAddress: any;
  public purchasedDetails: any = {};
  public txHash:any
  constructor(private mint:CommonContractService,private commonContractService: CommonContractService,private walletConnectService:WalletConnectService) {
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

 

  async count(address:any){
    return this.mintContract.methods.countOfUser(address).call()
  }

 

  public async createAbi(dAmount: any,key: any) {
    
    const params = [dAmount,key];
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
              resolve({ status: true, data: response });
            
              console.log(response)
              this.txHash = response as string;
              
              // setInterval(async () => {
              //   let b =await this.commonContractService.ethWeb3.eth.getTransactionReceipt(this.txHash)
              //   console.log(await this.commonContractService.ethWeb3.eth.getTransactionReceipt(this.txHash))
              //   this.mint.tx=await this.commonContractService.ethWeb3.eth.getTransactionReceipt(this.txHash)
              //   console.log(b)
              //   if(b?.status){
              //     alert('BUy Success')
              //     window.location.reload()
              //   }
              // }, 1000);
             
              // this.buyNftProcess(response as string);
            })
            .catch((error) => {
              reject({ status: false, data: error });
              if (error.code === 4001) alert('User rejected');
              // alert('user rejected')
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

  

