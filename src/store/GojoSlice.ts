import { createSlice } from "@reduxjs/toolkit";
import { Gojo } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Gojo = {
  x: 800,
  y: 200,
  health: {
    currentHealth: 100,
    maxHealth: 100,
  },
  cursedEnergy: 100,
  direction: "left",
  cleaveAttack: false,
  dismantleAttack: false,
  gojoDomainExpansion: false,
  gojoDirection: "stop",
  closeRange: false,
  canMove: false,
  rapidAttack: false,
  dashGauge: 0,
};

const gojoSlice = createSlice({
  name: "gojo",
  initialState: initialState,
  reducers: {
    movegojo(state, action) {
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
    movegojoTo(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    updategojoHealth(state, action) {
      state.health.currentHealth += action.payload;
    },
    gojoCleaveAttack(state, action) {
      state.cleaveAttack = action.payload;
    },
    gojoDismantleAttack(state, action) {
      state.dismantleAttack = action.payload;
    },
    setgojoDirection(state, action) {
      state.gojoDirection = action.payload;
    },
    setCloseRange(state, action) {
      state.closeRange = action.payload;
    },
    setgojoPosition(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    setgojoCanMove(state, action) {
      state.canMove = action.payload;
    },
    setRapidAttack(state, action) {
      state.rapidAttack = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setgojoCursedEnergy(state, action) {
      state.cursedEnergy = action.payload;
    },
    setgojoDomainExpansion(state, action) {
      state.gojoDomainExpansion = action.payload;
    },

    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  movegojo,
  updategojoHealth,
  gojoCleaveAttack,
  gojoDismantleAttack,
  setgojoDomainExpansion,
  setgojoDirection,
  setCloseRange,
  setgojoPosition,
  setgojoCanMove,
  setRapidAttack,
  setDashGauge,
  movegojoTo,
  setgojoCursedEnergy,
} = gojoSlice.actions;
export default gojoSlice;
