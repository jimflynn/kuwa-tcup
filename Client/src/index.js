import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateKuwaId from './js/App';
import Navigation from './js/Navigation';

import { Provider } from 'react-redux';
import { store } from './js/store';

document.addEventListener("deviceready", init, false);

function init() {
    var permissions = cordova.plugins.permissions;
    var list = [
        // permissions.CAMERA,
        permissions.RECORD_AUDIO,
        permissions.READ_EXTERNAL_STORAGE,
        permissions.WRITE_EXTERNAL_STORAGE,
        // permissions.CAPTURE_AUDIO_OUTPUT,
        // permissions.CAPTURE_VIDEO_OUTPUT
    ];

    list.forEach(permission => {
        permissions.checkPermission(permission, successCallback, null);
        function successCallback(status) {
            if (!status.hasPermission) {
                permissions.requestPermission(permission, null, () => successCallback(status));
            }
        }
    })

    ReactDOM.render(
        <Provider store={store}>
            <Navigation />
        </Provider>, document.getElementById('navigationBar'));
    ReactDOM.render(
        <Provider store={store}>
            <CreateKuwaId />
        </Provider>, document.getElementById('root'));
}

// registerServiceWorker();