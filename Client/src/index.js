import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'video.js/dist/video-js.min.css';
// import 'videojs-record/dist/css/videojs.record.min.css';
import App from './js/App';

import { Provider } from 'react-redux';
import { store } from './js/store';

const renderDom = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, document.getElementById('root'));
}

const init = () => {
    let permissions = cordova.plugins.permissions;
    let list = [
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
    renderDom();
}

if (window.usingCordova) {
    document.addEventListener("deviceready", init, false);
} else {
    renderDom();
}