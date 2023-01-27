import { Component, OnInit, HostListener } from '@angular/core';
// import Metamask service on component in which you need
import {
  MetaMaskService,
  StorageService,
  WalletConnectService,
} from 'ng-blockchainx';
// import { ToastrService } from 'ngx-toastr';
import { CommonContractService } from '../common-contract.service';
// add metamask service as DI ( dependency injection )
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
// declare var WalletConnect: any;
declare var WalletConnectQRCodeModal: any;
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public metaMaskSubscription: any;
  public isMetaMaskConnected: boolean = false;
  public connectedChainId: any;
  public walletAddress: any;
  public currentNativeCurrency: any;
  public currentNetworkName: any;
  public currentNetworkSymbol: any;
  public currentExplorer: any;
  public currentNetworkDetails: any = [];
  public isMetamaskConnected: boolean = false;
  public isMobileNavExpanded: boolean = false;
  public isScrolled = false;
  public account: any;
  public observable: any;
  public userNativeBalance: any;
  public isWalletConnected = false;
  public iswConnect = false;
  public triggerConnect = false;
  public networkDetails = {
    //do not change the order,double check the network logo  and symbol name,it should match the order
    chainId: ['0x5'],
  };

  constructor(
    private metaMaskService: MetaMaskService,
    // private toastr: ToastrService,
    private storage: StorageService,
    private walletConnectService: WalletConnectService,
    private commonContractService: CommonContractService // private storage: StorageService
  ) {}

  async ngOnInit() {
    // // this.walletConnect()
    this.metaMaskService.setSupportedChains(['0x5']);

    this.commonContractService.accountObservable.subscribe(
      async (res: string) => {
        if (res) {
          this.account = await res;
          console.log('wallet details', this.account.walletAddress);
        }
      }
    );
    // this.walletConnectService.connectionListener.subscribe((response:any) => {
    //   if (response.code == 250700) {
    //     this.logout()
    //     // this.disconnect(false);
    //   } else {
    //     if (response.data['account']) {
    //       localStorage.setItem('isMetaConnected','false')
    //       localStorage.setItem('isW','true')
    //       localStorage.setItem('response.account',response.data.account[0])
    //       localStorage.setItem('response.chain',response.data.chainId)
    //       console.log('chain',response.data.chainId)
    //       this.iswConnect=true
    //       this.commonContractService.setAccount({
    //         walletAddress: response.data.account[0],
    //         chainId: response.data.chainId,
    //       });
    //       this.iswConnect=true
    //       this.commonContractService.isWconnect=true
    //       window.location.reload()
    //       // this.validateAccount(response.data['account'][0]);
    //       // this.closeConnectWallet();
    //     }
    //   }
    // });
    this.commonContractService.userNativeBalance.subscribe((res: any) => {
      this.userNativeBalance = res;
      console.log('balalalalalla',res)
    });
    // if(localStorage.getItem('isW')=='true'){
    //   this.iswConnect=true
    //   this.commonContractService.isWconnect=true
    //   this.commonContractService.setAccount({
    //     walletAddress: localStorage.getItem('response.account'),
    //     chainId: localStorage.getItem('chain'),
    //   });
    //   if(localStorage.getItem('response.chain')!='80001'){
    //     // alert('Connect to BSC Mainnet network')
    //   }
    // }

    let isMetaMaskConnected = localStorage.getItem('isMetaConnected');
    if (this.account != null || isMetaMaskConnected == 'true') {
      this.walletConnection();
    }

    // console.log(localStorage.getItem('walletconnect'))
    let b: any = localStorage.getItem('walletconnect');
    b = JSON.parse(b);
    if(b?.connected){
      this.commonContractService.setAccount({
        walletAddress: b.accounts[0],
        chainId: '0x5',
      });
      this.iswConnect = true;
    }
  
    

    
    //       window.location.reload()
  }

  async connectMetaMask() {
    try {
      this.walletConnection();
      const connection: any = await this.metaMaskService
        .connectMetaMask()
        .catch((error: any) => {
          console.log(error);
          // this.toastr.error(error.data.message);
        });
      if (connection) {
        this.walletConnection();
        this.isMetaMaskConnected = true;
        localStorage.setItem(
          'isMetaConnected',
          JSON.stringify(this.isMetaMaskConnected)
        );
        window.location.reload();
      }
    } catch (exception) {
      console.log('Exception ', exception);
    }
  }

  walletConnection() {
    this.metaMaskSubscription =
      this.metaMaskService.connectionListener.subscribe((response: any) => {
        console.log('response code', response);

        if (response.code == 250601) {
          localStorage.setItem('isW', 'false');
          console.log('aaaaaaaaaaa', this.isMetaMaskConnected);
          // this.isMetaMaskConnected=true;
          this.setaccount(response.data);

          // window.location.reload();
          this.connectionHandler(response.data);
          // this.validateNetwork(response.data.chainId);
          this.setNetworkDetails(response.data);
          this.commonContractService.setAccount({
            walletAddress: this.walletAddress,
            chainId: response.data.chainId,
          });
          this.isWalletConnected = false;
        }

        if (response.code == 250611) {
          window.location.reload();
          this.setNetworkDetails(response.data);
          // this.commonContractService.setAccount({
          //   walletAddress: this.walletAddress,
          //   chainId: response.data.chainId,
          // });
        }

        if (response.code == 250610) {
          // chain changed
          console.log(response, 'chain changed');
          // localStorage.setItem('account',
          //   [walletAddress: this.walletAddress,
          //   chainId: response.data.chainId,
          //   ]);
          this.commonContractService.account = {
            walletAddress: this.walletAddress,
            chainId: response.data.chainId,
          };
          console.log('walletAddress', this.walletAddress);

          window.location.reload();
          this.setNetworkDetails(response.data);
        }
        if (response.code == 250512) {
          this.setNativeCurrencyNull();
        }
        console.log('oninit', response);
        if (response.code == 250641) {
          alert('Wrong network, Please change to bsc main network');
          // this.isChooseWrongNetworkShown = true;
        }
      });
  }

  public async walletConnect() {
    await this.walletConnectService.openWalletConnectModal();
  }

  setaccount(account: any) {
    this.connectedChainId = account.chainId;
    this.walletAddress = account.account[0];

    // localStorage.setItem('account', {
    //   walletAddress: this.walletAddress,
    //   chainId: this.connectedChainId,
    // });

    this.isMetaMaskConnected = true;
  }

  async setNetworkDetails(response: any) {
    let networkDetailsIndex = this.networkDetails.chainId.indexOf(
      response.chainId
    );
    if (networkDetailsIndex >= 0) {
      this.setCurrentNetworkSetails(networkDetailsIndex);
    }
  }

  setCurrentNetworkSetails(networkDetailsIndex: any) {
    if (networkDetailsIndex >= 0) {
      this.currentNetworkName =
        this.commonContractService.networkDetails.name[networkDetailsIndex];
      this.currentNetworkSymbol =
        'assets/images/network/' +
        this.commonContractService.networkDetails.symbol[networkDetailsIndex] +
        '.svg';
      this.currentNativeCurrency =
        this.commonContractService.networkDetails.currency[networkDetailsIndex];
      this.currentExplorer =
        this.commonContractService.networkDetails.explorer[networkDetailsIndex];
      this.isMetaMaskConnected = true;
      this.currentNetworkDetails.push(
        this.currentNetworkName,
        this.currentNetworkSymbol,
        this.currentNativeCurrency,
        this.currentExplorer
      );
      this.commonContractService.currentNetworkDetails(networkDetailsIndex);
      // this.commonContractService.sendCurrentNetworkDetails(this.currentNetworkDetails)
    } else {
      this.currentNativeCurrency = '-';
    }
    console.log('isconnected', this.isMetamaskConnected);
  }
  connectionHandler(account: any) {
    this.connectedChainId = account.chainId;
    this.walletAddress = account.account[0];

    this.commonContractService.sendWalletAddress(this.walletAddress);
    this.isMetaMaskConnected = true;
  }
  setNativeCurrencyNull() {
    this.storage.remove('connection');
    this.storage.remove('account');
    localStorage.setItem('nativeCurrency', '-');
    localStorage.setItem('isMetaConnected', 'false');
  }

  // async changeNetwork(index: any) {
  //   try {
  //     const chainInfo = await this.metaMaskService.chainDetails(
  //       environment.ALLOWED_NETWORKS[index]
  //     );
  //     console.log('chain info', chainInfo);
  //     const chainIdToHex = this.commonContractService.ethWeb3.utils.toHex(
  //       chainInfo.chainId
  //     );
  //     const addTokenParam = {
  //       method: 'wallet_addEthereumChain',
  //       params: [
  //         {
  //           chainId: chainIdToHex,
  //           chainName: chainInfo.name,
  //           nativeCurrency: chainInfo.nativeCurrency,
  //           rpcUrls: chainInfo.rpc,
  //           blockExplorerUrls: chainInfo.explorers.url,
  //         },
  //       ],
  //     };
  //     console.log('addTokenParam', addTokenParam);
  //     this.metaMaskService.addNetwork(addTokenParam);
  //     if (chainInfo) {
  //       this.metaMaskService.changeNetwork(environment.ALLOWED_NETWORKS[index]);
  //     }
  //   } catch (error) {
  //     // this.toastr.error('error');
  //   }
  // }

  toggleMobileNav() {
    this.isMobileNavExpanded = !this.isMobileNavExpanded;
  }
  @HostListener('window:scroll')
  scrollEvent() {
    window.scrollY >= 50 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

  logout() {
    this.setNativeCurrencyNull();
    this.isMetaMaskConnected = false;
    localStorage.setItem(
      'isMetaConnected',
      JSON.stringify(this.isMetaMaskConnected)
    );
    localStorage.setItem('isW', 'false');
    localStorage.removeItem('response.account');
    localStorage.removeItem('walletconnect');
    localStorage.removeItem('isMetaConnected');
    localStorage.removeItem('isW');
    localStorage.removeItem('response.chain');
    window.location.reload();
  }
  async connect() {
    this.triggerConnect = true;
  }
  async closeConnect() {
    this.triggerConnect = false;
  }

  _connect() {
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
      qrcodeModalOptions: {
        mobileLinks: ['metamask'],
      },
    });

    // Check if connection is already established
    connector.createSession();

    // Subscribe to connection events
    connector.on('connect', async (error, payload) => {
      if (error) {
        throw error;
      } else {
        
    localStorage.setItem('isMetaConnected', 'false');
    localStorage.setItem('isW', 'true');

    this.iswConnect = true;
   
    this.commonContractService.isWconnect = true;
        window.location.reload();
      }

      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];

      console.log(accounts);

      const msgParams = [
        accounts[0],
        `0x${this.toHex('this is the message')}`, // Required
      ];

      // Sign message
      await connector
        .signPersonalMessage(msgParams)
        .then(async (sig) => {
          // Returns signature.
          console.log(sig);
        })
        .catch((error) => {
          // Error returned when rejected
          console.error(error);
        });
    });

    connector.on('session_update', async (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
    });

    connector.on('disconnect', async (error, payload) => {
      if (error) {
        throw error;
      }
    });
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }
}
