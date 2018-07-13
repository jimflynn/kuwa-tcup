import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import  { createLogger } from 'redux-logger';

import kuwaReducer from './reducers/kuwaReducer';
import screenReducer from './reducers/screenReducer';
import videoReducer from './reducers/videoReducer';

const actionLogger = createLogger();

export const store = createStore(combineReducers({
    kuwaReducer,
    screenReducer,
    videoReducer
}), {}, applyMiddleware(actionLogger, thunk));
