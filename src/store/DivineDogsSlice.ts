import { createSlice } from "@reduxjs/toolkit";
import { DivineDogs, Player } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: DivineDogs = {
  x: 200,
  y: 200,
  health: 100,
  direction: "right",
  isAttacking: false,
  isActive: false,
};

const divineDogsSlice = createSlice({
  name: "divineDogs",
  initialState: initialState,
  reducers: {
    moveDivineDogs(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;

      state.x = inputX;
      state.y = inputY;
    },
    divineDogsAttacking(state, action) {
      state.isAttacking = action.payload;
    },
    divineDogsActivity(state, action) {
      state.isActive = action.payload;
    },
    setDivineDogsDirection(state, action) {
      state.direction = action.payload;
    },
    // Diğer action'lar (yumrukAt, divineDogs çağırma, domain açma vb.)
  },
});

export const {
  moveDivineDogs,
  divineDogsAttacking,
  divineDogsActivity,
  setDivineDogsDirection,
} = divineDogsSlice.actions;
export default divineDogsSlice;
