// migrations/2_deploy_hello.js

// Import the HelloWorld contract...
const KuwaFaucet = artifacts.require("KuwaFaucet");


module.exports = (deployer) => {
  // Deploy it!
  deployer.deploy(KuwaFaucet);
}