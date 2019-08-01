const path = require("path");
var HDWalletProvider = require('truffle-hdwallet-provider')


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, ""),
      network_id: 3,          // Rinkeby's network id
      gas: 4000000,        
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, ''),
      network_id: 4,          // Rinkeby's network id
      gas: 5500000,        
    },

  }

};
