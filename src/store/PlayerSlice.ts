import { createSlice } from "@reduxjs/toolkit";
import { Player } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Player = {
  x: 200,
  y: 200,
  health: 1000,
  direction: "right",
  isAttacking: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    movePlayer(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      // console.log("new position: ", inputX + state.x, inputY + state.y);
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 120) {
        state.x += inputX;
        if (inputX > 0) {
          state.direction = "right";
        } else if (inputX < 0) state.direction = "left";
      } else {
        console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 220) {
        state.y += inputY;
      } else {
        console.log("limit reached in y direction");
      }
    },
    healthReducer(state, action) {
      state.health += action.payload;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const { movePlayer, healthReducer } = playerSlice.actions;
export default playerSlice;
