import { createSlice } from "@reduxjs/toolkit";
import { Nue, Megumi, Mahoraga } from "../../App";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Mahoraga = {
  x: 200,
  y: 200,
  health: {
    currentHealth: 1500,
    maxHealth: 1500,
  },
  direction: "right",
  canMove: true,
  isAttacking: false,
  isActive: false,
  animationState: "stance",
};

const mahoragaSlice = createSlice({
  name: "mahoraga",
  initialState: initialState,
  reducers: {
    moveCharacter(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 70) {
        state.x += inputX;
        if (inputX > 0) {
          state.direction = "right";
        } else if (inputX < 0) state.direction = "left";
      } else {
        // console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 150) {
        state.y += inputY;
      } else {
        // console.log("limit reached in y direction");
      }
    },
    // Move character without direction
    moveCharacterWD(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 70) {
        state.x += inputX;
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
    updateHealth(state, action) {
      state.health.currentHealth += action.payload;
    },
    setHealth(state, action) {
      state.health.currentHealth = action.payload;
    },
    // changeCursedEnergy(state, action) {
    //   state.cursedEnergy.currentCursedEnergy += action.payload;
    // },
    // setCursedEnergy(state, action) {
    //   state.cursedEnergy.currentCursedEnergy = action.payload;
    // },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setCanMove(state, action) {
      state.canMove = action.payload;
    },

    setAnimationState(state, action) {
      state.animationState = action.payload;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveCharacter,
  moveCharacterWD,
  moveCharacterTo,
  updateHealth,
  setHealth,
  setDirection,
  setCanMove,
  setAnimationState,
} = mahoragaSlice.actions;
export default mahoragaSlice;
