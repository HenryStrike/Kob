import { createSlice } from '@reduxjs/toolkit'
import $ from 'jquery';

//const API_URL = "https://app3449.acapp.acwing.com.cn/api/rank/";
const API_URL = "http://127.0.0.1:8080/api/rank/";

export const rankSlice = createSlice({
    name: 'rank',
    initialState: {
        rank_list: [],
    },
    reducers: {
        updateRankList: (state, action) => {
            state.rank_list = action.payload;
        },
    },
})

export const { updateRankList } = rankSlice.actions

export const getList = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "list/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            page: data.page,
        },
        success(resp) {
            dispatch(updateRankList(resp.users));
            data.updatePages(resp.users_cnt);
        },
    });
}

export default rankSlice.reducer
