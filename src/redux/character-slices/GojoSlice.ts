import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Gojo } from "../../App";
import { AppThunk } from "../GlobalStore";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Gojo = {
  characterName: "gojo",
  x: 200,
  y: 200,
  health: {
    currentHealth: 1500,
    maxHealth: 1500,
  },
  cursedEnergy: {
    currentCursedEnergy: 50,
    maxCursedEnergy: 200,
  },
  direction: "right",
  isAttacking: false,
  canMove: true,
  hardStun: false,
  dashGauge: 0,
  rivalDirection: "stop",
  blueCD: {
    isReady: true,
    cooldown: 8,
    remainingTime: 0,
  },
  redCD: {
    isReady: true,
    cooldown: 12,
    remainingTime: 0,
  },
  purpleCD: {
    isReady: true,
    cooldown: 30,
    remainingTime: 0,
  },
  domainCD: {
    isReady: true,
    cooldown: 30,
    remainingTime: 0,
  },
  redAttackMoment: false,
  blueAttackMoment: false,
  bluePosition: { x: 0, y: 0 },
  purpleAttackMoment: false,
  isBlocking: false,
  animationState: "stance",
  velocityY: 0,
  isJumping: false,
  gravity: 5,
  jumpStrength: -30,
  animationBlocker: false,
  transition: "",
  positioningSide: "left",
};

const gojoSlice = createSlice({
  name: "gojo",
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
      if (
        state.cursedEnergy.currentCursedEnergy + action.payload <=
          state.cursedEnergy.maxCursedEnergy &&
        state.cursedEnergy.currentCursedEnergy + action.payload >= 0
      )
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
    setHardStun(state, action) {
      state.hardStun = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setRivalDirection(state, action) {
      state.rivalDirection = action.payload;
    },
    setBlueCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.blueCD.isReady = action.payload.isReady;
      state.blueCD.remainingTime = action.payload.remainingTime;
    },
    setRedCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.redCD.isReady = action.payload.isReady;
      state.redCD.remainingTime = action.payload.remainingTime;
    },
    setPurpleCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.purpleCD.isReady = action.payload.isReady;
      state.purpleCD.remainingTime = action.payload.remainingTime;
    },
    setDomainCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.domainCD.isReady = action.payload.isReady;
      state.domainCD.remainingTime = action.payload.remainingTime;
    },
    resetState: () => initialState,
    setRedAttackMoment(state, action) {
      state.redAttackMoment = action.payload;
    },
    setBlueAttackMoment(state, action) {
      state.blueAttackMoment = action.payload;
    },
    setBluePosition(state, action) {
      state.bluePosition = action.payload;
    },
    setPurpleAttackMoment(state, action) {
      state.purpleAttackMoment = action.payload;
    },
    setIsBlocking(state, action) {
      state.isBlocking = action.payload;
    },
    setAnimationState(state, action) {
      // console.log(
      //   "slice animation state: ",
      //   action.payload,
      //   "blocker: ",
      //   state.animationBlocker
      // );
      if (!state.animationBlocker) state.animationState = action.payload;
    },
    applyGravity: (state) => {
      if (
        state.y + state.velocityY < 560 ||
        state.velocityY <= state.jumpStrength
      ) {
        // Ensure the character stays above the ground level
        state.velocityY += state.gravity;
        state.y += state.velocityY;
      } else {
        state.y = 560;
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
    jumpWS: (state, action) => {
      if (!state.isJumping) {
        state.velocityY = -action.payload;
        state.isJumping = true;
      }
    },
    setJumping(state, action) {
      state.isJumping = action.payload;
    },
    setAnimationBlocker(state, action) {
      state.animationBlocker = action.payload;
    },
    setPositioningSide(state, action) {
      state.positioningSide = action.payload;
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
  setHardStun,
  setCursedEnergy,
  moveCharacterTo,
  setDashGauge,
  setBlueCD,
  setRedCD,
  setPurpleCD,
  setDomainCD,
  resetState,
  setRedAttackMoment,
  setPurpleAttackMoment,
  setIsBlocking,
  setAnimationState,
  moveCharacterWD,
  applyGravity,
  jump,
  jumpWS,
  setJumping,
  setAnimationBlocker,
  setPositioningSide,
} = gojoSlice.actions;
export default gojoSlice;

export const toggleBlueCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.GojoState.blueCD.isReady) return;
  const cooldown = state.GojoState.blueCD.cooldown;
  dispatch(
    setBlueCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.GojoState.blueCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setBlueCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setBlueCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
export const toggleRedCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.GojoState.redCD.isReady) return;
  const cooldown = state.GojoState.redCD.cooldown;
  dispatch(
    setRedCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.GojoState.redCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setRedCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setRedCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
export const togglePurpleCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.GojoState.purpleCD.isReady) return;
  const cooldown = state.GojoState.purpleCD.cooldown;
  dispatch(
    setPurpleCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.GojoState.purpleCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setPurpleCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setPurpleCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
export const toggleDomainCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.GojoState.domainCD.isReady) return;
  const cooldown = state.GojoState.domainCD.cooldown;
  dispatch(
    setDomainCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.GojoState.domainCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setDomainCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setDomainCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};
