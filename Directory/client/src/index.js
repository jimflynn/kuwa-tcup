import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//import fs from 'fs';

//let baseUrl = JSON.parse(fs.readFileSync("../../config.json"))['api_base_url'];
let baseApiUrl = "http://alpha.kuwa.org:3010/api";
let etherScanBaseUrl = "https://rinkeby.etherscan.io/address/";
ReactDOM.render(<App baseApiUrl={ baseApiUrl } etherScanBaseUrl={ etherScanBaseUrl }/>, document.getElementById('root'));
registerServiceWorker();
