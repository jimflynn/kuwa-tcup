import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let baseUrl = `http://localhost:3001/api`;
ReactDOM.render(<App baseUrl={ baseUrl }/>, document.getElementById('root'));
registerServiceWorker();
