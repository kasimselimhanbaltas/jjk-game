import { createSlice } from "@reduxjs/toolkit";
import { Rival } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Rival = {
  x: 800,
  y: 200,
  health: 100,
  direction: "left",
  isAttacking: false,
  rivalDirection: "stop",
  closeRange: false,
};

const RivalSlice = createSlice({
  name: "Rival",
  initialState: initialState,
  reducers: {
    moveRival(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      // console.log("new position: ", inputX + state.x, inputY + state.y);
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 300) {
        state.x += inputX;
        if (inputX > 0) {
          state.direction = "right";
        } else state.direction = "left";
      } else {
        console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 220) {
        state.y += inputY;
      } else {
        console.log("limit reached in y direction");
      }
    },
    updateRivalHealth(state, action) {
      state.health += action.payload;
    },
    rivalAttacking(state, action) {
      state.isAttacking = action.payload;
    },
    setRivalDirection(state, action) {
      state.rivalDirection = action.payload;
    },
    setCloseRange(state, action) {
      state.closeRange = action.payload;
    },
    setRivalPosition(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveRival,
  updateRivalHealth,
  rivalAttacking,
  setRivalDirection,
  setCloseRange,
  setRivalPosition,
} = RivalSlice.actions;
export default RivalSlice;
