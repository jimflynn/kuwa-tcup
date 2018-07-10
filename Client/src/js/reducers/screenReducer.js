import { 
    TOGGLE_COLLAPSE,
    TOGGLE_PASSWORD_VISIBILITY    
} from '../actions/types';

const initialState = {
    setPassword: {
        collapsed: true,
        showPassword: false
    },
    requestSponsorship: {
        collapsed: true,
        showPassword: false
    },
    uploadToStorage: {
        collapsed: true,
        showPassword: false
    }
}

const screenReducer = (state = initialState, action) => {
    switch(action.type) {
        case TOGGLE_COLLAPSE:
            return Object.assign({}, state, {
                [action.payload]: Object.assign({}, state[action.payload], {
                    collapsed: !state[action.payload].collapsed
                })
            })
        case TOGGLE_PASSWORD_VISIBILITY:
            return Object.assign({}, state, {
                [action.payload]: Object.assign({}, state[action.payload], {
                    showPassword: !state[action.payload].showPassword
                })
            })
        default:
            return state
    }
}

export default screenReducer;