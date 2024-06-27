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
    currentCursedEnergy: 200,
    maxCursedEnergy: 200,
  },
  direction: "right",
  isAttacking: false,
  canMove: true,
  dashGauge: 0,
  rivalDirection: "stop",
  blueCD: {
    isReady: true,
    cooldown: 8,
    remainingTime: 0,
  },
  redCD: {
    isReady: true,
    cooldown: 10,
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
  purpleAttackMoment: false,
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
    setPurpleAttackMoment(state, action) {
      state.purpleAttackMoment = action.payload;
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
  setBlueCD,
  setRedCD,
  setPurpleCD,
  setDomainCD,
  resetState,
  setRedAttackMoment,
  setPurpleAttackMoment,
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
