import ACTIONS from "../actions/types";

const MessageReducer = (state = {
    message : "",
}, action) => {
    const {type, payload} = action;
    switch(type) {
        case ACTIONS.SET_MESSAGE:
            return {
                ...state,
                message : payload,
            };
        case ACTIONS.CLEAR_MESSAGE:
            return {
                ...state,
                message : "",
            };
        default:
            return state;
    }
}

export default MessageReducer;