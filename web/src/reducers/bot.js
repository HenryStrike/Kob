import ACTIONS from "../actions/types";

const BotReducer = (state = {
    bot_list : [],
}, action) => {
    const {type, payload} = action;
    switch(type) {
        case ACTIONS.UPDATE_BOT_LIST:
            return {
                ...state,
                bot_list : payload,
            };
        case ACTIONS.ADD_BOT:
            const added_list = state.bot_list.push(payload);
            return {
                ...state,
                bot_list : added_list,
            };
        case ACTIONS.REMOVE_BOT:
            const removed_list = state.bot_list.filter(item => item.id !== payload);
            return {
                ...state,
                bot_list : removed_list,
            };
        default:
            return state;
    }
}

export default BotReducer;