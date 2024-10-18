import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Gojo } from "../../App";
import { AppThunk } from "../GlobalStore";

const SURFACE_Y = parseInt(process.env.REACT_APP_SURFACE_Y);
const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const initialState: Gojo = {
  characterName: "gojo",
  x: 800,
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
  hardStun: true,
  rivalDirection: "stop",
  blueCD: {
    isReady: true,
    cooldown: 20,
    remainingTime: 0,
  },
  redCD: {
    isReady: true,
    cooldown: 30,
    remainingTime: 0,
  },
  domainCD: {
    isReady: true,
    // cooldown: 20,
    cooldown: 60,
    remainingTime: 0,
  },
  redAttackMoment: false,
  blueAttackMoment: false,
  bluePosition: { x: 0, y: 0 },
  purpleAttackMoment: false,
  isBlocking: false,
  animationState: "first-pose",
  velocityY: 0,
  isJumping: false,
  gravity: 5,
  jumpStrength: -30,
  animationBlocker: false,
  transition: "all .2s ease, transform 0s",
  positioningSide: "left",
  takeDamage: {
    isTakingDamage: false,
    damage: 0,
    takeDamageAnimationCheck: false,
    knockback: 0,
    timeout: 0,
    animation: "",
    animationPriority: 0
  },
  devStun: false,
  domainStatus: {
    sureHitStatus: true,
    clashStatus: false,
    isInitiated: false,
    isActive: false,
    duration: 10,
    refineLevel: 10,
    afterDomainRestrictions: false,
    forceExpand: false,
  },
  rct: {
    rctActive: false,
    rctMode: "body",
  },
  infinity: true,
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
  state: "normal",
  animationLevel: 30,
  currentAnimation: "",
  stunTimer: 0,
  autoMoveBlocker: false,
};

const gojoSlice = createSlice({
  name: "gojo",
  initialState: initialState,
  reducers: {
    setInvulnerability(state, action) {
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
    setDomainAmplification(state, action) {
      state.domainAmplification.isActive = action.payload.isActive;
      console.log("AP: ", action.payload.isActive);
      // state.domainAmplification.skill.isReady = action.payload.skill.isReady;
      // // state.domainAmplification.skill.cooldown = action.payload.skill.cooldown; // not needed
      // state.domainAmplification.skill.remainingTime =
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
    autoMoveCharacter(state, action) {
      if (!state.autoMoveBlocker) return;
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
    setAutoMoveBlocker(state, action) {
      state.autoMoveBlocker = action.payload;
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
      if (action.payload < 0 && state.invulnerability) return;
      if (action.payload < 0 && state.isBlocking) {
        // if its a damage and the character is blocking
        state.health.currentHealth += action.payload * 0.5;
      } else state.health.currentHealth += action.payload; // if its a healing or damage
    },
    setHealth(state, action) {
      state.health.currentHealth = action.payload;
    },
    changeCursedEnergy(state, action) {
      if (state.cursedEnergy.currentCursedEnergy + action.payload >= 0)
        if (
          state.cursedEnergy.currentCursedEnergy + action.payload <=
          state.cursedEnergy.maxCursedEnergy
        )
          state.cursedEnergy.currentCursedEnergy += action.payload;
        else
          state.cursedEnergy.currentCursedEnergy =
            state.cursedEnergy.maxCursedEnergy;
    },
    setCursedEnergy(state, action) {
      state.cursedEnergy.currentCursedEnergy = action.payload;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setCanMove(state, action) {
      if (action.payload === false) {
        state.canMove = false;
      } else {
        state.canMove = true;
      }
    },
    setHardStun(state, action) {
      if (action.payload === true && !state.infinity) {
        state.hardStun = true;
      } else {
        state.hardStun = false;
      }
    },
    setTransition(state, action) {
      state.transition = action.payload;
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
      console.log("**animation: ", action.payload.animation);
      console.log("**animation priority: ", action.payload.animationPriority);
      console.log("**current animation level: ", state.animationLevel);
      if (action.payload.animationPriority >= state.animationLevel) {
        state.animationLevel = action.payload.animationPriority;
        state.animationState = action.payload.animation;
        console.log("ANIMATIONUPDATE", action.payload);
        if (action.payload.finishAnimation) state.animationLevel = 0;
      }
    },
    applyGravity: (state) => {
      if (
        state.y + state.velocityY < SURFACE_Y ||
        state.velocityY <= state.jumpStrength
      ) {
        // Ensure the character stays above the ground level
        state.velocityY += state.gravity;
        state.y += state.velocityY;
      } else {
        state.y = SURFACE_Y;
        state.velocityY = 0;
        state.isJumping = false;
      }
    },
    jump: (state) => {
      if (!state.isJumping) {
        state.velocityY = state.jumpStrength;
        state.isJumping = true;
        state.animationState = "jump";
        let animationPriority = 1;
        let finishAnimation = false;
        if (animationPriority >= state.animationLevel) {
          state.animationLevel = animationPriority;
          state.animationState = "jump";
          if (finishAnimation) state.animationLevel = 0;
        }
      }
    },
    jumpWS: (state, action) => {
      if (!state.isJumping) {
        state.velocityY = -action.payload;
        state.isJumping = true;
      }
    },
    setGravity(state, action) {
      state.gravity = action.payload;
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
    setTakeDamage(state, action) {
      // if (state.infinity) return;
      state.takeDamage.isTakingDamage = action.payload.isTakingDamage;

      state.takeDamage.damage = action.payload.damage;
      state.takeDamage.timeout = action.payload.timeout;
      state.takeDamage.animation = action.payload.animation;
      state.takeDamage.animationPriority = action.payload.animationPriority;
      console.log("slice kb: ", action.payload.damage, action.payload.knockback);
      // KNOCKBACK UPDATE BY DIRECTION
      if (
        state.direction === "left" &&
        state.x + action.payload.knockback >= 1400
      ) {
        state.takeDamage.knockback = 1300 - state.x;
      } else if (
        state.direction === "right" &&
        state.x - action.payload.knockback <= 0
      ) {
        state.takeDamage.knockback = Math.abs(70 - state.x);
      } else {
        state.takeDamage.knockback = action.payload.knockback;
      }
      // ANIMATION PRIORITY CHECK
      console.log("**ap: iasdas ", action.payload.animationPriority);
      if (action.payload.animationPriority < state.animationLevel) {
        state.takeDamage.knockback = 0;
        state.takeDamage.takeDamageAnimationCheck = false;
      }
      else { // ANIMATION MUST BE SET TO THE TAKEDAMAGE BC OF THE PRIORITY - CANCEL CURRENT ANIMATION
        state.takeDamage.takeDamageAnimationCheck =
          action.payload.takeDamageAnimationCheck;
        state.animationLevel = action.payload.animationPriority;
      }

    },
    setDevStun(state, action) {
      state.devStun = action.payload;
    },
    setRCT(state, action) {
      state.rct.rctActive = action.payload.rctActive;
      state.rct.rctMode = action.payload.rctMode;
    },
    setInfinity(state, action) {
      state.infinity = action.payload;
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
  setTransition,
  setBlueCD,
  setRedCD,
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
  setGravity,
  setTakeDamage,
  setDomainState,
  setRCT,
  setInfinity,
  setSimpleDomain,
  setFallingBlossomEmotion,
  setInvulnerability,
  autoMoveCharacter,
  setAutoMoveBlocker,
} = gojoSlice.actions;
export default gojoSlice;

export const toggleSimpleDomainCD = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  if (!state.GojoState.simpleDomain.skill.isReady) return;
  const cooldown = state.SukunaState.simpleDomain.skill.cooldown;
  dispatch(
    setSimpleDomain({
      isActive: false,
      duration: state.GojoState.simpleDomain.duration,
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
      currentState.GojoState.simpleDomain.skill.remainingTime;
    if (remainingTime > 1) {
      console.log("CD: ", remainingTime);
      dispatch(
        setSimpleDomain({
          isActive: false,
          duration: state.GojoState.simpleDomain.duration,
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
          duration: state.GojoState.simpleDomain.duration,
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
    const rctMode = currentState.GojoState.rct.rctMode;

    let decrement = 1; // default decrement
    if (rctMode === "ct") {
      decrement = 10; // faster decrement when in "ct" mode
    }

    if (remainingTime > decrement) {
      dispatch(
        setBlueCD({
          isReady: false,
          remainingTime: remainingTime - decrement,
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
    const rctActive = currentState.GojoState.rct.rctActive;
    const rctMode = currentState.GojoState.rct.rctMode;

    let decrement = 1; // default decrement
    if (rctActive && rctMode === "ct") {
      decrement = 10; // faster decrement when in "ct" mode
    }

    if (remainingTime > decrement) {
      dispatch(
        setRedCD({
          isReady: false,
          remainingTime: remainingTime - decrement,
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
