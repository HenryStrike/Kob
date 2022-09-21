import { createSlice } from '@reduxjs/toolkit'
import $ from 'jquery'

const API_URL = "https://app3449.acapp.acwing.com.cn/api/user/friend/";

export const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        friend_list: [],
    },
    reducers: {
        updateFriendList: (state, action) => {
            state.friend_list = action.payload;
        },
    },
})

export const { updateFriendList } = friendSlice.actions

export const getFriendList = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "list/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        success(resp) {
            dispatch(updateFriendList(resp));
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const addFriend = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "add/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data : {
            id : data.id,
        },
        success(resp) {
            dispatch(getFriendList(data));
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const deleteFriend = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "delete/",
        type: "post",
        headers: { Authorization: "Bearer " + data.token },
        data : {
            user_id : data.id,
        },
        success(resp) {
            dispatch(getFriendList(data));
            data.success(resp);
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export default friendSlice.reducer
