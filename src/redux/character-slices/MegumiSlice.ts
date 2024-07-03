import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Megumi } from "../../App";
import { AppThunk } from "../GlobalStore";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const initialState: Megumi = {
  characterName: "megumi",
  x: 200,
  y: 200,
  health: {
    currentHealth: 1500,
    maxHealth: 1500,
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
  callNueCD: {
    isReady: true,
    cooldown: 5,
    remainingTime: 0,
  },
  nueAttackCD: {
    isReady: true,
    cooldown: 2,
    remainingTime: 0,
  },
  divineDogsCD: {
    isReady: true,
    cooldown: 10,
    remainingTime: 0,
  },
  isBlocking: false,
  // animationState: "stance" | "move" | "jump" | "punch" | "block" | "callNue" | "nueAttack" | "divineDogs",
  animationState: "stance",
  velocityY: 0,
  isJumping: false,
  gravity: 5,
  jumpStrength: -30,
  animationBlocker: false,
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
        if (inputX > 0) {
          state.direction = "right";
        } else if (inputX < 0) state.direction = "left";
      } else {
        // console.log("limit reached in x direction");
      }
      if (state.y + inputY >= 0 && state.y + inputY <= gameAreaHeight - 10) {
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
      if (action.payload < 0 && state.isBlocking) {
        state.health.currentHealth += action.payload * 0.5;
      } else state.health.currentHealth += action.payload;
    },
    setHealth(state, action) {
      state.health.currentHealth = action.payload;
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
    setCallNueCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.callNueCD.isReady = action.payload.isReady;
      state.callNueCD.remainingTime = action.payload.remainingTime;
    },
    setNueAttackCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.nueAttackCD.isReady = action.payload.isReady;
      state.nueAttackCD.remainingTime = action.payload.remainingTime;
    },
    setDivineDogsCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.divineDogsCD.isReady = action.payload.isReady;
      state.divineDogsCD.remainingTime = action.payload.remainingTime;
    },
    resetState: () => initialState,
    setIsBlocking(state, action) {
      state.isBlocking = action.payload;
    },
    setAnimationState(state, action) {
      if (!state.animationBlocker) state.animationState = action.payload;
    },
    applyGravity: (state) => {
      if (state.y < 300 || state.velocityY === state.jumpStrength) {
        // Ensure the character stays above the ground level
        state.velocityY += state.gravity;
        state.y += state.velocityY;
      } else {
        state.y = 300;
        state.velocityY = 0;
        state.isJumping = false;
      }
    },
    jump: (state) => {
      if (!state.isJumping) {
        state.velocityY = state.jumpStrength;
        state.isJumping = true;
        state.animationState = "jump";
      }
    },
    setJumping(state, action) {
      state.isJumping = action.payload;
    },
    setAnimatinBlocker(state, action) {
      state.animationBlocker = action.payload;
    },
    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveCharacter,
  updateHealth,
  setHealth,
  changeCursedEnergy,
  setDirection,
  setCanMove,
  setCursedEnergy,
  moveCharacterTo,
  setDashGauge,
  setCallNueCD,
  setNueAttackCD,
  setDivineDogsCD,
  resetState,
  setIsBlocking,
  setAnimationState,
  moveCharacterWD,
  applyGravity,
  jump,
  setJumping,
  setAnimatinBlocker,
} = megumiSlice.actions;
export default megumiSlice;

export const toggleCallNueCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.MegumiState.callNueCD.isReady) return;
  const cooldown = state.MegumiState.callNueCD.cooldown;
  dispatch(
    setCallNueCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.MegumiState.callNueCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setCallNueCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setCallNueCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
export const toggleNueAttackCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.MegumiState.nueAttackCD.isReady) return;
  const cooldown = state.MegumiState.nueAttackCD.cooldown;
  dispatch(
    setNueAttackCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.MegumiState.nueAttackCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setNueAttackCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setNueAttackCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
export const toggleDivineDogsAttackCD =
  (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (!state.MegumiState.divineDogsCD.isReady) return;
    const cooldown = state.MegumiState.divineDogsCD.cooldown;
    dispatch(
      setDivineDogsCD({
        isReady: false,
        remainingTime: cooldown,
      })
    );

    const interval = setInterval(() => {
      const currentState = getState();
      const remainingTime = currentState.MegumiState.divineDogsCD.remainingTime;
      if (remainingTime > 1) {
        dispatch(
          setDivineDogsCD({
            isReady: false,
            remainingTime: remainingTime - 1,
          })
        );
      } else {
        clearInterval(interval);
        dispatch(
          setDivineDogsCD({
            isReady: true,
            remainingTime: 0,
          })
        );
      }
    }, 1000); // her saniye güncelle
  };
