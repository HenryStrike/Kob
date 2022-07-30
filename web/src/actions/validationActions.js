import $ from 'jquery';
import ACTIONS from './types';

const API_URL = "http://127.0.0.1:8080/user/account/";

const CheckLocalUser = (data) => (dispatch) => {
    // if the token valid
    const token = localStorage.getItem("token");
    $.ajax({
        url : API_URL + "info/",
        type : "get",
        headers : {
            Authorization : "Bearer " + token,
        },
        success(resp){
            if(resp.runtime_message === "getInfo success"){
                // update user info
                dispatch({
                    type : ACTIONS.UPDATE_USER_INFO,
                    payload : {
                        ...resp,
                        isLoggedIn : true,
                    }
                });
                dispatch({
                    type : ACTIONS.UPDATE_PULLING,
                    payload : false,
                })
                dispatch({
                    type : ACTIONS.UPDATE_TOKEN,
                    payload : token,
                })
                data.success(resp);
            }else{
                dispatch({
                    type : ACTIONS.UPDATE_PULLING,
                    payload : false,
                })
                data.error(resp);
            }
        },
        error(resp){
            dispatch({
                type : ACTIONS.UPDATE_PULLING,
                payload : false,
            })
            data.error(resp);
        },
    });
}

export default {
    CheckLocalUser,
}