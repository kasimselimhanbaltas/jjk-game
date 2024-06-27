import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Sukuna } from "../App";
import { AppThunk } from "./GlobalStore";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Sukuna = {
  characterName: "sukuna",
  x: 800,
  y: 200,
  health: {
    currentHealth: 100,
    maxHealth: 100,
  },
  cursedEnergy: {
    currentCursedEnergy: 100,
    maxCursedEnergy: 200,
  },
  direction: "left",
  cleaveAttack: false,
  dismantleAttack: false,
  rivalDomainExpansion: false,
  rivalDirection: "stop",
  closeRange: false,
  canMove: false,
  rapidAttack: false,
  dashGauge: 0,
  cleaveCD: {
    isReady: true,
    cooldown: 3,
    remainingTime: 0,
  },
  dismantleCD: {
    isReady: true,
    cooldown: 6,
    remainingTime: 0,
  },
  domainCD: {
    isReady: true,
    cooldown: 10,
    remainingTime: 0,
  },
  rapidAttackCounter: {
    maxCount: 10,
    currentCount: 0,
  },
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
      if (state.rivalDomainExpansion) return;
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    updateHealth(state, action) {
      state.health.currentHealth += action.payload;
    },
    setHealth(state, action) {
      state.health.currentHealth = action.payload;
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
      state.cursedEnergy.currentCursedEnergy = action.payload;
    },
    changeCursedEnergy(state, action) {
      state.cursedEnergy.currentCursedEnergy += action.payload;
    },
    setRivalDomainExpansion(state, action) {
      state.rivalDomainExpansion = action.payload;
    },
    setRivalDirection(state, action) {
      state.rivalDirection = action.payload;
    },
    setCleaveCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.cleaveCD.isReady = action.payload.isReady;
      state.cleaveCD.remainingTime = action.payload.remainingTime;
    },
    setDismantleCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.dismantleCD.isReady = action.payload.isReady;
      state.dismantleCD.remainingTime = action.payload.remainingTime;
    },
    setDomainCD(
      state,
      action: PayloadAction<{ isReady: boolean; remainingTime: number }>
    ) {
      state.domainCD.isReady = action.payload.isReady;
      state.domainCD.remainingTime = action.payload.remainingTime;
    },
    setRapidAttackCounter(state, action) {
      state.rapidAttackCounter.currentCount = action.payload;
    },
    resetState: () => initialState,

    // Diğer action'lar (yumrukAt, nue çağırma, domain açma vb.)
  },
});

export const {
  moveCharacter,
  updateHealth,
  setHealth,
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
  setRivalDirection,
  setCleaveCD,
  setDismantleCD,
  setDomainCD,
  setRapidAttackCounter,
  resetState,
} = RivalSlice.actions;
export default RivalSlice;

export const toggleCleaveCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.SukunaState.cleaveCD.isReady) return;
  const cooldown = state.SukunaState.cleaveCD.cooldown;
  dispatch(
    setCleaveCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.SukunaState.cleaveCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setCleaveCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setCleaveCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};

export const toggleDismantleCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.SukunaState.dismantleCD.isReady) return;
  const cooldown = state.SukunaState.dismantleCD.cooldown;
  dispatch(
    setDismantleCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.SukunaState.dismantleCD.remainingTime;
    if (remainingTime > 1) {
      dispatch(
        setDismantleCD({
          isReady: false,
          remainingTime: remainingTime - 1,
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setDismantleCD({
          isReady: true,
          remainingTime: 0,
        })
      );
    }
  }, 1000); // her saniye güncelle
};

export const toggleDomainCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.SukunaState.domainCD.isReady) return;
  const cooldown = state.SukunaState.domainCD.cooldown;
  dispatch(
    setDomainCD({
      isReady: false,
      remainingTime: cooldown,
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime = currentState.SukunaState.domainCD.remainingTime;
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
toggleDomainCD();