import $ from 'jquery';
import ACTIONS from './types';

const API_URL = "http://127.0.0.1:8080/user/bot/";

const getList = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "list/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        success(resp) {
            dispatch({
                type: ACTIONS.UPDATE_BOT_LIST,
                payload: resp,
            });
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        },
    });
}

const addBot = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "add/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            title : data.bot.title,
            description : data.bot.description,
            content : data.bot.content,
        },
        success(resp) {
            dispatch({
                type: ACTIONS.ADD_BOT,
                payload: {
                    ...data.bot,
                    score : 1000,
                    create_time : "null",
                    edit_time : "null",
                },
            });
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        }
    });
}

const removeBot = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "remove/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            bot_id: data.id,
        },
        success(resp) {
            dispatch({
                type : ACTIONS.REMOVE_BOT,
                payload : data.id,
            });
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        }
    });
}

        // $.ajax({
        //     url : "http://127.0.0.1:8080/user/bot/edit/",
        //     type : "post",
        //     headers : {Authorization : "Bearer " + token},
        //     data : {
        //         bot_id : 5,
        //         title : "botedit",
        //         description : "botedit",
        //         content : "includeedit",
        //     },
        //     success(resp){
        //         console.log(resp);
        //     },
        //     error(resp){
        //         console.log(resp);
        //     }
        // });

export default {
    getList,
    addBot,
    removeBot,
}