import { createSlice } from "@reduxjs/toolkit";
import { Sukuna } from "../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Sukuna = {
  x: 800,
  y: 200,
  health: 100,
  cursedEnergy: 100,
  maxCursedEnergy: 200,
  direction: "left",
  cleaveAttack: false,
  dismantleAttack: false,
  rivalDomainExpansion: false,
  rivalDirection: "stop",
  closeRange: false,
  canMove: true,
  rapidAttack: false,
  dashGauge: 0,
};

const RivalSlice = createSlice({
  name: "Sukuna",
  initialState: initialState,
  reducers: {
    moveCharacter(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 100) {
        state.x += inputX;
        // if (inputX > 0) {
        //   state.direction = "right";
        // } else state.direction = "left";
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
    updateRivalHealth(state, action) {
      state.health += action.payload;
    },
    rivalCleaveAttack(state, action) {
      state.cleaveAttack = action.payload;
    },
    rivalDismantleAttack(state, action) {
      state.dismantleAttack = action.payload;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setCloseRange(state, action) {
      state.closeRange = action.payload;
    },
    setRivalPosition(state, action) {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    setCanMove(state, action) {
      state.canMove = action.payload;
    },
    setRapidAttack(state, action) {
      state.rapidAttack = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setCursedEnergy(state, action) {
      state.cursedEnergy = action.payload;
    },
    changeCursedEnergy(state, action) {
      state.cursedEnergy += action.payload;
    },
    setRivalDomainExpansion(state, action) {
      state.rivalDomainExpansion = action.payload;
    },

    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveCharacter,
  updateRivalHealth,
  rivalCleaveAttack,
  rivalDismantleAttack,
  setRivalDomainExpansion,
  setDirection,
  setCloseRange,
  setRivalPosition,
  setCanMove,
  setRapidAttack,
  setDashGauge,
  moveCharacterTo,
  setCursedEnergy,
  changeCursedEnergy,
} = RivalSlice.actions;
export default RivalSlice;
