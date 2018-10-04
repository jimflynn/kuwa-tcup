const Web3 = require('web3');

class KuwaRegistrationContract {

  constructor(config) {
    const ethNetworkUrl = config['ethNetworkUrl'];
    const address = config['address'];
    const abi = config['abi'];
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(ethNetworkUrl));
    if (address != null) {
      this.loadContract(abi, address, config);
    }
  }

  async loadContract(abi, address, config) {
    this.contract = await new this.web3.eth.Contract(JSON.parse(abi), address);
    this.status = Web3.utils.hexToUtf8(await this.contract.methods.getRegistrationStatus().call());
    if (config['callBack'] != null)
      config['callBack'](this, config);
  }

}

module.exports = KuwaRegistrationContract;
