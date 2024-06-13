import { createSlice } from "@reduxjs/toolkit";
import { Nue, Player } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Nue = {
  x: 200,
  y: 200,
  health: 100,
  direction: "right",
  isAttacking: false,
};

const nueSlice = createSlice({
  name: "nue",
  initialState: initialState,
  reducers: {
    moveNue(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      console.log("sukuna's position: ", inputX, inputY);

      if (Math.sign(state.x - inputX) < 0) {
        state.direction = "right";
      } else if (Math.sign(state.x - inputX) > 0) state.direction = "left";
      state.x = inputX;
      state.y = inputY;
    },
    nueAttacking(state, action) {
      state.isAttacking = action.payload;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const { moveNue, nueAttacking } = nueSlice.actions;
export default nueSlice;
