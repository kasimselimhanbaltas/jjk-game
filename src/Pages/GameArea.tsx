import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Megumi from "../components/characters/Megumi";
import Sukuna from "../components/characters/Sukuna";
import Nue from "../components/Nue";
import sukunaSlice from "../redux/character-slices/SukunaSlice";
import megumiSlice from "../redux/character-slices/MegumiSlice";
import gojoSlice from "../redux/character-slices/GojoSlice";
import { useDispatch, useSelector } from "react-redux";
import { setNueDirection } from "../redux/NueSlice";
import DivineDogs from "../components/DivineDogs";
import MainMenu from "../components/MainMenu";
import React from "react";
import SatoruGojo from "../components/characters/SatoruGojo";
import FinishMenu from "../components/FinishMenu";
import gameSettingsSlice from "../redux/GameSettingsSlice";
import CharacterInterface from "../components/CharacterInterface";
import ControlsPage from "./ControlsPage";
import axios from "axios";
import tutorialSlice, { setGoToTutorialMenu } from "../redux/TutorialSlice";
import megunaSlice from "../redux/character-slices/MegunaSlice";
import Meguna from "../components/characters/Meguna";

const SURFACE_Y = parseInt(process.env.REACT_APP_SURFACE_Y);
const characterHeight = 50;

const megumiWidth = 50;
const megumiHeight = 180;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const megumiSpeed = 30;
const shrineHeight = 250;
const redDamage = -200;
const purpleDamage = -500;

const GameArea = () => {

  const dispatch = useDispatch()
  const tutorialState = useSelector((state: any) => state.TutorialState);
  const gameSettings = useSelector((state: any) => state.GameSettingsState);
  const sukuna = useSelector((state: any) => state.SukunaState);
  const megumi = useSelector((state: any) => state.MegumiState);
  const gojo = useSelector((state: any) => state.GojoState);
  const nue = useSelector((state: any) => state.NueState);
  const divineDogs = useSelector((state: any) => state.DivineDogsState);
  const keysPressed = useRef({
    w: false, a: false, s: false, d: false, q: false, t: false,
    space: false, y: false, e: false, r: false, shift: false
  });
  let intervalId = null;
  const playerCEincreaseIntervalRef = useRef(null);
  const rivalCEincreaseIntervalRef = useRef(null);
  console.log("ga-rerender")
  // Sound Effects
  const yowaimoSoundEffectRef = useRef<HTMLAudioElement>(null);


  const selectedPlayer = useSelector((state: any) => {
    if (gameSettings.selectedCharacter === "sukuna") {
      return { playerState: state.SukunaState, playerSlice: sukunaSlice };
    } else if (gameSettings.selectedCharacter === "megumi") {
      return { playerState: state.MegumiState, playerSlice: megumiSlice };
    } else if (gameSettings.selectedCharacter === "gojo") {
      return { playerState: state.GojoState, playerSlice: gojoSlice };
    } else if (gameSettings.selectedCharacter === "meguna") {
      return { playerState: state.MegunaState, playerSlice: megunaSlice };
    }
  });
  const selectedRival = useSelector((state: any) => {
    if (gameSettings.selectedRivalCharacter === "sukuna") {
      return { rivalState: state.SukunaState, rivalSlice: sukunaSlice };
    } else if (gameSettings.selectedRivalCharacter === "megumi") {
      return { rivalState: state.MegumiState, rivalSlice: megumiSlice };
    } else if (gameSettings.selectedRivalCharacter === "gojo") {
      return { rivalState: state.GojoState, rivalSlice: gojoSlice };
    } else if (gameSettings.selectedRivalCharacter === "meguna") {
      return { rivalState: state.MegunaState, rivalSlice: megunaSlice };
    }
  });
  // for reducer methods
  const playerSlice = selectedPlayer.playerSlice;
  const rivalSlice = selectedRival.rivalSlice;

  // for reading
  const playerCharacter = selectedPlayer.playerState;
  const rivalCharacter = selectedRival.rivalState;

  const xDistance = useMemo(() => (playerCharacter.x - rivalCharacter.x), [playerCharacter.x, rivalCharacter.x]);

  // place characters
  useEffect(() => {
    dispatch(gameSettingsSlice.actions.setDomainClash(false))
    const cd = tutorialState.tutorialMode ? 0 : 1000;
    // dispatch(rivalSlice.actions.setDevStun(true))
    if (gameSettings.entry) {
      if (gameSettings.selectedCharacter === "gojo" || gameSettings.selectedRivalCharacter === "gojo") {
        yowaimoSoundEffectRef.current.volume = 0.2;
        // yowaimoSoundEffectRef.current.play(); // yowaimo sound effect play
      }

      dispatch(playerSlice.actions.setDevStun(true))
      dispatch(rivalSlice.actions.setDevStun(true))
      dispatch(playerSlice.actions.setDirection("right"));
      console.log(gameSettings.selectedRivalCharacter)
      if (gameSettings.selectedRivalCharacter == "sukuna")
        dispatch(rivalSlice.actions.setDirection("right"));
      else
        dispatch(rivalSlice.actions.setDirection("left"));
      dispatch(sukunaSlice.actions.setTransition("all .2s, transform 0s, left 0s"))

      dispatch(playerSlice.actions.moveCharacterTo({ x: gameSettings.selectedCharacter === "sukuna" ? -1000 : 600, y: SURFACE_Y }));
      dispatch(rivalSlice.actions.moveCharacterTo({ x: gameSettings.selectedRivalCharacter === "sukuna" ? -1000 : 800, y: SURFACE_Y }));
      setTimeout(() => {
        dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: SURFACE_Y }));
        dispatch(rivalSlice.actions.setAnimationState({ animation: "entry", animationPriority: 31, finishAnimation: false }));
        // dispatch(rivalSlice.actions.setAnimationState("entry"))

        setTimeout(() => {
          dispatch(playerSlice.actions.moveCharacterTo({ x: 600, y: SURFACE_Y }));
          dispatch(playerSlice.actions.setAnimationState({ animation: "entry", animationPriority: 31, finishAnimation: false }));
          // dispatch(playerSlice.actions.setAnimationState("entry"))
          dispatch(rivalSlice.actions.setDirection("left"));
        }, cd / 2);
      }, cd);
      setTimeout(() => {
        console.log("devstun false")
        dispatch(playerSlice.actions.setDevStun(false))
        dispatch(playerSlice.actions.setHardStun(false))
        if (!gameSettings.tutorial) {
          dispatch(rivalSlice.actions.setDevStun(false)) // *stun
          dispatch(rivalSlice.actions.setHardStun(false))
        }
        dispatch(gameSettingsSlice.actions.setEntry(false));
        dispatch(rivalSlice.actions.setDirection("left"));
        dispatch(sukunaSlice.actions.setTransition("all .2s, transform 0s"))
      }, cd + 2000);
    }
  }, [gameSettings.entry, gameSettings.tutorial, tutorialState.tutorialMode]);

  // hitboxes
  useEffect(() => {
    if (gojo.redAttackMoment) {
      if (gameSettings.selectedCharacter === "gojo") { // is rival gonna take damage from gojo red and purple
        let distance =
          gojo.direction === "right" ? (Math.abs(gojo.x + 250 - rivalCharacter.x) <= 200 ? "close range" : "far") :
            (Math.abs(gojo.x - 200 - rivalCharacter.x) <= 200 ? "close range" : "far")
        console.log("gamearea red: ", distance)
        if (distance === "close range") {
          dispatch(rivalSlice.actions.setDirection(gojo.direction === "left" ? "right" : "left"))
          dispatch(rivalSlice.actions.setTakeDamage({
            isTakingDamage: true, damage: -redDamage, takeDamageAnimationCheck: true, knockback: 50, timeout: 500, animation: "", animationPriority: 6
          }));
        }
      } else {
        let distance =
          gojo.direction === "right" ? (Math.abs(gojo.x + 250 - playerCharacter.x) <= 200 ? "close range" : "far") :
            (Math.abs(gojo.x - 200 - playerCharacter.x) <= 200 ? "close range" : "far")
        console.log("gamearea red: ", distance)
        if (distance === "close range") {
          dispatch(rivalSlice.actions.setDirection(gojo.direction === "left" ? "right" : "left"))
          dispatch(rivalSlice.actions.setTakeDamage({ // *char
            isTakingDamage: true, damage: -redDamage, takeDamageAnimationCheck: true, knockback: 50, timeout: 500, animation: "", animationPriority: 6
          }));
        }
      }
    }
    if (gojo.blueAttackMoment) {
      if (gameSettings.selectedCharacter === "gojo") { // is rival gonna take damage from gojo blue
        let distance =
          (Math.abs(gojo.bluePosition.x - rivalCharacter.x) <= 300 ? "close range" : "far")
        console.log("bat calc: ", gojo.bluePosition.x - rivalCharacter.x, distance)
        if (distance === "close range") {
          dispatch(rivalSlice.actions.setCanMove(false))
          dispatch(rivalSlice.actions.setGravity(0))
          // move rival to blue
          setTimeout(() => {
            dispatch(rivalSlice.actions.moveCharacterTo({ x: gojo.bluePosition.x, y: gojo.bluePosition.y + 50 }))
            const damageInterval = setInterval(() => { // give damage slowly
              dispatch(rivalSlice.actions.updateHealth(-150 / 8))
            }, 100)
            setTimeout(() => { // unstun rival
              dispatch(rivalSlice.actions.setCanMove(true)) // ***
              dispatch(rivalSlice.actions.setGravity(5))
              clearInterval(damageInterval);
            }, 800);
          }, 500);

        }
      } else {
        let distance =
          (Math.abs(gojo.bluePosition.x - playerCharacter.x) <= 300 ? "close range" : "far")
        if (distance === "close range") {
          dispatch(playerSlice.actions.setCanMove(false))
          dispatch(rivalSlice.actions.setGravity(0))
          // move rival to blue
          setTimeout(() => {
            dispatch(playerSlice.actions.moveCharacterTo({ x: gojo.bluePosition.x + 50, y: gojo.bluePosition.y + 30 }))
            const damageInterval = setInterval(() => { // give damage slowly
              dispatch(playerSlice.actions.updateHealth(-150 / 8))
            }, 100)
            setTimeout(() => { // unstun rival
              dispatch(rivalSlice.actions.setCanMove(true))
              dispatch(playerSlice.actions.setCanMove(true)) // ***
              dispatch(rivalSlice.actions.setGravity(5))
              clearInterval(damageInterval);
            }, 800);

            // setTimeout(() => {
            //     setBlueStyle({
            //         x: gojo.x, y: gojo.y, visibility: "hidden", attacking: false,
            //         transition: "all .2s ease, transform 4s, top 0s, left 0s", ...blueStyle,
            //     })
            // }, 400);
          }, 500);

        }
      }
    }
    if (gojo.purpleAttackMoment) {
      if (gameSettings.selectedCharacter === "gojo") { // is rival gonna take damage from gojo purple

        let distance =
          gojo.y - rivalCharacter.y >= -150 && gojo.y - rivalCharacter.y <= 100 ?
            gojo.direction === "right" ? (gojo.x - rivalCharacter.x <= 0 ? "hit" : "miss") :
              (gojo.x - rivalCharacter.x > 0 ? "hit" : "miss") : "miss"
        const gojoandrivaldistance = Math.abs(gojo.x - rivalCharacter.x)
        if (distance === "hit") {
          console.log("*/*", gojoandrivaldistance)
          console.log("*/*", gojoandrivaldistance * 0.7)
          setTimeout(() => {
            dispatch(rivalSlice.actions.setDirection(gojo.x < rivalCharacter.x ? "left" : "right"));
            dispatch(rivalSlice.actions.setTakeDamage({
              isTakingDamage: true, damage: -purpleDamage, takeDamageAnimationCheck: true, knockback: 200, timeout: 500, animation: "", animationPriority: 11
            }));
          }, (gojoandrivaldistance < 800 ? gojoandrivaldistance - 100 : 875)); // hitbox time fixer
        }
      } else { // for other characters
        let distance =
          gojo.y - playerCharacter.y >= -150 && gojo.y - playerCharacter.y <= 100 ?
            gojo.direction === "right" ? (gojo.x - playerCharacter.x <= 0 ? "hit" : "miss") :
              (gojo.x - playerCharacter.x > 0 ? "hit" : "miss") : "miss"
        console.log("gamearea red: ", distance)
        if (distance === "hit") {
          setTimeout(() => {
            dispatch(playerSlice.actions.setDirection(gojo.x < playerCharacter.x ? "left" : "right"));
            dispatch(rivalSlice.actions.setTakeDamage({
              isTakingDamage: true, damage: -purpleDamage, takeDamageAnimationCheck: true, knockback: 200, timeout: 500, animation: "", animationPriority: 11
            }));
          }, (Math.abs(gojo.x - sukuna.x) * 0.7)); // hitbox time fixer
          // setTimeout(() => {
          //   dispatch(playerSlice.actions.setAnimationState("stance"))
          // }, 1000);
        }
      }
    }
    if (sukuna.bamAttackMoment) {
      if (gameSettings.selectedCharacter === "sukuna") { // is rival gonna take damage from sukuna smash attack(R)
        let hitOrMiss =
          Math.abs(rivalCharacter.x - sukuna.bamLandingPositionX) <= 100 ? "hit" : "miss"
        // if (rivalCharacter.characterName === "gojo" && gojo.infinity) {
        //   if (!playerCharacter.domainAmplification.isActive) {
        //     hitOrMiss = "miss";
        //   }
        // }
        if (hitOrMiss === "hit") {
          let infinity = rivalCharacter.characterName === "gojo" && gojo.infinity ? true : false;
          setTimeout(() => {
            dispatch(rivalSlice.actions.setDirection(sukuna.x > rivalCharacter.x ? "right" : "left"));
            // dispatch(rivalSlice.actions.moveCharacterWD({ x: sukuna.x - rivalCharacter.x > 50 ? -150 : +150, y: 0 }));
            // console.log(rivalCharacter.x, sukuna.bamLandingPositionX)

            dispatch(rivalSlice.actions.jumpWS(15))
            dispatch(gojoSlice.actions.setTakeDamage({ // megfix
              isTakingDamage: true, damage: 100, takeDamageAnimationCheck: true, knockback: 150, timeout: 300, animation: ""
            }));
          }, 100);
        }
      }
      else { // is player got hit by a sukuna smash attack
        let hitOrMiss =
          Math.abs(playerCharacter.x - sukuna.bamLandingPositionX) <= 100 ? "hit" : "miss";
        if (hitOrMiss === "hit") {
          let infinity = playerCharacter.characterName === "gojo" && gojo.infinity ? true : false;

          dispatch(rivalSlice.actions.setDirection(sukuna.x > rivalCharacter.x ? "right" : "left"));
          dispatch(gojoSlice.actions.setTakeDamage({ // megfix
            isTakingDamage: true, damage: 100, takeDamageAnimationCheck: true, knockback: 150, timeout: 300, animation: ""
          }));
          // dispatch(gojoSlice.actions.setTakeDamage({ // playerSlice change
          //   isTakingDamage: true, damage: 100, takeDamageAnimationCheck: true, knockback: 150, timeout: 500
          // }))
          // dispatch(playerSlice.actions.updateHealth(-100))
          // setTimeout(() => {
          //   dispatch(playerSlice.actions.moveCharacterWD({ x: sukuna.x < playerCharacter.x ? +150 : -150, y: 0 }));
          // }, 100);
          if (playerCharacter.characterName === "gojo" && !gojo.infinity)
            dispatch(playerSlice.actions.jumpWS(15))
          else if (playerCharacter.characterName !== "gojo")
            dispatch(playerSlice.actions.jumpWS(15))
          // dispatch(playerSlice.actions.setAnimationState("takeDamage"))
          // setTimeout(() => {
          //   dispatch(playerSlice.actions.setAnimationState("stance"))
          // }, 1000);
        }
      }
    }
  }, [gojo.redAttackMoment, gojo.blueAttackMoment, gojo.purpleAttackMoment, sukuna.bamAttackMoment,
  Math.abs(rivalCharacter.x - sukuna.bamLandingPositionX) <= 100, playerCharacter.x < rivalCharacter.x
  ])

  // Cursed energy interval functions
  const startPlayerCursedEnergyInterval = () => {
    if (playerCEincreaseIntervalRef.current != null) return;
    const isGojo = gameSettings.selectedCharacter === "gojo" ? true : false;
    playerCEincreaseIntervalRef.current = setInterval(() => {
      if (playerCharacter.cursedEnergy.currentCursedEnergy < playerCharacter.cursedEnergy.maxCursedEnergy) {
        dispatch(playerSlice.actions.changeCursedEnergy(5));
      }
    }, isGojo ? 100 : 1000);
  };
  const startRivalCursedEnergyInterval = () => {
    if (rivalCEincreaseIntervalRef.current !== null) return;
    rivalCEincreaseIntervalRef.current = setInterval(() => {
      // && sukuna.rivalDomainExpansion === false
      if (rivalCharacter.cursedEnergy.currentCursedEnergy < rivalCharacter.cursedEnergy.maxCursedEnergy) {
        dispatch(rivalSlice.actions.changeCursedEnergy(5));
      }
    }, 1000);
  };
  // Cursed energy interval functions end
  const stopInterval = (ref) => {
    // Interval çalışmıyorsa durdurma
    if (ref.current === null) return;

    clearInterval(ref.current);
    ref.current = null;
  };

  // Cursed energy increase interval start and stop effect
  useEffect(() => {
    startPlayerCursedEnergyInterval()
    return () => {
      stopInterval(playerCEincreaseIntervalRef);
    }
  }, [playerCharacter.cursedEnergy.currentCursedEnergy < playerCharacter.cursedEnergy.maxCursedEnergy, nue.isActive]);

  useEffect(() => {
    startRivalCursedEnergyInterval()
    return () => {
      stopInterval(rivalCEincreaseIntervalRef);
    }
  }, [rivalCharacter.cursedEnergy.currentCursedEnergy < rivalCharacter.cursedEnergy.maxCursedEnergy, sukuna.rivalDomainExpansion, nue.isActive]);

  // TOGGLE BUGFIX
  const [domainAmplificationKeyCD, setDomainAmplificationKeyCD] = useState(false);
  useEffect(() => {
    console.log(domainAmplificationKeyCD)
    if (!domainAmplificationKeyCD) return;
    setTimeout(() => {
      setDomainAmplificationKeyCD(false);
    }, 500);
  }, [domainAmplificationKeyCD]);

  const [showControls, setShowControls] = useState(false);

  // Player movement control
  useEffect(() => {
    const handleKeyDown = (event) => {
      let key = event.key.toLowerCase();
      if (key == "escape" && showControls) {
        setShowControls(false)
      }
      if (key === " ") key = "space";
      keysPressed.current[key] = true;
    };

    const handleKeyUp = (event) => {
      let key = event.key.toLowerCase();
      if (event.key === " ") key = "space";
      keysPressed.current[key] = false;
      if (key === "a" || key === "d") {
        // dispatch(playerSlice.actions.setAnimationState("stance"));
        dispatch(playerSlice.actions.setAnimationState({ animation: "stance", animationPriority: 2, finishAnimation: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    dispatch(sukunaSlice.actions.setCloseRange(Math.abs(xDistance) < 200));

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      // wasd movement
      if (playerCharacter.canMove && !playerCharacter.hardStun && !playerCharacter.devStun) {

        dispatch(sukunaSlice.actions.setCloseRange(Math.abs(xDistance) < 200));
        // if (keysPressed.current.w && playerCharacter.y > 0) {
        //   dispatch(playerSlice.actions.moveCharacter({ x: 0, y: -megumiSpeed }));
        // }
        if (keysPressed.current.w && !playerCharacter.isJumping && !playerCharacter.animationBlocker) {
          dispatch(playerSlice.actions.jump());
          // if (!playerCharacter.animationBlocker)
          // dispatch(playerSlice.actions.setAnimationBlocker(true))
          // setTimeout(() => {
          //   dispatch(playerSlice.actions.setAnimationBlocker(false))
          // }, 1400); // jump bug
        }
        if (keysPressed.current.a && playerCharacter.x > 0) {
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.characterName === "meguna" ? -5 : -megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("left"));
          if (!playerCharacter.isJumping && playerCharacter.animationState !== "move")
            // dispatch(playerSlice.actions.setAnimationState("move"));
            dispatch(playerSlice.actions.setAnimationState({ animation: "move", animationPriority: 2, finishAnimation: false }));
        }
        // if (keysPressed.current.s && playerCharacter.y < gameAreaHeight - megumiHeight) {
        //   dispatch(playerSlice.actions.moveCharacter({ x: 0, y: megumiSpeed }));
        // }
        if (keysPressed.current.d && playerCharacter.x < gameAreaWidth - megumiWidth) {
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.characterName === "meguna" ? 5 : megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("right"));
          if (!playerCharacter.isJumping && !playerCharacter.animationBlocker && playerCharacter.animationState !== "move")
            // dispatch(playerSlice.actions.setAnimationState("move"));
            dispatch(playerSlice.actions.setAnimationState({ animation: "move", animationPriority: 2, finishAnimation: false }));

        }
        if (keysPressed.current.q && !domainAmplificationKeyCD) {
          // dispatch(playerSlice.actions.setIsBlocking(true));
          // dispatch(playerSlice.actions.setCanMove(true)); 
          // if DA already active, end it 
          if (!playerCharacter.domainAmplification.isActive
            && !playerCharacter.simpleDomain.isActive && !playerCharacter.fallingBlossomEmotion.isActive) {
            dispatch(playerSlice.actions.setDomainAmplification({ isActive: true }))
            dispatch(playerSlice.actions.setIsBlocking(true));
          }
          else {
            dispatch(playerSlice.actions.setDomainAmplification({ isActive: false }))
            dispatch(playerSlice.actions.setIsBlocking(false));
          }
          setDomainAmplificationKeyCD(true);
        }
        if (keysPressed.current.t) {
          if (rivalCharacter.devStun) dispatch(rivalSlice.actions.setDevStun(false));
          else dispatch(rivalSlice.actions.setDevStun(true));
        }
        if (keysPressed.current.space)
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.direction === "right" ? 75 : -75, y: 0 }));
      }
    }, 75);

    if (!nue.isAttacking) dispatch(setNueDirection(megumi.direction));

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, playerCharacter.health > 0, playerCharacter.y, playerCharacter.x, rivalCharacter.x,
    rivalCharacter.canMove, playerCharacter.canMove, xDistance, playerCharacter.isJumping, playerCharacter.hardStun,
    playerCharacter.domainAmplification.isActive, domainAmplificationKeyCD,
    playerCharacter.simpleDomain.isActive && playerCharacter.fallingBlossomEmotion.isActive, rivalCharacter.devStun, showControls,
    playerCharacter.devStun]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      dispatch(playerSlice.actions.applyGravity());
      dispatch(rivalSlice.actions.applyGravity());
    }, 1000 / 10); // 60 FPS

    return () => clearInterval(gameLoop);
  }, []);

  // Rival auto movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (rivalCharacter.canMove && !rivalCharacter.hardStun && !rivalCharacter.devStun && !gameSettings.tutorial) {
        let stepX = 0;
        if (rivalCharacter.rivalDirection === "stop") {
          if (rivalCharacter.animationState !== "stance")
            dispatch(rivalSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
          // dispatch(rivalSlice.actions.setAnimationState("stance"));
          stepX = 0;
        }
        else {
          // dispatch(rivalSlice.actions.setAnimationState("move"));
          dispatch(rivalSlice.actions.setAnimationState({ animation: "move", animationPriority: 2, finishAnimation: false }));
          if (rivalCharacter.rivalDirection === "R") stepX = rivalCharacter.characterName === "sukuna" ? 5 : 30;
          else if (rivalCharacter.rivalDirection === "L") stepX = rivalCharacter.characterName === "sukuna" ? -5 : -30;
        }

        dispatch(rivalSlice.actions.moveCharacter({ x: stepX, y: 0 }));
      } else
        if (rivalCharacter.animationState !== "stance" && !gameSettings.entry)
          // dispatch(rivalSlice.actions.setAnimationState("stance"));
          dispatch(rivalSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [rivalCharacter.hardStun, rivalCharacter.devStun, rivalCharacter.rivalDirection, rivalCharacter.canMove,
  gameSettings.entry, gameSettings.tutorial]);

  // Rival Movement Control
  useEffect(() => {
    const interval = setInterval(() => {
      let direction = "";
      if (Math.abs(xDistance) <= 100) { // Decide which direction sukuna should head to
        direction = "stop";
      } else {
        if (xDistance <= -100) { // left
          direction = "L";
        }
        else if (xDistance >= 100) { // right
          direction = "R";
        }
      }
      if (rivalCharacter.rivalDirection !== direction) {
        dispatch(rivalSlice.actions.setRivalDirection(direction));
      }
    }, 100); // Update interval
    return () => {
      clearInterval(interval);
    };
  }, [Math.abs(xDistance) <= 100, Math.abs(xDistance) <= 300]);

  // Main menu
  const [showMenu, setShowMenu] = React.useState(true); // Menü durumunu tutan state ##
  const [showFinishMenu, setShowFinishMenu] = React.useState(false); // Menü durumunu tutan state
  const [showReturnToMainMenuButton, setShowReturnToMainMenuButton] = useState(false); // Tutorial menu

  useEffect(() => {
    if (gameSettings.tutorial) {
      console.log("Tutorial mode on!")
      dispatch(rivalSlice.actions.setDevStun(true));
      dispatch(rivalSlice.actions.setInvulnerability(true));
    }
  }, [gameSettings.tutorial]);
  const handleStartGame = () => {
    // const storedUsername = localStorage.getItem('username');
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    setShowFinishMenu(false)
    setShowMenu(false); // Start Game butonuna tıklandığında menüyü gizle
    dispatch(gameSettingsSlice.actions.setEntry(true));
    setShowReturnToMainMenuButton(true)
  };

  const handleRestart = () => {
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    setShowFinishMenu(false);
    dispatch(gameSettingsSlice.actions.setEntry(true));
    setShowReturnToMainMenuButton(true)
  };
  const handleReturnToMainMenu = () => {
    dispatch(tutorialSlice.actions.setTutorialMode(false))
    setShowMenu(true)
    setShowFinishMenu(false)
    setShowReturnToMainMenuButton(false)
  };

  // CHECK HEALTH, FINISH GAME 
  useEffect(() => {
    if (gameSettings.tutorial) return;
    if (playerCharacter.health.currentHealth <= 0) {
      setTimeout(() => {
        setShowFinishMenu(true);
        dispatch(gameSettingsSlice.actions.setWinner(rivalCharacter.characterName));
        dispatch(rivalSlice.actions.resetState())
        dispatch(playerSlice.actions.resetState())
      }, 2000);
    } else if (rivalCharacter.health.currentHealth <= 0) {
      setTimeout(() => {
        setShowFinishMenu(true);
        dispatch(gameSettingsSlice.actions.setWinner(playerCharacter.characterName));
        dispatch(rivalSlice.actions.resetState())
        dispatch(playerSlice.actions.resetState())
      }, 2000);
    }
  }, [playerCharacter.health.currentHealth > 0, rivalCharacter.health.currentHealth > 0, gameSettings.tutorial]);

  const [reRender, setReRender] = useState(0);
  const [domainClashText, setDomainClashText] = useState(false);

  useEffect(() => {
    setReRender(reRender + 1)  // #check
    if (gameSettings.domainClash) {
      setDomainClashText(true);
      setTimeout(() => {
        setDomainClashText(false);
      }, 3000);
    }
  }, [gameSettings.domainClash, gameSettings.domainClashReady, playerCharacter.domainStatus.isActive, rivalCharacter.domainStatus.isActive])


  useEffect(() => { // tutorial health refill
    if (rivalCharacter.health.currentHealth <= 0 && gameSettings.tutorial) {
      setTimeout(() => {
        dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 560 }));
        // dispatch(rivalSlice.actions.setAnimationState("entry"))
        dispatch(rivalSlice.actions.setAnimationState({ animation: "entry", animationPriority: 10, finishAnimation: true }));
        dispatch(rivalSlice.actions.setHealth(rivalCharacter.health.maxHealth));
      }, 1000);
    }
    if (playerCharacter.health.currentHealth <= 0 && gameSettings.tutorial) {
      setTimeout(() => {
        dispatch(playerSlice.actions.moveCharacterTo({ x: 600, y: 560 }));
        // dispatch(playerSlice.actions.setAnimationState("entry"))
        dispatch(playerSlice.actions.setAnimationState({ animation: "entry", animationPriority: 5, finishAnimation: true }));
        dispatch(playerSlice.actions.setHealth(playerCharacter.health.maxHealth));
      }, 1000);
    }
  }, [rivalCharacter.health.currentHealth <= 0, gameSettings.tutorial, playerCharacter.health.currentHealth <= 0])



  // Kamera başlatma ve fotoğraf çekme
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captureLoop, setCaptureLoop] = useState(false);
  const [detection, setDetection] = useState(null);
  const [isBoundingBoxDrew, setIsBoundingBoxDrew] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  // Kameraya erişim izni ve video akışını başlat
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      setCaptureLoop(true);
      setDetection(null);
    } catch (err) {
      console.error("Kameraya erişilemedi:", err);
    }
  };
  // Kamerayı durdurma
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    videoRef.current.srcObject = null; // Kamerayı temizle
    setCaptureLoop(false);
    setDetection(null); // Detection sıfırla
  };

  // effect for photo capture interval
  useEffect(() => {
    let photoInterval = null;
    if (captureLoop && videoRef.current && detection === null) {
      photoInterval = setInterval(() => {
        console.log("taking a photo")
        takePhoto()
      }, 1000);
    }
    return () => {
      clearInterval(photoInterval);
    }
  }, [captureLoop, videoRef.current, detection]);

  // Fotoğrafı çek ve state'e kaydet
  const takePhoto = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Video boyutunda bir canvas ayarla
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Video akışından canvas'a fotoğrafı çiz
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Canvas'tan data URL'si al
    const imageDataUrl = canvas.toDataURL("image/png");

    axios({
      method: "POST",
      url: "https://detect.roboflow.com/jjk2/1",
      params: {
        api_key: "a9Ry4tLXIymXh1Lvmzk7"
      },
      // data: formData,
      // data: imageData,
      data: imageDataUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      if (response.data.predictions.length > 0) {
        console.log(response.data.predictions[0].class);
        setDetection(response.data.predictions[0]);
        setReRender(reRender + 1)
        setCaptureLoop(false);
        setShowCanvas(true);
        setTimeout(() => {
          setShowCanvas(false);
          setIsBoundingBoxDrew(false);
        }, 2000);
      }
    })
      .catch(function (error) {
        console.log(error.message);
      });
  };
  // Detection sonuçlarını canvas'a çiz
  useEffect(() => {
    if (detection && canvasRef.current && !isBoundingBoxDrew) {
      console.log("effect: ", detection)
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // // Önceki çizimleri temizle
      // context.clearRect(0, 0, canvas.width, canvas.height);

      // Kırmızı bir kare çiz
      context.strokeStyle = "red";
      context.lineWidth = 2;
      const squareSizeX = detection.width; // Karenin boyutu
      const squareSizeY = detection.height; // Karenin boyutu
      const centerX = detection.x - (squareSizeX / 2);
      const centerY = detection.y - (squareSizeY / 2);

      context.strokeRect(centerX, centerY, squareSizeX, squareSizeY);

      setIsBoundingBoxDrew(true);

      if (detection.class === "gojo") {
        console.log("GOJO DOMAIN EXPANSION STARTED")
        dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, forceExpand: true }))
        setDetection(null);
        stopCamera();
      }
      if (detection.class === "sukuna") {
        console.log("SUKUNA DOMAIN EXPANSION STARTED")

        dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, forceExpand: true }))
        setDetection(null);
        stopCamera();
      }

    }
  }, [detection, isBoundingBoxDrew, reRender]);
  const handleStartCamera = () => {
    startCamera()
  };


  // TUTORIAL

  const [fetchedTutorial, setFetchedTutorial] = useState(null);
  const handleTutorialSelected = (tutorialIndex) => { // ###
    if (tutorialIndex === undefined) return;
    dispatch(tutorialSlice.actions.setRivalAction("domain"))
    setFetchedTutorial(tutorialState.characters[gameSettings.selectedCharacter][tutorialIndex])
    setReRender(reRender + 1)
    console.log("tutorial selected", showReturnToMainMenuButton)
  };
  useEffect(() => {
    if (fetchedTutorial === null)
      setFetchedTutorial(tutorialState.characters[gameSettings.selectedCharacter][0])
  })

  const keysPressed2 = useRef({
    q: false, z: false, x: false, c: false, g: false, j: false, k: false, l: false,
    e: false, r: false, shift: false, space: false
  });

  useEffect(() => {
    if (!tutorialState.characters[gameSettings.selectedCharacter]) return;
    const localFetchedTutorial
      = tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex];

    const handleKeyDown2 = (event) => {
      let key = event.key.toLowerCase();
      if (key === " ") key = "space";
      keysPressed2.current[key] = true;

      for (let i = 0; i < localFetchedTutorial.tasks.length; i++) {
        if (localFetchedTutorial.tasks[i].isPressed === false) {
          if (localFetchedTutorial.tasks[i].keys.length !== 1) {
            let key1 = localFetchedTutorial.tasks[i].keys[0].toLowerCase();
            let key2 = localFetchedTutorial.tasks[i].keys[1].toLowerCase();
            if (keysPressed2.current[key1] && keysPressed2.current[key2]) {
              dispatch(tutorialSlice.actions.completeOneTaskInTutorial({
                tutorialIndex: tutorialState.currentTaskIndex, taskIndex: i, character: gameSettings.selectedCharacter
              }));
            }
          }
          else {

            if (key === localFetchedTutorial.tasks[i].keys[0] && localFetchedTutorial.title !== "Domain Clash") {
              dispatch(tutorialSlice.actions.completeOneTaskInTutorial({
                tutorialIndex: tutorialState.currentTaskIndex, taskIndex: i, character: gameSettings.selectedCharacter
              }));
            }
          }
        }
      }
    };
    const handleKeyUp2 = (event) => {
      let key = event.key.toLowerCase();
      keysPressed2.current[key] = false;
    };

    // check if all mini tasks are completed
    if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex] === undefined) return;
    console.log(tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].isComplete ? "quest is complete" : "quest is not completed yet")
    let isAllComplete = true;
    for (let i = 0; i < localFetchedTutorial.tasks.length; i++) {
      if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].tasks[i].isPressed === false) {
        console.log("quest: NOT ALL TASKS COMPLETED: ", localFetchedTutorial.tasks[i].key)
        isAllComplete = false;
        break;
      }
    }
    if (isAllComplete) {
      console.log("ALL COMPLETED", localFetchedTutorial.title)
      dispatch(tutorialSlice.actions.allTasksFinished({ tutorialIndex: tutorialState.currentTaskIndex, character: gameSettings.selectedCharacter }));
    }

    window.addEventListener("keydown", handleKeyDown2);
    window.addEventListener("keyup", handleKeyUp2);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown2);
      window.removeEventListener("keyup", handleKeyUp2);
    };
  }, [tutorialState.characters[gameSettings.selectedCharacter], fetchedTutorial, tutorialState.currentTaskIndex
    , gameSettings.selectedCharacter]);

  const setGoBackToTutorialMenu = () => {
    setShowMenu(true);
    dispatch(tutorialSlice.actions.setGoToTutorialMenu(true))
    dispatch(tutorialSlice.actions.setTutorialMode(false))
    setReRender(reRender + 1);
  }
  const goToNextTutorial = () => {
    dispatch(tutorialSlice.actions.setTutorialIndex(tutorialState.currentTaskIndex + 1));
    handleStartGame();
  }

  const goldWords = ["cursed", "technique", "energy", "energy,", "reverse", "simple", "technique"];
  const redWords = ["sure", "hit", "effect"];
  const blueWords = ["infinity"];
  const highlightText = (text) => {
    return text.split(' ').map((word, index) => {
      if (redWords.includes(word.toLowerCase())) {
        return <span key={index} className="highlight-text-red">{word} </span>;
      } else if (goldWords.includes(word.toLowerCase())) {
        return <span key={index} className="highlight-text-gold">{word} </span>;
      } else if (blueWords.includes(word.toLowerCase())) {
        return <span key={index} className="highlight-text-blue">{word} </span>;
      } else {
        return <span key={index}>{word} </span>;
      }
    });
  };

  const lights = Array.from({ length: 200 });
  const colors = ['purple', 'blue'];
  return (
    <>
      <div className="game-area">
        {/* <h1> {x * 16} x {x * 9}</h1> */}
        <audio src={require("../Assets/audios/yowaimo.mp3")} ref={yowaimoSoundEffectRef}></audio>

        {tutorialState.tutorialMode && (
          <>
            {/* TIPS POPUP */}
            <div className="quest-container" style={{
              display: tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].tips !== "" ? "block" : "none",
              left: "10px"
            }}>
              {/* <div className="quest-title">{fetchedTutorial.title}</div> */}
              <div className="quest-title">{tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].title}</div>
              <br />
              <div className="tasks">
                <div className="stylish-border"></div>
                <div className="task-text">
                  {/* Call the highlightText function to render the tips with highlighted words */}
                  {highlightText(tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].tips)}
                </div>
              </div>
            </div>

            {/* TUTORIAL TASKS POPUP */}
            <div className="quest-container" style={{ display: tutorialState.tutorialMode ? "block" : "none" }}>
              {/* <div className="quest-title">{fetchedTutorial.title}</div> */}
              <div className="quest-title">{tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].title}</div>
              <br />
              <div className="tasks">
                <div className="stylish-border"></div>

                {tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].tasks.map((task, index) => (
                  <>
                    <div className="task" key={index}>
                      <div className="checkbox-container">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className={`checkbox ${task.isPressed ? "checked" : ""}`}></div>
                          <div className="task-text">{task.text}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>

                          {task.keys.map((key, i) => (
                            <span className="scale-fixer">
                              <span className="keyboard-button wide-keyboard-button"
                                style={{ width: key === "shift" || key === "space" ? "120px" : "80px", marginLeft: key === "shift" || key === "space" ? "-40px" : "-15px" }}
                              ><i>{key}</i></span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>

              <div className="quest-buttons"
                style={{ display: !tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].isComplete ? "none" : "flex" }}
              >
                <button className="quest-button" onClick={() =>
                  setGoBackToTutorialMenu()
                }>Tutorial Menu</button>
                <button className="quest-button" style={{ display: tutorialState.currentTaskIndex === tutorialState.characters[gameSettings.selectedCharacter].length - 1 ? "none" : "block" }}
                  onClick={goToNextTutorial}>Next</button>
              </div>
            </div>
          </>

        )}


        <div style={{
          position: "absolute",
          top: "20%",
          left: "40%",
          maxWidth: "300px",
        }}>
          <video ref={videoRef} autoPlay
            style={{ position: "absolute", maxWidth: "300px", display: captureLoop ? "block" : "none", zIndex: 999 }} />
          <canvas ref={canvasRef}
            style={{ position: "absolute", display: showCanvas ? "block" : "none", maxWidth: "300px", zIndex: 999 }}
          ></canvas>
        </div>


        {showControls && ( // show controls button clicked
          <ControlsPage />
        )}
        {/* <h1>{showMenu ? "Main Menu" : showFinishMenu ? "Finish Menu" : "Game Area"}</h1> */}
        {!showMenu && !showFinishMenu && (
          <>
            {showReturnToMainMenuButton && (
              <button className="return-to-mainmenu" onClick={handleReturnToMainMenu}></button>
            )}
            <button className="open-camera" style={{ marginLeft: "-50px" }} onClick={() => captureLoop ? stopCamera() : handleStartCamera()}></button>

            {gameSettings.tutorial && (
              <button className="show-controls-button" onClick={() => setShowControls(true)}>Show Controls</button>
            )}
          </>
        )}
        {showMenu ? ( // Menü gösteriliyor mu?
          <MainMenu onStartGame={handleStartGame} onTutorialSelected={handleTutorialSelected} onShowControls={() => setShowControls(true)} /> // Evet ise menüyü göster
        ) : showFinishMenu ? (
          <FinishMenu onRestart={handleRestart} onReturnToMainMenu={() => handleReturnToMainMenu()} />
        ) : (
          <>
            <div style={{
              width: "100%", height: "100%", position: "absolute",
              backgroundImage: `url(${require("../Assets/bg.jpg")})`, opacity: 1,
              // backgroundImage: `url(${require("../Assets/domain-clash.png")})`, opacity: 1,
              backgroundSize: "cover", backgroundPosition: "bottom", transition: "opacity 0s ease-in-out",
            }}></div>
            <div style={{
              width: "100%", height: "100%", position: "absolute",
              backgroundImage: `url(${require("../Assets/pixel-sukuna-domain.png")})`, opacity: sukuna.domainStatus.isActive ? 1 : 0,
              backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0s ease-in-out",
            }}></div>
            <div style={{
              width: "100%", height: "100%", position: "absolute",
              backgroundImage: `url(${require("../Assets/gojo-domain-end.png")})`, opacity: gojo.domainStatus.isActive ? 1 : 0,
              backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0s ease-in-out",
            }}></div>
            <div style={{
              width: "100%", height: "100%", position: "absolute",
              backgroundImage: `url(${require("../Assets/domain-clash.png")})`, opacity: // BETTER WAY ???
                playerCharacter.domainStatus.isActive && rivalCharacter.domainStatus.isActive ? 1 : 0,
              backgroundSize: "cover", backgroundPosition: "bottom", transition: "opacity 0s ease-in-out",
            }}></div>
            {gameSettings.selectedCharacter === "sukuna" && (
              <>
                {/* <SatoruGojo rivalSlice={playerSlice} rivalState={playerCharacter} /> */}
                <Sukuna xDistance={xDistance} rivalSlice={rivalSlice} rivalState={rivalCharacter} />
              </>
            )}
            {gameSettings.selectedRivalCharacter === "sukuna" && (
              <>
                <Sukuna xDistance={xDistance} rivalSlice={playerSlice} rivalState={playerCharacter} />
              </>
            )}
            {gameSettings.selectedCharacter === "meguna" && (
              <>
                {/* <SatoruGojo rivalSlice={playerSlice} rivalState={playerCharacter} /> */}
                <Meguna xDistance={xDistance} rivalSlice={rivalSlice} rivalState={rivalCharacter} />
              </>
            )}
            {gameSettings.selectedRivalCharacter === "meguna" && (
              <>
                <Meguna xDistance={xDistance} rivalSlice={playerSlice} rivalState={playerCharacter} />
              </>
            )}
            {gameSettings.selectedCharacter === "megumi" && (
              <>
                <Megumi rivalSlice={rivalSlice} rivalState={rivalCharacter} />
                {/* <Sukuna xDistance={xDistance} rivalSlice={playerSlice} rivalState={playerCharacter} /> */}
                <Nue rivalSlice={rivalSlice} rivalState={rivalCharacter} />
                <DivineDogs rivalSlice={rivalSlice} rivalState={rivalCharacter} />
              </>
            )}
            {gameSettings.selectedRivalCharacter === "megumi" && (
              <>
                <Megumi rivalSlice={playerSlice} rivalState={playerCharacter} />
                <DivineDogs rivalSlice={playerSlice} rivalState={playerCharacter} />
                <Nue rivalSlice={playerSlice} rivalState={playerCharacter} />
              </>
            )}
            {gameSettings.selectedCharacter === "gojo" && (
              <>
                <SatoruGojo xDistance={xDistance} rivalSlice={rivalSlice} rivalState={rivalCharacter} />
              </>
            )}
            {gameSettings.selectedRivalCharacter === "gojo" && (
              <>
                <SatoruGojo xDistance={xDistance} rivalSlice={playerSlice} rivalState={playerCharacter} />
              </>
            )}

            <CharacterInterface playerCharacter={playerCharacter} rivalCharacter={rivalCharacter}></CharacterInterface>
            <div className="domain-clash-timer-container" style={{
              display: gameSettings.domainClashReady && !gameSettings.domainClash ? "block" : "none", zIndex: 9, top: "50%", left: "50%", translate: "-50% -50%",
              // display: "block", zIndex: 9, top: "50%", left: "50%", translate: "-50% -50%",
            }}>
              <h5 style={{ position: "absolute", top: "-140%", left: "50%", translate: "-50% -50%", width: 300 }}>
                Domain Clash Chance!</h5>
              <div className="domain-clash-timer-bar" style={{ top: "50%", left: "50%", translate: "-50% -50%" }}>
                <div className="domain-clash-timer"></div>
              </div>
            </div>
            <div style={{ position: "absolute", display: domainClashText ? "block" : "none", top: "40%", left: "50%", translate: "-50% -50%", zIndex: 999 }}>
              <h3>PERFECT TIMED DOMAIN CLASH</h3>
            </div>

          </>
        )}


        {/* <div className="effect-container">
          <div className="center-dot">
            {lights.map((_, index) => {
              const angle = Math.random() * 360; // Random angle between 0 and 360
              const animationDelay = Math.random() * 2 + 's'; // Random delay between 0 and 2 seconds
              return (
                <div className="light-container"
                  key={index}
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}>
                  <div
                    className="light"
                    style={{
                      animationDelay: animationDelay,
                      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    }}
                  ></div>
                </div>
              );
            })}
          </div>

        </div> */}
      </div>

    </>
  );
};

export default GameArea;
