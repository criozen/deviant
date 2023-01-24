import { Injectable } from '@angular/core';
import { CommonContractService } from 'src/app/shared/common-contract.service';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public mintContract: any;
  public mintContractAddress: any;
  constructor(private commonContractService: CommonContractService) {
    this.init();
  }

  /**
   * Inits mint contract service
   */
  public async init() {
    this.mintContract = await this.commonContractService.getContract('PREMINT');
    this.mintContractAddress =
      await this.commonContractService.getContractAddress('PREMINT');
  }
  /**
   * Determines whether valid address is
   * @param address
   * @returns
   */
  public isValidAddress(address: string) {
    return this.commonContractService.ethWeb3.utils.isAddress(address);
  }

  public async createAbi(address:any) {
    
    const params = [address];
    return await this.mintContract.methods.mintAirdrop(...params).encodeABI();
  }

  public airdrop(walletAddress:any,abi:any) {
    return new Promise((resolve, reject) => {
      const message = {
        method: 'eth_sendTransaction',
        from: walletAddress,
        to: this.mintContractAddress,
        data: abi,
        
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
    });
  }



}
