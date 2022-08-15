import { createSlice } from '@reduxjs/toolkit'

export const snakeGameSlice = createSlice({
  name: 'game',
  initialState: {
    socket : null,
    status : "matching", // matching view and playing view
    opponent_username : "My opponent",
    opponent_photo : "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
    game_map : null,
    a_id : 0,
    a_sx : 0,
    a_sy : 0,
    b_id : 0, 
    b_sx : 0,
    b_sy : 0,
    game_object : null,
    loser : "",
  },
  reducers: {
    updateSocket: (state, action) => {
      state.socket = action.payload;
    },
    updateOpponent: (state, action) => {
      state.opponent_photo = action.payload.photo;
      state.opponent_username = action.payload.username;
    },
    updateStatus: (state, action) => {
      state.status = action.payload;
    },
    updateGame: (state, action) => {
      state.game_map = action.payload.game_map;
      state.a_id = action.payload.a_id;
      state.a_sx = action.payload.a_sx;
      state.a_sy = action.payload.a_sy;
      state.b_id = action.payload.b_id;
      state.b_sx = action.payload.b_sx;
      state.b_sy = action.payload.b_sy;
    },
    updateGameObject: (state, action) => {
      state.game_object = action.payload;
    },
    updateGameMove: (state, action) => {
      state.game_object.set_directions(action.payload);
    },
    updateGameResult: (state, action) => {
      state.game_object.set_status(action.payload);
      state.loser = action.payload.loser;
    },
  },
})

export const { updateSocket, updateOpponent, updateStatus, updateGame, updateGameObject, updateGameMove, updateGameResult } = snakeGameSlice.actions

export default snakeGameSlice.reducer
