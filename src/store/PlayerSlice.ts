import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../App";

const initialState: Player = { x: 200, y: 350, health: 100, isPunching: false };

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    move(state, action) {
      state.x += action.payload.x;
      state.y += action.payload.y;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const { move } = playerSlice.actions;
export default playerSlice;
