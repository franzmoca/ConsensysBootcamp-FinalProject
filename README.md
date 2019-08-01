# ConsensysBootcamp-FinalProject-dSignThis!
A petition dApp on the Ethereum blockchain by Francesco Moca!

## Why this project?

Websites like change.org are still very popular despite having many issues, expecially related to the trust we need to have to a third party regarding our data. 
There are several reports both about the reselling of private data by petition website companies and also about the signing manipulation by fake users.

I believe a petition dApp is an excellent application of DLTs for privacy and security reasons.

This project was devoleped as my final project for the Blockchain Developer Bootcamp Spring 2019, and it's a functional PoC of this idea!

For the development I used Truffle, Visual Studio Code, Ganache-Cli, Metamask as tools, and React as my main frontend framework.

## Profect Structure.

There is just one smartcontract managing the logic of the dApp,  **Petition Manager** extended by two OpenZeppelin contracts, **Ownable** and **Pausable** used for some useful design pattern.

An user need to register himself (using createUser method) for creating a petition or just for voting.

The contract state keeps track on the voters and the creator user (identified by his address) can finally decide to close the petition preventing new subscriptions.

The main use cases of the smartcontract are tested in Javascript using Mocha testing framework.

## IPFS

For limiting the costly storage consumption in the Blockchain the images used in the dApp (the user avatars and the petition "banner") are stored in the blockchain using their ipfs hash. 

If an user doesn't specify his ipfs hash images, placeholders are loaded also using IPFS.

The user should independently upload the assets, using tools like pinata.cloud to pin it and then specify the relative hash.

I attempted to create an IPFS node runtime for downloading the images, but it slowed the UX of the dApp and I had issues managing the asyncronous loading of the images in a sane way.
(In the file ipfsDiscardedFunctions.js there is my in-browser node implementation idea )

At the end I decided to use a gateway for the image loading (ipfs.io) for a way better performance.

I didn't attempt to offer uploading functionality to the user because I didn't believe it's useful for this dApp without the file pinning part.

## ENS

One of the attributes that can be used to identify a single user is the **ENS** (Ethereum Name Service) that can be used for better recognize a person. 
When an user registers there is the possibility to specify its own ENS that is compared with the Metamask address using Web3 in a clientside check.
I didn't find a convenient way to crosscheck on-chain inside the smartcontract, but for sure it could be a nice addition to the project.

## Installation and testing

Make sure you have truffle and ganache-cli installed.

1. Clone this repository
2. "npm install" to install the OpenZeppelin contracts.
3. "cd client" and "yarn install" to install Web3 and React dependencies.
"npm install" should work too but it wasn't tested.
4. Run ganache-cli, import the mnemonic phrase to metamask and switch to localhost:8545 ethereum provider.
5. "truffle test" to test the correct compilation of the contracts and the  succesful passing of all tests.
6. Run "truffle migrate" to migrate the contracts to the local blockchain.
7. Run "npm run start" to run localserver and test in local the application.
8. Follow the demo in the video attached to see the main featurer of the dApp.


## Testnet

The smartcontract is deployed also on Ethereum Rinkeby Testnet, see "deployed_addresses.txt" for details.


