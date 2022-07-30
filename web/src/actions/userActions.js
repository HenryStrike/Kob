import $ from 'jquery';
import ACTIONS from './types';

const API_URL = "http://127.0.0.1:8080/user/account/";

const login = (data) => (dispatch) => {
    // use async dispatch to make sure data is pre-modified
    $.ajax({
        url : API_URL + "token/",
        type : "post",
        data : {
            "username" : data.username,
            "password" : data.password,
        },
        success(resp){
            if(resp.runtime_message === "getToken success"){
                localStorage.setItem("token", resp.token);
                dispatch({
                    type : ACTIONS.UPDATE_TOKEN,
                    payload : resp.token,
                });
                data.success(resp);
            }else{
                data.error(resp);
            }
        },
        error(resp){
            data.error(resp);
        },
    });
};

const getInfo = (data) => (dispatch) => {
    $.ajax({
        url : API_URL + "info/",
        type : "get",
        headers : {Authorization : "Bearer " + data.token},
        success(resp){
            if(resp.runtime_message === "getInfo success"){
                dispatch({
                    type : ACTIONS.UPDATE_USER_INFO,
                    payload : {
                        ...resp,
                        isLoggedIn : true,
                    }
                });
                data.success(resp);
            }else{
                data.error(resp);
            }
        },
        error(resp){
            data.error(resp);
        },
    });
};

const logout = () => (dispatch) => {
    dispatch({
        type : ACTIONS.UPDATE_TOKEN,
        payload : "",
    });
    dispatch({
        type : ACTIONS.UPDATE_USER_INFO,
        payload : {
            id : null,
            username : "",
            photo : "",
            isLoggedIn : false,
        },
    });
    localStorage.removeItem("token");
};

const regiser = (data) => (dispatch) => {
    $.ajax({
        url : API_URL + "register/",
        type : "post",
        data : {
            "username" : data.username,
            "password" : data.password,
            "confirmedPassword" : data.confirmedPassword
        },
        success(resp){
            if(resp.runtime_message === "register success"){
                data.success(resp);
            }else{
                data.error(resp);
            }
        },
        error(resp){
            data.error(resp);
        },
    });
}

export default {
    login,
    getInfo,
    logout,
    regiser,
}