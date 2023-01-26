// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // TAILWIND_MODE: 'build',
 
  transactionURI: {
    '0x61': 'https://testnet.bscscan.com/tx/',
    '0xa869': 'https://testnet.snowtrace.io/tx/',
    '0x13881': 'https://mumbai.polygonscan.com/tx/',
    '0xfa2': 'https://testnet.ftmscan.com/tx/',
    '0x152': 'https://testnet.cronoscan.com/tx/',
    '0x507': 'https://moonbase.moonscan.io/tx/',
    '0x5': 'https://goerli.etherscan.io/tx/',
  },
 
  CONTRACT_ADDRESS: {
    '0x5': {
      PREMINT:'0xB735B490C5A3Fb511451EBE0A29565b27fb521F6'
    },
    '0x61': {
      PREMINT:'0x0fB5D4C4C20DF92F1657F97c916D0D51f401343d'
    },
    '0xfa2':{
      PREMINT:'0x3Ff73d0299f5c775Db850d79f60C149d9799AeC2'
    },
    '0x13881':{
      PREMINT:'0xc2Aeb6978Bb6DEB7D3E71f34de2417F058Ad8737'
    },
    '0xa869':{
      PREMINT:'0xc2Aeb6978Bb6DEB7D3E71f34de2417F058Ad8737'
    },
    '0x38':{
      PREMINT:'0x0fB5D4C4C20DF92F1657F97c916D0D51f401343d'
    },
    '0x56':{
      PREMINT:'0x0fB5D4C4C20DF92F1657F97c916D0D51f401343d'
    },
    '0x1':{
      PREMINT:'0x0fB5D4C4C20DF92F1657F97c916D0D51f401343d'
    }
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
