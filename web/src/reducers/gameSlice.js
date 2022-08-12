import { createSlice } from '@reduxjs/toolkit'

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    status : "matching", // matching view and playing view
    opponent_username : "My opponent",
    opponent_photo : "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
    game_map : null,
  },
  reducers: {
    updateOpponent: (state, action) => {
      state.opponent_photo = action.payload.photo;
      state.opponent_username = action.payload.username;
    },
    updateStatus: (state, action) => {
      state.status = action.payload;
    },
    updateGameMap: (state, action) => {
      state.game_map = action.payload;
    }
  },
})

export const { updateOpponent, updateStatus, updateGameMap } = gameSlice.actions

export default gameSlice.reducer
