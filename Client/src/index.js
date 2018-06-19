import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateKuwaId from './js/App';
import Navigation from './js/Navigation';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Navigation />, document.getElementById('navigationBar'));
ReactDOM.render(<CreateKuwaId />, document.getElementById('root'));
// registerServiceWorker();