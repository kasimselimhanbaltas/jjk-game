import { createSlice } from "@reduxjs/toolkit";
import { Rival } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Rival = {
  x: 800,
  y: 200,
  health: 100,
  cursedEnergy: 200,
  direction: "left",
  cleaveAttack: false,
  dismantleAttack: false,
  rivalDirection: "stop",
  closeRange: false,
  canMove: false,
  rapidAttack: false,
  dashGauge: 0,
};

const RivalSlice = createSlice({
  name: "Rival",
  initialState: initialState,
  reducers: {
    moveRival(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 300) {
        state.x += inputX;
        // if (inputX > 0) {
        //   state.direction = "right";
        // } else state.direction = "left";
      } else {
        // console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 220) {
        state.y += inputY;
      } else {
        // console.log("limit reached in y direction");
      }
    },
    moveRivalTo(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    updateRivalHealth(state, action) {
      state.health += action.payload;
    },
    rivalCleaveAttack(state, action) {
      state.cleaveAttack = action.payload;
    },
    rivalDismantleAttack(state, action) {
      state.dismantleAttack = action.payload;
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
    setRivalCanMove(state, action) {
      state.canMove = action.payload;
    },
    setRapidAttack(state, action) {
      state.rapidAttack = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setRivalCursedEnergy(state, action) {
      state.cursedEnergy = action.payload;
    },

    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveRival,
  updateRivalHealth,
  rivalCleaveAttack,
  rivalDismantleAttack,
  setRivalDirection,
  setCloseRange,
  setRivalPosition,
  setRivalCanMove,
  setRapidAttack,
  setDashGauge,
  moveRivalTo,
  setRivalCursedEnergy,
} = RivalSlice.actions;
export default RivalSlice;
