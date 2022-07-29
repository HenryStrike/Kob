import ACTIONS from '../actions/types';

const UserReducer = (state = {
    id: null,
    username: "",
    photo: "",
    token: "",
    isLoggedIn: false,
    isPulling : true,
}, action) => {
    const { type, payload } = action;
    switch (type) {
        case ACTIONS.UPDATE_USER_INFO:
            return {
                ...state,
                id: payload.id,
                username: payload.username,
                photo: payload.photo,
                isLoggedIn: payload.isLoggedIn,
            };
        case ACTIONS.UPDATE_TOKEN:
            return {
                ...state,
                token: payload,
            }
        case ACTIONS.UPDATE_PULLING:
            return {
                ...state,
                isPulling : payload,
            }
        default:
            return state;
    }
}

export default UserReducer;