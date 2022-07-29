import ACTIONS from "./types";

const set = (message) => {
    return {
        type : ACTIONS.SET_MESSAGE,
        payload : message,
    }
};

const clear = () => {
    return {
        type : ACTIONS.CLEAR_MESSAGE,
        payload : "",
    }
};

export default {
    set,
    clear,
}