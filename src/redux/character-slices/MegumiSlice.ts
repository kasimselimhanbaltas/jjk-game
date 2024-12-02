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
    currentHealth: 15000,
    maxHealth: 1500,
  },
  cursedEnergy: {
    currentCursedEnergy: 200,
    maxCursedEnergy: 200,
  },
  direction: "right",
  isAttacking: false,
  canMove: true,
  hardStun: false,
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
  transition: "all .2s ease, transform 0s",
  devStun: false,
  // ...
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
  animationLevel: 30,
  state: "normal",
  currentAnimation: "",
  stunTimer: 0,
  autoMoveBlocker: false,
  takeDamage: {
    isTakingDamage: false,
    damage: 0,
    takeDamageAnimationCheck: false,
    knockback: 0,
    timeout: 0,
    animation: "",
    animationPriority: 0
  },
};

const megumiSlice = createSlice({
  name: "megumi",
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
      if (action.payload < 0 && state.invulnerability) return;
      if (action.payload < 0 && state.isBlocking) { // if its a damage and the character is blocking
        state.health.currentHealth += action.payload * 0.5;
      } else state.health.currentHealth += action.payload; // if its a healing or damage
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
    setGravity(state, action) {
      state.gravity = action.payload;
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
    setTransition(state, action) {
      state.transition = action.payload;
    },
    setDevStun(state, action) {
      state.devStun = action.payload;
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
  setCallNueCD,
  setNueAttackCD,
  setDivineDogsCD,
  resetState,
  setIsBlocking,
  setAnimationState,
  moveCharacterWD,
  applyGravity,
  jump,
  jumpWS,
  setJumping,
  setAnimationBlocker,
  setTransition,
  setDevStun,
  setFallingBlossomEmotion,
  setInvulnerability,
  setGravity,

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
