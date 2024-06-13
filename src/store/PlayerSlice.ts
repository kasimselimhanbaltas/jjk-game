import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../App";

const initialState: Player = { x: 200, y: 350, health: 100, isPunching: false };

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    move(state, action) {
      console.log(
        "new position: ",
        action.payload.x + state.x,
        action.payload.y + state.y
      );
      if (state.x + action.payload.x > 0 && state.x + action.payload.x < 1200) {
        state.x += action.payload.x;
      } else {
        console.log("limit reached in x direction");
      }
      if (
        state.y + action.payload.y >= 0 &&
        state.y + action.payload.y <= 600
      ) {
        state.y += action.payload.y;
      } else {
        console.log("limit reached in y direction");
      }
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const { move } = playerSlice.actions;
export default playerSlice;
