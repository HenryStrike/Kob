import { createSlice } from '@reduxjs/toolkit'
import $ from 'jquery'

//const API_URL = "https://app3449.acapp.acwing.com.cn/api/user/account/";
const API_URL = "http://127.0.0.1:8080/api/user/account/";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        username: "",
        photo: "",
        token: "",
        score: null,
        isLoggedIn: false,
        isPulling: true,
    },
    reducers: {
        updateUserInfo: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.photo = action.payload.photo;
            state.score = action.payload.score;
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        updateToken: (state, action) => {
            state.token = action.payload;
        },
        updatePulling: (state, action) => {
            state.isPulling = action.payload;
        },
    },
})

export const { updateUserInfo, updateToken, updatePulling } = userSlice.actions

export const login = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "token/",
        type: "post",
        data: {
            "username": data.username,
            "password": data.password,
        },
        success(resp) {
            if (resp.runtime_message === "getToken success") {
                localStorage.setItem("token", resp.token);
                dispatch(updateToken(resp.token));
                data.success(resp);
            } else {
                data.error(resp);
            }
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const getInfo = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "info/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        success(resp) {
            if (resp.runtime_message === "getInfo success") {
                dispatch(updateUserInfo({
                    ...resp,
                    isLoggedIn: true,
                }));
                data.success(resp);
            } else {
                data.error(resp);
            }
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const logout = () => (dispatch) => {
    dispatch(updateToken(""));
    dispatch(updateUserInfo({
        id: null,
        username: "",
        photo: "",
        isLoggedIn: false,
    })
    );
    localStorage.removeItem("token");
}

export const regiser = (data) => {
    $.ajax({
        url: API_URL + "register/",
        type: "post",
        data: {
            "username": data.username,
            "password": data.password,
            "confirmedPassword": data.confirmedPassword
        },
        success(resp) {
            if (resp.runtime_message === "register success") {
                data.success(resp);
            } else {
                data.error(resp);
            }
        },
        error(resp) {
            data.error(resp);
        },
    });
}

export const checkLocalUser = (dispatch) => {
    // if the token valid
    const token = localStorage.getItem("token");
    if (token == null) {
        dispatch(updatePulling(false));
        return;
    }

    $.ajax({
        url: API_URL + "info/",
        type: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
        success(resp) {
            if (resp.runtime_message === "getInfo success") {
                // update user info
                dispatch(updateUserInfo({
                    ...resp,
                    isLoggedIn: true,
                })
                );
                dispatch(updatePulling(false));
                dispatch(updateToken(token));
            } else {
                dispatch(updatePulling(false));
            }
        },
        error() {
            dispatch(updatePulling(false));
        },
    });
}

export default userSlice.reducer