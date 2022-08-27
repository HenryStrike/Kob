import { createSlice } from '@reduxjs/toolkit'
import $ from 'jquery';

const API_URL = "http://127.0.0.1:8080/record/";

export const recordSlice = createSlice({
    name: 'record',
    initialState: {
        record_list: [],
        is_record : false,
        a_steps : [],
        b_steps : [],
        record_loser : "",
    },
    reducers: {
        updateRecordList: (state, action) => {
            state.record_list = action.payload;
        },
        updateIsRecord: (state, action) => {
            state.is_record = action.payload;
        },
        updateSteps: (state, action) => {
            state.a_steps = action.payload.a_steps;
            state.b_steps = action.payload.b_steps;
        },
        updateRecordLoser: (state, action) => {
            state.record_loser = action.payload;
        }
    },
})

export const { updateRecordList, updateIsRecord, updateSteps, updateRecordLoser } = recordSlice.actions

export const getList = (data) => (dispatch) => {
    $.ajax({
        url: API_URL + "list/",
        type: "get",
        headers: { Authorization: "Bearer " + data.token },
        data: {
            page: data.page,
        },
        success(resp) {
            dispatch(updateRecordList(resp.records));
            data.updatePages(resp.records_cnt);
        },
    });
}

export default recordSlice.reducer
