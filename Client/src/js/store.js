import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import  { createLogger } from 'redux-logger';
import promise from "redux-promise-middleware";

import kuwaReducer from './reducers/kuwaReducer';
import screenReducer from './reducers/screenReducer';
import videoReducer from './reducers/videoReducer';

const actionLogger = createLogger();
const promiseHandler = promise();

export const store = createStore(combineReducers({
    kuwaReducer,
    screenReducer,
    videoReducer
}), {}, applyMiddleware(actionLogger, promiseHandler, thunk));
