import { createSlice } from '@reduxjs/toolkit'
import $ from 'jquery'

const API_URL = "http://127.0.0.1:8080/user/bot/";

export const botSlice = createSlice({
    name: 'bot',
    initialState: {
        bot_list: [],
    },
    reducers: {
        updateBotList: (state, action) => {
            state.bot_list = action.payload;
        },
    },
})

export const { updateBotList } = botSlice.actions

export const getList = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "list/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        success(resp) {
            dispatch(updateBotList(resp));
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const addBot = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "add/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            title: data.bot.title,
            description: data.bot.description,
            content: data.bot.content,
        },
        success(resp) {
            if (resp.runtime_message === "addBot success") {
                dispatch(getList(data));
                data.success(resp);
            } else {
                data.error(resp);
            }
        },
        error(resp) {
            data.error(resp);
        }
    });
}

export const removeBot = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "remove/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            bot_id: data.id,
        },
        success(resp) {
            dispatch(getList(data));
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        }
    });
}

export const editBot = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "edit/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            bot_id: data.bot.id,
            title: data.bot.title,
            description: data.bot.description,
            content: data.bot.content,
        },
        success(resp) {
            if (resp.runtime_message === "editBot success") {
                dispatch(getList(data));
                data.success(resp);
            } else {
                data.error(resp);
            }
        },
        error(resp) {
            data.error(resp);
        }
    });
}

export default botSlice.reducer