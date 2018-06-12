import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateKuwaId from './App';
import Navigation from './Navigation';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Navigation />, document.getElementById('navigationBar'));
ReactDOM.render(<CreateKuwaId />, document.getElementById('root'));
registerServiceWorker();
