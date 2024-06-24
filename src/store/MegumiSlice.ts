import { createSlice } from "@reduxjs/toolkit";
import { Megumi } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const initialState: Megumi = {
  x: 200,
  y: 200,
  health: {
    currentHealth: 2000,
    maxHealth: 2000,
  },
  cursedEnergy: {
    currentCursedEnergy: 200,
    maxCursedEnergy: 200,
  },
  direction: "right",
  isAttacking: false,
  canMove: true,
  dashGauge: 0,
  rivalDirection: "stop",
};

const megumiSlice = createSlice({
  name: "megumi",
  initialState: initialState,
  reducers: {
    moveCharacter(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 70) {
        state.x += inputX;
        //   if (inputX > 0) {
        //     state.direction = "right";
        //   } else if (inputX < 0) state.direction = "left";
      } else {
        // console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 150) {
        state.y += inputY;
      } else {
        // console.log("limit reached in y direction");
      }
    },
    moveCharacterTo(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    healthReducer(state, action) {
      state.health.currentHealth += action.payload;
    },
    changeCursedEnergy(state, action) {
      state.cursedEnergy.currentCursedEnergy += action.payload;
    },
    setCursedEnergy(state, action) {
      state.cursedEnergy.currentCursedEnergy = action.payload;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setCanMove(state, action) {
      state.canMove = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setRivalDirection(state, action) {
      state.rivalDirection = action.payload;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveCharacter,
  healthReducer,
  changeCursedEnergy,
  setDirection,
  setCanMove,
  setCursedEnergy,
  moveCharacterTo,
  setDashGauge,
} = megumiSlice.actions;
export default megumiSlice;
