import React, { useEffect } from 'react';
import BaseContainer from '../../../components/BaseContainer';
import $ from 'jquery';
import { useSelector } from 'react-redux';

function UserBotIndexView() {

    const token = useSelector((state) => (state.user.token));

    useEffect(() => {
        // $.ajax({
        //     url : "http://127.0.0.1:8080/user/bot/add/",
        //     type : "post",
        //     headers : {Authorization : "Bearer " + token},
        //     data : {
        //         title : "bot123",
        //         description : "bot1 aadddd",
        //         content : "includeaaaaa",
        //     },
        //     success(resp){
        //         console.log(resp);
        //     },
        //     error(resp){
        //         console.log(resp);
        //     }
        // });
        // $.ajax({
        //     url : "http://127.0.0.1:8080/user/bot/remove/",
        //     type : "post",
        //     headers : {Authorization : "Bearer " + token},
        //     data : {
        //         bot_id : 3,
        //     },
        //     success(resp){
        //         console.log(resp);
        //     },
        //     error(resp){
        //         console.log(resp);
        //     }
        // });
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
        $.ajax({
            url : "http://127.0.0.1:8080/user/bot/list/",
            type : "get",
            headers : {Authorization : "Bearer " + token},
            success(resp){
                console.log(resp);
            },
            error(resp){
                console.log(resp);
            },
        });
    }, [token]);

    return ( 
        <BaseContainer>
            Bot
        </BaseContainer>
     );
}

export default UserBotIndexView;