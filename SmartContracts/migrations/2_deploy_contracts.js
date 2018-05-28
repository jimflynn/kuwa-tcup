var KuwaToken = artifacts.require("./KuwaToken");

module.exports = function(deployer) {
  deployer.deploy(KuwaToken, 1000000);
};
