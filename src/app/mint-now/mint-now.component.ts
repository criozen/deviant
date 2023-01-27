import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MintService } from './service/mint.service';
import { CommonContractService } from '../shared/common-contract.service';
import { FormsModule } from '@angular/forms';
const { toChecksumAddress } = require('ethereum-checksum-address');
const { TelegramClient } = require('messaging-api-telegram');
import MerkleTree from 'merkletreejs';
import Web3 from 'web3';
const keccak256 = require('keccak256');
import { diamondDb } from 'src/merkle/diamondDb';
import { goldDb } from 'src/merkle/goldDb';

declare var window: any;
@Component({
  selector: 'app-mint-now',
  templateUrl: './mint-now.component.html',
  styleUrls: ['./mint-now.component.css'],
})
export class MintNowComponent implements OnInit {
  public isWhitelisted: boolean = false;
  public isMintedNow: boolean = false;
  public account: any;
  public buyLimit: any = [0];
  public userDetails: any;
  public buyAmount = 0;
  public chatBotText: any;
  public processing: boolean = false;
  public finalFee = 0;
  public currentDiamondBuy: any = 0;
  public currentGoldBuy: any = 0;
  public currentSilverBuy: any = 0;
  public showFee: any;
  public diamondListed: boolean = false;
  public goldListed: boolean = false;
  public loader = true;
  public isMetamaskConnected: boolean = false;
  public seconds: any;
  public accessKey: string = '';
  public accessKey1: any;
  public times: any = {};
  public totalGoldLimit: any;

  public contractDetails: any;

  public isTermsofServiceOpened: boolean = false;
  public dLimit: any = 0;
  public buydLimit: any = [0];
  public gLimit = 0;
  public buygLimit: any = [0];
  public sLimit: any = 0;
  public buysLimit: any = [0];
  public buydAmount: any = 0;
  public buygAmount: any = 0;
  public buysAmount: any = 0;
  public cLimit: any = [0];
  public ccLimit: any = [];
  public currentHash: any;
  public joinedAirdrop: boolean = false;
  public times1: any = {};
  public tx: any;
  constructor(
    private mintService: MintService,
    private commonContractService: CommonContractService,
    el: ElementRef
  ) {}

  async ngOnInit() {
    await this.commonContractService.isMetamaskConnectedObservable.subscribe(
      (res: any) => {
        this.isMetamaskConnected = res;
      }
    );
    if (1674735498 > new Date().getTime() / 1000) {
      console.log();
      alert('gain');
    }

    this.commonContractService.accountObservable.subscribe(async (res: any) => {
      if (res) {
        this.account = await res;
        this.getTier();
        this.countDown();
        let countOfUser = await this.mintService.count(
          this.account.walletAddress
        );
        if (countOfUser == 0) {
          this.dLimit = 1;
          this.gLimit = 1;
          this.sLimit = 0;
        } else if (countOfUser == 1) {
          this.dLimit = 0;
          this.gLimit = 1;
          this.sLimit = 0;
        } else if (countOfUser == 2) {
          this.dLimit = 0;
          this.gLimit = 0;
          this.sLimit = 0;
        }

        for (let i = 1; i <= this.dLimit; i++) {
          // await this.buydLimit.push(i);
          await this.cLimit.push('diamond');
        }
        for (let i = 1; i <= this.gLimit; i++) {
          // await this.buygLimit.push(i);
          await this.cLimit.push('gold');
        }
        for (let i = 1; i <= this.sLimit; i++) {
          // await this.buysLimit.push(i);
          this.cLimit.push('silver');
        }

        console.log(this.cLimit);
        this.loader = false;
      }
    });

    setTimeout(() => {
      if (!this.isMetamaskConnected) {
        this.loader = false;
      }
    }, 4000);
  }

  async buyNow(event?: any) {
    this.buydAmount = 0;
    this.buygAmount = 0;

    console.log('this.amount', this.buyAmount);
    for (let i = 0; i <= this.ccLimit; i++) {
      console.log(this.cLimit[i]);
      if (this.cLimit[i] == 'diamond') {
        this.buydAmount += 1;
      } else if (this.cLimit[i] == 'gold') {
        this.buygAmount += 1;
      }
    }

    this.processing = true;
    console.log(this.accessKey);
    this.processing = true;
    let goldfee = +this.buygAmount * 0.0035;
    // let silverfee = +this.buysAmount * this.contractDetails.silverRate;
    let currentDiamondBuy = +this.buydAmount;
    let currentGoldBuy = +this.buygAmount;

    let totalfee = goldfee;
    this.finalFee = totalfee;
    this.showFee = totalfee;
    this.currentDiamondBuy = currentDiamondBuy;
    this.currentGoldBuy = currentGoldBuy;

    this.processing = false;
  }

  async mintNow() {
    let isDiamondList = false;
    let isGoldList = false;
    let leaf = diamondDb.db.map((x: string) => keccak256(x));
    let merkleTree = new MerkleTree(leaf, keccak256, { sortPairs: true });
    let buf2hex = (x: any) => '0x' + x.toString('hex');
    console.log('Root', buf2hex(merkleTree.getRoot()));
    const roothash = merkleTree.getRoot();
    // const buf2hexleaves = (x: any) => x.toString('hex');
    const index = diamondDb.db.indexOf(
      toChecksumAddress(this.account.walletAddress)
    );
    console.log(index);

    let gleaf = goldDb.db.map((x: string) => keccak256(x));
    let gmerkleTree = new MerkleTree(gleaf, keccak256, { sortPairs: true });
    let gbuf2hex = (x: any) => '0x' + x.toString('hex');
    console.log('gRoot', gbuf2hex(gmerkleTree.getRoot()));
    const groothash = gmerkleTree.getRoot();
    // const buf2hexleaves = (x: any) => x.toString('hex');
    const gindex = goldDb.db.indexOf(
      toChecksumAddress(this.account.walletAddress)
    );
    console.log(gindex);

    if (index >= 0) {
      const _claimingAddress = leaf[index];
      const hexProof = merkleTree.getHexProof(_claimingAddress);
      isDiamondList = merkleTree.verify(hexProof, _claimingAddress, roothash);
      console.log(hexProof);
      isGoldList = true;
      this.diamondListed = isDiamondList;
      this.goldListed = isGoldList;
      var abi: any = await this.mintService.createAbi(
        +this.buydAmount + +this.buygAmount + +this.buysAmount,
        hexProof
      );
    } else if (gindex > 0) {
      const _claimingAddress = gleaf[gindex];
      const ghexProof = gmerkleTree.getHexProof(_claimingAddress);
      isGoldList = gmerkleTree.verify(ghexProof, _claimingAddress, groothash);
      this.goldListed = isGoldList;
      var abi: any = await this.mintService.createAbi(
        +this.buydAmount + +this.buygAmount + +this.buysAmount,
        ghexProof
      );
    } else {
      const _claimingAddress = gleaf[0];
      const shexProof = gmerkleTree.getHexProof(
        '0x173Cb940a1d240fc17bc064b3291d839bf830Be2'
      );

      var abi: any = await this.mintService.createAbi(
        +this.buydAmount + +this.buygAmount + +this.buysAmount,
        shexProof
      );
    }
    let method = 1;
    if (this.commonContractService.isWconnect) {
      method = 2;
    }
    if (method == 1) {
      alert('Do not refresh the page while minting');
    } else {
      alert('Always open the wallet connect app before minting');
    }
    this.processing = true;
    console.log(this.accessKey);

    console.log(this.account);
    const token: any = await this.mintService
      .mintToken(
        this.account.walletAddress,
        abi,
        method,
        (this.finalFee * 10 ** 18).toString()
      )
      .catch((error: any) => {
        // this.processing = false;
        // if (error.data?.code === 4001) this.toastr.error('User Rejected');
        // else this.toastr.error(error.data.message);
        console.log(error.data.message);
      });

    if (token) {
      if (method == 2) {
        console.log(token.data);
        this.tx = 'https://goerli.etherscan.io/tx/' + token.data;
        //  alert('success')
        this.showModal = true;
      }
      if (method == 1) {
        console.log(token);
        this.tx =
          'https://goerli.etherscan.io/tx/' + token.data.transactionHash;
          this.showModal = true;
      }

      //  window.location.reload()
    }
    //   let diamondBalance: number =
    //     +this.userDetails.diamondPurchased + +this.currentDiamondBuy;
    //   let goldBalance: number =
    //     +this.userDetails.goldPurchased + +this.currentGoldBuy;
    //   let silverBalance: number =
    //     +this.userDetails.silverPurchased + +this.currentSilverBuy;
    //     if(method==1){
    //       var transactionHash:any ='https://mumbai.polygonscan.com/tx/'+ token.data.transactionHash;
    //     }else if(method==2){
    //       var transactionHash:any ='https://mumbai.polygonscan.com/tx/' + this.mintService.txHash
    //     }

    //   let tier: any = 'Silver User';
    //   if (this.userDetails.goldListed) {
    //     tier = 'Gold User';
    //   } else if (this.userDetails.diamondListed) {
    //     tier = 'Diamond User';
    //   }

    //   this.chatBotText =
    //     'Hi, New Nft Minted by ' +
    //     '\n' +
    //     '\n' +
    //     tier +
    //     ' : ' +
    //     '\n' +
    //     '\n' +
    //     this.account.walletAddress +
    //     '\n' +
    //     '\n Diamond : ' +
    //     this.currentDiamondBuy +
    //     '\n Gold : ' +
    //     this.currentGoldBuy +
    //     '\n Silver : ' +
    //     this.currentSilverBuy +
    //     '\n Total Purchase : ' +
    //     (this.currentDiamondBuy + this.currentGoldBuy + this.currentSilverBuy) +
    //     '\n' +
    //     '\n' +
    //     '\n Diamond Balance : ' +
    //     diamondBalance +
    //     '\n Gold Balance : ' +
    //     goldBalance +
    //     '\n Silver Balance : ' +
    //     silverBalance +
    //     '\n' +
    //     '\n' +
    //     '\n' +
    //     '\n' +
    //     transactionHash;

    //   await this.sendBotText();
    //   setTimeout(function () {
    //     window.location.reload();
    //   }, 1000);
    // }
    this.processing = false;
  }

  public async sendBotText() {
    await this.commonContractService.sendBotText(this.chatBotText);
    this.chatBotText = '';
  }

  getTier() {
    let isDiamondList = false;
    let isGoldList = false;
    let leaf = diamondDb.db.map((x: string) => keccak256(x));
    let merkleTree = new MerkleTree(leaf, keccak256, { sortPairs: true });
    let buf2hex = (x: any) => '0x' + x.toString('hex');
    console.log('Root', buf2hex(merkleTree.getRoot()));
    const roothash = merkleTree.getRoot();
    // const buf2hexleaves = (x: any) => x.toString('hex');
    const index = diamondDb.db.indexOf(
      toChecksumAddress(this.account.walletAddress)
    );
    console.log(index);

    let gleaf = goldDb.db.map((x: string) => keccak256(x));
    let gmerkleTree = new MerkleTree(gleaf, keccak256, { sortPairs: true });
    let gbuf2hex = (x: any) => '0x' + x.toString('hex');
    console.log('gRoot', gbuf2hex(gmerkleTree.getRoot()));
    const groothash = gmerkleTree.getRoot();
    // const buf2hexleaves = (x: any) => x.toString('hex');
    const gindex = goldDb.db.indexOf(
      toChecksumAddress(this.account.walletAddress)
    );
    console.log(gindex);

    if (index >= 0) {
      const _claimingAddress = leaf[index];
      const hexProof = merkleTree.getHexProof(_claimingAddress);
      console.log('Diamond', hexProof);
      isDiamondList = merkleTree.verify(hexProof, _claimingAddress, roothash);
      isGoldList = true;
      this.diamondListed = isDiamondList;
      this.goldListed = isGoldList;
    } else if (gindex > 0) {
      const _claimingAddress = gleaf[gindex];
      const ghexProof = gmerkleTree.getHexProof(_claimingAddress);
      console.log('Gold', ghexProof);
      isGoldList = gmerkleTree.verify(ghexProof, _claimingAddress, groothash);
      this.goldListed = isGoldList;
    }
  }

  countDown() {
    // Set the date we're counting down to
    var countDownDate = new Date('Feb 07, 2023 16:00:00').getTime();

    // Update the count down every 1 second
    setInterval(() => {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      const time = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

      this.times.days = days;
      this.times.hours = hours;
      this.times.minutes = minutes;
      this.times.second = seconds;
      // console.log(this.times)
    }, 1000);
  }
  countDown1() {
    // Set the date we're counting down to
    var countDownDate = new Date('Feb 07, 2023 16:00:00').getTime();

    // Update the count down every 1 second
    setInterval(() => {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      const time = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

      this.times1.days = days;
      this.times1.hours = hours;
      this.times1.minutes = minutes;
      this.times1.second = seconds;
      // console.log(this.times)
    }, 1000);
  }
  async setTime() {}
  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }
}
