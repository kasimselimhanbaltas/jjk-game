import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Sukuna } from "../../App";
import { AppThunk } from "../GlobalStore";

const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Sukuna = {
  characterName: "sukuna",
  x: 100,
  y: 200,
  health: {
    currentHealth: 1500,
    maxHealth: 1500,
  },
  cursedEnergy: {
    currentCursedEnergy: 200,
    maxCursedEnergy: 200,
  },
  direction: "left",
  cleaveAttack: false,
  dismantleAttack: false,
  rivalDomainExpansion: false,
  rivalDirection: "stop",
  closeRange: false,
  canMove: true,
  hardStun: true,
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
    cooldown: 30,
    remainingTime: 0,
  },
  rapidAttackCounter: {
    maxCount: 10,
    currentCount: 0,
  },
  fugaCounter: {
    maxCount: 50,
    currentCount: 0,
  },
  isBlocking: false,
  animationState: "stance",
  velocityY: 0,
  isJumping: false,
  gravity: 5,
  jumpStrength: -30,
  animationBlocker: false,
  transition: "all .2s ease, transform 0s",
  bamAttackMoment: false,
  bamLandingPositionX: null,
  positioningSide: "left",
  takeDamage: {
    isTakingDamage: false,
    damage: 0,
    takeDamageAnimationCheck: false,
    knockback: 0,
    timeout: 0,
  },
  devStun: false,
  domainStatus: {
    sureHitStatus: true,
    clashStatus: false,
    isInitiated: false,
    isActive: false,
    duration: 15,
    refineLevel: 10,
    afterDomainRestrictions: false,
    forceExpand: false,
  },
  rct: {
    rctActive: false,
    rctMode: "body",
  },
  domainAmplification: {
    isActive: false,
    skill: {
      isReady: true,
      cooldown: 15,
      remainingTime: 0,
    },
  },
  simpleDomain: {
    isActive: false,
    duration: 5,
    skill: {
      isReady: true,
      cooldown: 15,
      remainingTime: 0,
    },
  },
  fallingBlossomEmotion: {
    isActive: false,
    skill: {
      isReady: true,
      cooldown: 15,
      remainingTime: 0,
    },
  },
  invulnerability: false,
};

const RivalSlice = createSlice({
  name: "Sukuna",
  initialState: initialState,
  reducers: {
    setInvulnerability(state, action) {
      console.log("set invulnerability: ", action.payload);
      state.invulnerability = action.payload;
    },
    setFallingBlossomEmotion(state, action) {
      state.fallingBlossomEmotion.isActive = action.payload.isActive;
      // state.fallingBlossomEmotion.skill.isReady = action.payload.skill.isReady;
      // state.fallingBlossomEmotion.skill.cooldown =
      //   action.payload.skill.cooldown;
      // state.fallingBlossomEmotion.skill.remainingTime =
      //   action.payload.skill.remainingTime;
    },
    setSimpleDomain(state, action) {
      state.simpleDomain.isActive = action.payload.isActive;
      state.simpleDomain.duration = action.payload.duration;
      state.simpleDomain.skill.isReady = action.payload.skill.isReady;
      state.simpleDomain.skill.cooldown = action.payload.skill.cooldown;
      state.simpleDomain.skill.remainingTime =
        action.payload.skill.remainingTime;
    },
    setDomainAmplification(state, action) {
      state.domainAmplification.isActive = action.payload.isActive;
      console.log("AP: ", action.payload.isActive);
      // state.domainAmplification.skill.isReady = action.payload.skill.isReady;
      // // state.domainAmplification.skill.cooldown = action.payload.skill.cooldown; // not needed
      // state.domainAmplification.skill.remainingTime =
      //   action.payload.skill.remainingTime;
    },
    setRCT(state, action) {
      state.rct.rctActive = action.payload.rctActive;
      state.rct.rctMode = action.payload.rctMode;
    },
    setDomainState(state, action) {
      state.domainStatus.isInitiated = action.payload.isInitiated;
      state.domainStatus.isActive = action.payload.isActive;
      state.domainStatus.duration = action.payload.duration;
      state.domainStatus.refineLevel = action.payload.refineLevel;
      state.domainStatus.sureHitStatus = action.payload.sureHitStatus;
      state.domainStatus.clashStatus = action.payload.clashStatus;
      state.domainStatus.afterDomainRestrictions =
        action.payload.afterDomainRestrictions;
      state.domainStatus.forceExpand = action.payload.forceExpand;
    },
    moveCharacter(state, action) {
      let inputX = action.payload.x;
      let inputY = action.payload.y;
      if (state.x + inputX > 0 && state.x + inputX < gameAreaWidth - 100) {
        state.x += inputX;
        if (inputX > 0) {
          state.direction = "right";
        } else state.direction = "left";
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
      if (state.rivalDomainExpansion) return;
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    updateHealth(state, action) {
      // console.log("invulnerability: ", state.invulnerability);
      if (action.payload < 0 && state.invulnerability) return;
      if (action.payload < 0 && state.isBlocking) {
        // if its a damage and the character is blocking
        state.health.currentHealth += action.payload * 0.5;
      } else state.health.currentHealth += action.payload; // if its a healing or damage
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
    setHardStun(state, action) {
      state.hardStun = action.payload;
    },
    setRapidAttack(state, action) {
      state.rapidAttack = action.payload;
    },
    setTransition(state, action) {
      state.transition = action.payload;
    },
    setDashGauge(state, action) {
      state.dashGauge = action.payload;
    },
    setCursedEnergy(state, action) {
      state.cursedEnergy.currentCursedEnergy = action.payload;
    },
    changeCursedEnergy(state, action) {
      if (
        state.cursedEnergy.currentCursedEnergy + action.payload <=
        state.cursedEnergy.maxCursedEnergy &&
        state.cursedEnergy.currentCursedEnergy + action.payload >= 0
      )
        state.cursedEnergy.currentCursedEnergy += action.payload;
      else
        state.cursedEnergy.currentCursedEnergy =
          state.cursedEnergy.maxCursedEnergy;
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
    setFugaCounter(state, action) {
      state.fugaCounter.currentCount = action.payload;
    },
    increaseFugaCounter(state, action) {
      state.fugaCounter.currentCount += action.payload;
    },
    resetState: () => initialState,
    setIsBlocking(state, action) {
      state.isBlocking = action.payload;
    },
    setAnimationState(state, action) {
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
        console.log("js: ", action.payload);
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
    setGravity(state, action) {
      state.gravity = action.payload;
    },
    setBamAttackMoment(state, action) {
      state.bamAttackMoment = action.payload;
    },
    setBamLandingPositionX(state, action) {
      state.bamLandingPositionX = action.payload;
    },
    setPositioningSide(state, action) {
      state.positioningSide = action.payload;
    },
    setTakeDamage(state, action) {
      state.animationBlocker = false;
      state.takeDamage.isTakingDamage = action.payload.isTakingDamage;
      state.takeDamage.takeDamageAnimationCheck =
        action.payload.takeDamageAnimationCheck;
      state.takeDamage.damage = action.payload.damage;
      state.takeDamage.timeout = action.payload.timeout;
      console.log(state.x, action.payload.knockback);
      if (
        state.direction === "left" &&
        state.x + action.payload.knockback >= 1400
      ) {
        state.takeDamage.knockback = 1300 - state.x;
      } else if (
        state.direction === "right" &&
        state.x - action.payload.knockback <= 0
      ) {
        state.takeDamage.knockback = Math.abs(50 - state.x);
      } else {
        state.takeDamage.knockback = action.payload.knockback;
      }
    },
    setDevStun(state, action) {
      state.devStun = action.payload;
    },

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
  setHardStun,
  setRapidAttack,
  setTransition,
  setDashGauge,
  moveCharacterTo,
  setCursedEnergy,
  changeCursedEnergy,
  setRivalDirection,
  setCleaveCD,
  setDismantleCD,
  setDomainCD,
  setRapidAttackCounter,
  setFugaCounter,
  increaseFugaCounter,
  resetState,
  setIsBlocking,
  setAnimationState,
  moveCharacterWD,
  applyGravity,
  jump,
  jumpWS,
  setJumping,
  setAnimationBlocker,
  setGravity,
  setBamAttackMoment,
  setBamLandingPositionX,
  setPositioningSide,
  setTakeDamage,
  setDevStun,
  setDomainState,
  setRCT,
  setDomainAmplification,
  setSimpleDomain,
  setFallingBlossomEmotion,
  setInvulnerability,
} = RivalSlice.actions;
export default RivalSlice;

export const toggleSimpleDomainCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.SukunaState.simpleDomain.skill.isReady) return;
  const cooldown = state.SukunaState.simpleDomain.skill.cooldown;
  dispatch(
    setSimpleDomain({
      isActive: false,
      duration: state.SukunaState.simpleDomain.duration,
      skill: {
        isReady: false,
        cooldown: cooldown,
        remainingTime: cooldown,
      },
    })
  );

  const interval = setInterval(() => {
    const currentState = getState();
    const remainingTime =
      currentState.SukunaState.simpleDomain.skill.remainingTime;
    if (remainingTime > 1) {
      console.log("CD: ", remainingTime);
      dispatch(
        setSimpleDomain({
          isActive: false,
          duration: state.SukunaState.simpleDomain.duration,
          skill: {
            isReady: false,
            cooldown: cooldown,
            remainingTime: remainingTime - 1,
          },
        })
      );
    } else {
      clearInterval(interval);
      dispatch(
        setSimpleDomain({
          isActive: false,
          duration: state.SukunaState.simpleDomain.duration,
          skill: {
            isReady: true,
            cooldown: cooldown,
            remainingTime: 0,
          },
        })
      );
    }
  }, 1000); // her saniye güncelle
};

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
