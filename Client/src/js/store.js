import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createBrowserHistory, createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk';
import  { createLogger } from 'redux-logger';

import kuwaReducer from './reducers/kuwaReducer';
import screenReducer from './reducers/screenReducer';
import videoReducer from './reducers/videoReducer';

import config from 'config';

const actionLogger = createLogger();

const rootReducer = combineReducers({
    kuwaReducer,
    screenReducer,
    videoReducer
})


let history;
if (window.usingCordova) {
    history = createHashHistory();
} else {
    history = createBrowserHistory({
        basename: config.baseUrl
    });
}

export { history }
export const store = createStore(connectRouter(history)(rootReducer), {}, applyMiddleware(actionLogger, thunk, routerMiddleware(history)));
