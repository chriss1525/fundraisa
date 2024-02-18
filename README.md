# fundraisa

Welcome to Fundraisa, your decentralized fundraising application on the Internet Computer (ICP). Fundraisa empowers users to create and contribute to fundraising campaigns in a decentralized and transparent environment. This app is designed for the common Mwananci to crowdfund for their financial needs, be it school fees, a wedding, health bills, or any other need. Please note that no political campaigns are allowed.

To get started with Fundraisa, explore the project directory structure and the default configuration files. This README provides essential information on setting up your development environment and running the application locally.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with fundraisa, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd fundraisa/ dfx help dfx canister --help
```


## Running the project locally

If you want to test your project locally, you can use the following commands:

```
# Starts the replica, running in the background

dfx start --background

#Deploys your canisters to the replica and generates your candid interface

dfx deploy
```


**Note:** The first time you deploy, you should run the build script to set the backend canister ID in the donor.mo:


On consecutive builds, you can just run `dfx deploy` as usual.

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
 npm run generate
 ```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port  4943.

## Contributions

Looking to collaborate on this project? Feel free to fork the repo, create an issue and help us make the world a better place!! 

