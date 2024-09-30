import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Megumi from "../components/characters/Megumi";
import Sukuna from "../components/characters/Sukuna";
import Nue from "../components/Nue";
import sukunaSlice from "../redux/character-slices/SukunaSlice";
import megumiSlice from "../redux/character-slices/MegumiSlice";
import gojoSlice from "../redux/character-slices/GojoSlice";
import { useDispatch, useSelector } from "react-redux";
import { nueActivity, setNueDirection } from "../redux/NueSlice";
import DivineDogs from "../components/DivineDogs";
import MainMenu from "../components/MainMenu";
import React from "react";
import CircularProgressBar from "../components/CircularProgressBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import SatoruGojo from "../components/characters/SatoruGojo";
import FinishMenu from "../components/FinishMenu";
import gameSettingsSlice, { setDomainClashReady, setEntry, setWinner } from "../redux/GameSettingsSlice";
import SukunaSlice from "../redux/character-slices/SukunaSlice";
import MegumiSlice from "../redux/character-slices/MegumiSlice";
import CharacterInterface from "../components/CharacterInterface";
import ControlsPage from "./ControlsPage";
import axios from "axios";
import tutorialSlice, { setGoToTutorialMenu } from "../redux/TutorialSlice";

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
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, q: false, t: false, space: false, y: false, e: false, r: false, shift: false });
  let intervalId = null;
  const playerCEincreaseIntervalRef = useRef(null);
  const rivalCEincreaseIntervalRef = useRef(null);

  // Sound Effects
  const yowaimoSoundEffectRef = useRef<HTMLAudioElement>(null);


  const selectedPlayer = useSelector((state: any) => {
    if (gameSettings.selectedCharacter === "sukuna") {
      return { playerState: state.SukunaState, playerSlice: sukunaSlice };
    } else if (gameSettings.selectedCharacter === "megumi") {
      return { playerState: state.MegumiState, playerSlice: megumiSlice };
    } else if (gameSettings.selectedCharacter === "gojo") {
      return { playerState: state.GojoState, playerSlice: gojoSlice };
    }
  });
  const selectedRival = useSelector((state: any) => {
    if (gameSettings.selectedRivalCharacter === "sukuna") {
      return { rivalState: state.SukunaState, rivalSlice: sukunaSlice };
    } else if (gameSettings.selectedRivalCharacter === "megumi") {
      return { rivalState: state.MegumiState, rivalSlice: megumiSlice };
    } else if (gameSettings.selectedRivalCharacter === "gojo") {
      return { rivalState: state.GojoState, rivalSlice: gojoSlice };
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
    const cd = tutorialState.tutorialMode ? 0 : 2000;
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

      dispatch(playerSlice.actions.moveCharacterTo({ x: gameSettings.selectedCharacter === "sukuna" ? -1000 : 600, y: 560 }));
      dispatch(rivalSlice.actions.moveCharacterTo({ x: gameSettings.selectedRivalCharacter === "sukuna" ? -1000 : 800, y: 560 }));
      setTimeout(() => {
      }, cd);
      setTimeout(() => {
        dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 560 }));
        dispatch(rivalSlice.actions.setAnimationState("entry"))

        setTimeout(() => {
          dispatch(playerSlice.actions.moveCharacterTo({ x: 600, y: 560 }));
          dispatch(playerSlice.actions.setAnimationState("entry"))
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
        dispatch(setEntry(false));
        dispatch(rivalSlice.actions.setDirection("left"));
        dispatch(sukunaSlice.actions.setTransition("all .2s, transform 0s"))
      }, cd);
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
          dispatch(sukunaSlice.actions.setDirection(gojo.direction === "left" ? "right" : "left"))
          dispatch(sukunaSlice.actions.setTakeDamage({
            isTakingDamage: true, damage: -redDamage, takeDamageAnimationCheck: true, knockback: 50, timeout: 500
          }));
        }
      } else {
        let distance =
          gojo.direction === "right" ? (Math.abs(gojo.x + 250 - playerCharacter.x) <= 200 ? "close range" : "far") :
            (Math.abs(gojo.x - 200 - playerCharacter.x) <= 200 ? "close range" : "far")
        console.log("gamearea red: ", distance)
        if (distance === "close range") {
          dispatch(sukunaSlice.actions.setDirection(gojo.direction === "left" ? "right" : "left"))
          dispatch(sukunaSlice.actions.setTakeDamage({ // *char
            isTakingDamage: true, damage: -redDamage, takeDamageAnimationCheck: true, knockback: 50, timeout: 500
          }));
        }
      }
    }
    if (gojo.blueAttackMoment) {
      if (gameSettings.selectedCharacter === "gojo") { // is rival gonna take damage from gojo blue
        let distance =
          (Math.abs(gojo.bluePosition.x - rivalCharacter.x) <= 300 ? "close range" : "far")
        console.log(distance)
        if (distance === "close range") {
          dispatch(rivalSlice.actions.setCanMove(false))
          dispatch(sukunaSlice.actions.setGravity(0))
          // move rival to blue
          setTimeout(() => {
            dispatch(rivalSlice.actions.moveCharacterTo({ x: gojo.bluePosition.x + 50, y: gojo.bluePosition.y + 30 }))
            const damageInterval = setInterval(() => { // give damage slowly
              dispatch(rivalSlice.actions.updateHealth(-150 / 8))
            }, 100)
            setTimeout(() => { // unstun rival
              dispatch(rivalSlice.actions.setCanMove(true)) // ***
              dispatch(sukunaSlice.actions.setGravity(5))
              clearInterval(damageInterval);
            }, 800);
          }, 500);

        }
      } else {
        let distance =
          (Math.abs(gojo.bluePosition.x - playerCharacter.x) <= 300 ? "close range" : "far")
        if (distance === "close range") {
          dispatch(playerSlice.actions.setCanMove(false))
          dispatch(sukunaSlice.actions.setGravity(0))
          // move rival to blue
          setTimeout(() => {
            dispatch(playerSlice.actions.moveCharacterTo({ x: gojo.bluePosition.x + 50, y: gojo.bluePosition.y + 30 }))
            const damageInterval = setInterval(() => { // give damage slowly
              dispatch(playerSlice.actions.updateHealth(-150 / 8))
            }, 100)
            setTimeout(() => { // unstun rival
              dispatch(rivalSlice.actions.setCanMove(true))
              dispatch(playerSlice.actions.setCanMove(true)) // ***
              dispatch(sukunaSlice.actions.setGravity(5))
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
        if (distance === "hit") {
          setTimeout(() => {
            dispatch(rivalSlice.actions.setDirection(gojo.x < rivalCharacter.x ? "left" : "right"));
            dispatch(sukunaSlice.actions.setTakeDamage({
              isTakingDamage: true, damage: -purpleDamage, takeDamageAnimationCheck: true, knockback: 200, timeout: 500
            }));
          }, (Math.abs(gojo.x - sukuna.x) * 0.7)); // hitbox time fixer
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
            dispatch(sukunaSlice.actions.setTakeDamage({
              isTakingDamage: true, damage: -purpleDamage, takeDamageAnimationCheck: true, knockback: 200, timeout: 500
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
        if (rivalCharacter.characterName === "gojo" && gojo.infinity) {
          if (!playerCharacter.domainAmplification.isActive) {
            hitOrMiss = "miss";
          }
        }
        if (hitOrMiss === "hit") {
          let infinity = rivalCharacter.characterName === "gojo" && gojo.infinity ? true : false;
          setTimeout(() => {
            dispatch(rivalSlice.actions.setDirection(sukuna.x > rivalCharacter.x ? "right" : "left"));
            // dispatch(rivalSlice.actions.moveCharacterWD({ x: sukuna.x - rivalCharacter.x > 50 ? -150 : +150, y: 0 }));
            // console.log(rivalCharacter.x, sukuna.bamLandingPositionX)

            dispatch(rivalSlice.actions.jumpWS(15))
            dispatch(gojoSlice.actions.setTakeDamage({ // megfix
              isTakingDamage: true, damage: 100, takeDamageAnimationCheck: infinity ? false : true, knockback: infinity ? 0 : 150, timeout: 300
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
            isTakingDamage: true, damage: 100, takeDamageAnimationCheck: infinity ? false : true, knockback: infinity ? 0 : 150, timeout: 300
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


  const [domainAmplificationKeyCD, setDomainAmplificationKeyCD] = useState(false);
  useEffect(() => {
    console.log(domainAmplificationKeyCD)
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
      // if (key === "q") {
      //   dispatch(playerSlice.actions.setIsBlocking(false));
      //   dispatch(playerSlice.actions.setCanMove(true));
      // }
      if (key === "a" || key === "d") {
        dispatch(playerSlice.actions.setAnimationState("stance"));
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
          dispatch(playerSlice.actions.setAnimationBlocker(true))
          setTimeout(() => {
            dispatch(playerSlice.actions.setAnimationBlocker(false))
          }, 1500);
        }
        if (keysPressed.current.a && playerCharacter.x > 0) {
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.characterName === "sukuna" ? -5 : -megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("left"));
          if (!playerCharacter.isJumping && !playerCharacter.animationBlocker && playerCharacter.animationState !== "move")
            dispatch(playerSlice.actions.setAnimationState("move"));
        }
        // if (keysPressed.current.s && playerCharacter.y < gameAreaHeight - megumiHeight) {
        //   dispatch(playerSlice.actions.moveCharacter({ x: 0, y: megumiSpeed }));
        // }
        if (keysPressed.current.d && playerCharacter.x < gameAreaWidth - megumiWidth) {
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.characterName === "sukuna" ? 5 : megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("right"));
          if (!playerCharacter.isJumping && !playerCharacter.animationBlocker && playerCharacter.animationState !== "move")
            dispatch(playerSlice.actions.setAnimationState("move"));
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
        if (keysPressed.current.y) {
          dispatch(megumiSlice.actions.moveCharacterWD({ x: playerCharacter.direction === "right" ? -50 : +50, y: 0 }));
          dispatch(megumiSlice.actions.setAnimationState("takeDamage"))
          setTimeout(() => {
            dispatch(megumiSlice.actions.setAnimationState("stance"))
          }, 1000);
        }

      }
      // else
      // dispatch(playerSlice.actions.setAnimationState("stance"));
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
  }, [megumi.isJumping]);

  // Rival auto movement
  useEffect(() => {
    // if (gameSettings.selectedCharacter === "sukuna") return;
    const interval = setInterval(() => {
      if (rivalCharacter.canMove && !rivalCharacter.hardStun && !rivalCharacter.devStun && !gameSettings.tutorial) {
        if (rivalCharacter.dashGauge > 70) {
          dispatch(rivalSlice.actions.moveCharacterTo({ x: playerCharacter.x, y: playerCharacter.y }));
          dispatch(rivalSlice.actions.setDashGauge(0))
        }
        else {
          dispatch(rivalSlice.actions.setDashGauge(rivalCharacter.dashGauge + 1))
          let stepX = 0;
          let stepY = 0;
          if (rivalCharacter.rivalDirection === "stop") {
            if (rivalCharacter.animationState !== "stance")
              dispatch(rivalSlice.actions.setAnimationState("stance"));
            [stepX, stepY] = [0, 0];
          }
          else {
            dispatch(rivalSlice.actions.setAnimationState("move"));
            if (rivalCharacter.rivalDirection === "R") [stepX, stepY] = [rivalCharacter.characterName === "sukuna" ? 5 : 30, 0];
            else if (rivalCharacter.rivalDirection === "L") [stepX, stepY] = [rivalCharacter.characterName === "sukuna" ? -5 : -30, 0];
          }

          dispatch(rivalSlice.actions.moveCharacter({ x: stepX, y: stepY }));
        }
      } else
        if (rivalCharacter.animationState !== "stance" && !gameSettings.entry)
          dispatch(rivalSlice.actions.setAnimationState("stance"));
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [rivalCharacter.hardStun, rivalCharacter.devStun, rivalCharacter.rivalDirection, rivalCharacter.canMove,
  rivalCharacter.dashGauge >= 70 || rivalCharacter.dashGauge <= 0, gameSettings.entry, gameSettings.tutorial]);

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
      // console.log("rivald: ", direction)
      if (rivalCharacter.rivalDirection !== direction) {
        dispatch(rivalSlice.actions.setRivalDirection(direction));
      }
    }, 100); // Update interval
    return () => {
      clearInterval(interval);
    };
  }, [xDistance >= 100, xDistance <= -100, xDistance <= -300, xDistance >= 300]);
  // rivalCharacter.closeRange, rivalCharacter.rivalDirection
  // Main menu
  // const [showMenu, setShowMenu] = React.useState(false); // Menü durumunu tutan state ##
  const [showMenu, setShowMenu] = React.useState(true); // Menü durumunu tutan state ##
  const [showFinishMenu, setShowFinishMenu] = React.useState(false); // Menü durumunu tutan state
  const [showReturnToMainMenuButton, setShowReturnToMainMenuButton] = useState(false); // Tutorial menu

  useEffect(() => {
    console.log("effect tutorial: ", gameSettings.tutorial)
    if (gameSettings.tutorial) {
      console.log("Tutorial mode on!")
      dispatch(rivalSlice.actions.setDevStun(true));
      dispatch(rivalSlice.actions.setInvulnerability(true));

    }
  }, [gameSettings.tutorial]);
  const handleStartGame = () => {
    // const storedUsername = localStorage.getItem('username');
    // if (storedUsername === "ayso") {
    //   aysoSoundEffectRef.current.volume = 1;
    //   aysoSoundEffectRef.current.play();
    // }
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    setShowFinishMenu(false)
    setShowMenu(false); // Start Game butonuna tıklandığında menüyü gizle
    dispatch(setEntry(true));
    setShowReturnToMainMenuButton(true)
  };

  const handleRestart = () => {
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    setShowFinishMenu(false);
    dispatch(setEntry(true));
    setShowReturnToMainMenuButton(true)
  };
  const handleReturnToMainMenu = () => {
    dispatch(tutorialSlice.actions.setTutorialMode(false))
    setShowMenu(true)
    setShowFinishMenu(false)
    setShowReturnToMainMenuButton(false)
  };


  // useEffect(() => {
  //   if (xDistance < 0 && sukuna.rivalDirection !== "left") {
  //     dispatch(rivalDirection("left"));
  //   } else if (xDistance > 0 && sukuna.rivalDirection !== "right") {
  //     dispatch(rivalDirection("right"));
  //   }
  // }, [xDistance]);

  useEffect(() => {
    if (gameSettings.tutorial) return;
    if (playerCharacter.health.currentHealth <= 0) {
      setTimeout(() => {
        setShowFinishMenu(true);
        dispatch(setWinner(rivalCharacter.characterName));
        dispatch(rivalSlice.actions.resetState())
        dispatch(playerSlice.actions.resetState())
      }, 2000);
    } else if (rivalCharacter.health.currentHealth <= 0) {
      setTimeout(() => {
        setShowFinishMenu(true);
        dispatch(setWinner(playerCharacter.characterName));
        dispatch(rivalSlice.actions.resetState())
        dispatch(playerSlice.actions.resetState())
      }, 2000);
    }
  }, [playerCharacter.health.currentHealth > 0, rivalCharacter.health.currentHealth > 0, gameSettings.tutorial]);
  const [reRender, setReRender] = useState(0);
  const [domainClashText, setDomainClashText] = useState(false);
  useEffect(() => {
    setReRender(reRender + 1)
    if (gameSettings.domainClash) {
      setDomainClashText(true);
      setTimeout(() => {
        setDomainClashText(false);
      }, 3000);
    }
  }, [gameSettings.domainClash, gameSettings.domainClashReady, playerCharacter.domainStatus.isActive, rivalCharacter.domainStatus.isActive])

  const [timerPercentage, setTimerPercentage] = useState(100);
  useEffect(() => {
    if (gameSettings.domainClashReady) {
      triggerTimer()
    }
  }, [gameSettings.domainClashReady])
  const triggerTimer = () => {
    let percentage = 100;
    setInterval(() => { // 2 saniyede bitmesi için 2000
      setTimerPercentage(percentage);
      percentage -= 6
    }, 100);
  }
  // const x = 50;

  // const aysoSoundEffectRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { // tutorial health refill
    if (rivalCharacter.health.currentHealth <= 0 && gameSettings.tutorial) {
      setTimeout(() => {
        dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 560 }));
        dispatch(rivalSlice.actions.setAnimationState("entry"))
        dispatch(rivalSlice.actions.setHealth(rivalCharacter.health.maxHealth));
      }, 1000);
    }
    if (playerCharacter.health.currentHealth <= 0 && gameSettings.tutorial) {
      setTimeout(() => {
        dispatch(playerSlice.actions.moveCharacterTo({ x: 600, y: 560 }));
        dispatch(playerSlice.actions.setAnimationState("entry"))
        dispatch(playerSlice.actions.setHealth(playerCharacter.health.maxHealth));
      }, 1000);
    }
  }, [rivalCharacter.health.currentHealth <= 0, gameSettings.tutorial, playerCharacter.health.currentHealth <= 0])



  // Kamera başlatma ve fotoğraf çekme
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captureLoop, setCaptureLoop] = useState(false);
  const [detection, setDetection] = useState(null);
  const [detectedHandSign, setDetectedHandSign] = useState(null);
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
    // setShowMenu(false)
    // setShowFinishMenu(false)
    console.log("input handler in gamearea: ", gameSettings.selectedCharacter, tutorialIndex)
    if (tutorialIndex === undefined) return;
    console.log("input handler in gamearea2: ", gameSettings.selectedCharacter, tutorialIndex)
    dispatch(tutorialSlice.actions.setRivalAction("domain"))
    setFetchedTutorial(tutorialState.characters[gameSettings.selectedCharacter][tutorialIndex])
    // setFetchedTutorialIndex(parseInt(tutorialIndex)) // tutorialIndex);
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
  return (
    <>
      <div className="game-area">
        {/* <h1> {x * 16} x {x * 9}</h1> */}
        <audio src={require("../Assets/audios/yowaimo.mp3")} ref={yowaimoSoundEffectRef}></audio>
        {/* <audio src={require("../Assets/audios/ayso.ogg")} ref={aysoSoundEffectRef}></audio> */}

        {tutorialState.tutorialMode && (

          <div className="quest-container" style={{ display: tutorialState.tutorialMode ? "block" : "none" }}>
            {/* <div className="quest-title">{fetchedTutorial.title}</div> */}
            <div className="quest-title">{tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].title}</div>
            <br />
            <div className="tasks">
              <div className="stylish-border"></div>

              {tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].tasks.map((task, index) => (
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
                <div className="domain-clash-timer"
                  style={{
                    width: `${timerPercentage}%`,
                  }}></div>
              </div>
            </div>
            <div style={{ position: "absolute", display: domainClashText ? "block" : "none", top: "40%", left: "50%", translate: "-50% -50%", zIndex: 999 }}>
              <h3>PERFECT TIMED DOMAIN CLASH</h3>
            </div>

          </>
        )}



        {/*
      <img src={require('../Assets/malevolent_shrine.png')} alt="" style={{ position: "absolute", display: sukuna.rivalDomainExpansion ? "block" : "none", left: megumi.x < sukuna.x ? sukuna.x + 120 : sukuna.x - 150, top: sukuna.y - 50, height: shrineHeight, opacity: 0.8, scale: "1.2" }} />
      */}

      </div>
    </>
  );
};

export default GameArea;
