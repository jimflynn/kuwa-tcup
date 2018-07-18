import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import fs from 'fs';

let baseUrl = JSON.parse(fs.readFileSync("../../config.json"))['api_base_url'];
ReactDOM.render(<App baseUrl={ baseUrl }/>, document.getElementById('root'));
registerServiceWorker();
