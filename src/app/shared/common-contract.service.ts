import { Injectable } from '@angular/core';
// import { Injectable } from '@angular/core';
import { Web3Service, StorageService, MetaMaskService } from 'ng-blockchainx';
import { environment } from 'src/environments/environment';
// import Web3 from 'web3';
const Web3 = require('web3');
import { BehaviorSubject, Observable } from 'rxjs';
const { TelegramClient } = require('messaging-api-telegram');
@Injectable({
  providedIn: 'root',
})
export class CommonContractService {
  public account: any;
  public accountObservable: Observable<any>;
  private chainId: string = '0x5';
  private contractAddress: any;
  private web3Service: Web3Service;
  public storage!: StorageService;
  public web3: any;
  public tx: any;
  public txObservable: any;
  public ethWeb3: any;
  private walletAddress: any;
  public walletAddressObserve: any;
  public userNativeBalance: any;
  public userNativeBalanceObservable!: Observable<boolean>;
  public isMetamaskConnected: boolean = false;
  public metamaskConnected: any;
  public isMetamaskConnectedObservable!: Observable<boolean>;
  public currentNetworkName: any = '';
  public currentNetworkSymbol: any = '';
  public currentNativeCurrency: any = '';
  public currentExplorer: any = ';';
  public globalObservable: any;
  public accountDetailsObservable: any;
  public TeleClient: any;
  public isWconnect: boolean = false;
  public networkDetails = {
    //do not change the order,double check the network logo  and symbol name,it should match the order
    // , '0x5', '0x13881', '0xa869', '0xfa2', '0x152', '0x507'
    chainId: ['0x5'],
    symbol: [
      'ethereum',
      'bsc',
      'polygon',
      'avalanchee',
      'fantom',
      'coronos',
      'MoonBase',
    ],
    name: [
      'Ethereum',
      'Bsc',
      'Polygon',
      'Avalanchee',
      'Fantom',
      'Coronos',
      'Moonbase Alpha',
    ],
    explorer: [
      'https://goerli.etherscan.io/tx/',
      'https://mumbai.polygonscan.com/tx/',
      'https://testnet.bscscan.com/tx/',
      
      'https://testnet.ftmscan.com/tx/',
      'https://testnet.snowtrace.io/tx/',

      'https://testnet.cronoscan.com/tx/',
      'https://moonbase.moonscan.io/tx/',
    ],
    currency: ['ETH', 'BNB', 'MATIC', 'AVAX', 'FTM', 'CRO', 'MOON'],
  };
  private connectMetaMask: any;
  public connectObservable!: Observable<any>;

  constructor(
    private _storage: StorageService,
    private _web3Service: Web3Service,
    private metaMaskService: MetaMaskService
  ) {
    this.connectMetaMask = new BehaviorSubject(false);
    this.connectObservable = this.connectMetaMask.asObservable();

    this.tx = new BehaviorSubject('');
    this.txObservable = this.tx.asObservable();

    this.metamaskConnected = new BehaviorSubject(false);
    this.isMetamaskConnectedObservable = this.metamaskConnected.asObservable();

    this.userNativeBalance = new BehaviorSubject('');
    this.userNativeBalanceObservable = this.userNativeBalance.asObservable();

    this.TeleClient = new TelegramClient({
      accessToken: '5688616246:AAFJNvRugh9UAgTYYHmBPl175OrTIaFIXR0',
    });

    if (environment.production == true) {
      this._storage.config(true);
    }
    this.walletAddress = new BehaviorSubject('');
    this.walletAddressObserve = this.walletAddress.asObservable();
    this.storage = this._storage;
    this.web3Service = this._web3Service;
    this.account = this.storage.get('account');

    (this.chainId = this.account ? this.account.chainId : '0x5'),
      this.getChainId((chainId: string) => {
        this.chainId = '0x5';
      });
    this.contractAddress = environment.CONTRACT_ADDRESS;

    this.account = new BehaviorSubject('');
    this.accountObservable = this.account.asObservable();
    this.web3Service.connect({
      chainId: '0x5',
      infuraApiKey: '49709bb81fa74b15a224e25af168c1ce',
    });
    this.web3 = this.web3Service.web3;
    this.ethWeb3 = this.web3Service.ethWeb3;
    new Web3(
      new Web3.providers.HttpProvider(
        'https://data-seed-prebsc-1-s1.binance.org:8545'
      )
    );
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org')
    );
  }
  /**
   * enable metamask connection
   * @param{boolean} data
   */
  public enableMetaMaskConnection(data: boolean) {
    this.connectMetaMask.next(data);
  }

  public async getChainId(cb: any) {
    const chainId = await this.metaMaskService.getChainId();
    cb(chainId);
  }
  public get Web3Service() {
    return this.web3Service;
  }

  public async getContractParams(contractType: string) {
    // @ts-ignore
    return {
      contractAddress: this.contractAddress[this.chainId][contractType],
      abi: require('src/contracts/' +
        this.chainId +
        '/' +
        contractType +
        '.json'),
    };
  }

  public async getAbi(contractType: string) {
    return require('src/contracts/' +
      this.chainId +
      '/' +
      contractType +
      '.json');
  }

  public async getContractAddress(contractType: string) {
    return this.contractAddress[this.chainId][contractType];
  }

  public async getContract(contractType: string) {
    const params = await this.getContractParams(contractType);

    return await this.web3Service.getContract(
      params.abi,
      params.contractAddress
    );
  }

  /**
   * Gets contract by address
   * @param contractType
   * @param contractAddress
   * @returns
   */
  public async getContractByAddress(
    contractType: string,
    contractAddress: string
  ) {
    const params = await this.getContractParams(contractType);
    return await this.web3Service.getContract(params.abi, contractAddress);
  }
  /**
   * get wallet adddress
   */
  public sendWalletAddress(address: string) {
    this.walletAddress.next(address);
  }
  public async getNativeCurrencyBalance(account: any) {
    let bnbBalanceInWallet = await this.ethWeb3.eth.getBalance(account);
    return (bnbBalanceInWallet = await this.ethWeb3.utils.fromWei(
      bnbBalanceInWallet
    ));
  }

  /**
   * Currents network details
   * @param networkDetailsIndex
   */
  public async currentNetworkDetails(networkDetailsIndex: any) {
    if (networkDetailsIndex >= 0) {
      this.currentNetworkName = this.networkDetails.name[networkDetailsIndex];
      this.currentNetworkSymbol =
        '/assets/icons/navbar/' +
        this.networkDetails.symbol[networkDetailsIndex] +
        '.svg';
      this.currentNativeCurrency =
        this.networkDetails.currency[networkDetailsIndex];
      this.currentExplorer = this.networkDetails.explorer[networkDetailsIndex];
      this.isMetamaskConnected = true;
      this.metamaskStatus(this.isMetamaskConnected);
    } else {
      this.currentNativeCurrency = '-';
    }
    console.log('isconnected', this.isMetamaskConnected);
  }

  public async setAccount(account: any) {
    await this.account.next(account);
    let balance = await this.getNativeCurrencyBalance(account.walletAddress);
    this.userNativeBalance.next(parseFloat(balance).toFixed(4));
  }

  public async isValidAddress(address: string) {
    try {
      let response = await this.ethWeb3.eth.getCode(address);
      let status;
      if (response == '0x') status = true;
      else status = false;
      return status;
    } catch (err) {
      return false;
    }
  }

  /**
   * Determines whether erc20 standard is
   * @param address
   * @returns
   */
  public async isERC20Standard(address: string) {
    try {
      let tokenContract = await this.getContractByAddress(
        'ERC20_TOKEN_CONTRACT',
        address
      );
      let name = await tokenContract.methods.name().call();
      let symbol = await tokenContract.methods.symbol().call();
      let decimal = await tokenContract.methods.decimals().call();
      let totalSupply = await tokenContract.methods.totalSupply().call();
      if (name && symbol && decimal && totalSupply) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      return false;
    }
  }

  /**
   * Decimals divider
   * @param [divider]
   * @param [value]
   * @returns
   */
  public decimalDivider(divider: number = 1, value: number = 0) {
    // @ts-ignore
    const web3 = new Web3(window['ethereum']);
    let originalValue;
    try {
      switch (Number(divider)) {
        case 18: {
          let weiValue = web3.utils.fromWei(value.toString(), 'ether');
          originalValue = weiValue;
          break;
        }

        case 9: {
          let weiValue = web3.utils.fromWei(value.toString(), 'gwei');
          originalValue = weiValue;
          break;
        }

        case 6: {
          let weiValue = web3.utils.fromWei(value.toString(), 'mwei');
          originalValue = weiValue;
          break;
        }

        default: {
          originalValue = Number(value) / 10 ** (18 - divider);
          break;
        }
      }
      return originalValue;
    } catch (e) {
      console.log('conversion exception..', e);
    } finally {
      return originalValue;
    }
  }
  /**
   * @param{boolean}status
   */

  metamaskStatus(status: boolean) {
    this.metamaskConnected.next(status);
  }


  txUpdate(status: any) {
    this.tx.next(status);
  }

  /**
   * To check sum address
   * @param address
   * @returns
   */
  public async toCheckSumAddress(address: string) {
    // return await Web3.utils.toChecksumAddress(address);
  }

  /**
   * Decodes parameter for token id
   * @param param
   * @returns
   */
  public async decodeParameterForTokenId(param: any) {
    return await this.ethWeb3.eth.abi.decodeParameter('uint256', param);
  }

  public async sendBotText(message: any) {
    let chat = await this.TeleClient.sendMessage('-883942928', message).then(
      () => {
        console.log('sent');

        return true;
      }
    );

    return true;
  }
}
