import { useEffect, useMemo, useRef } from "react";
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
import { setWinner } from "../redux/GameSettingsSlice";
import SukunaSlice from "../redux/character-slices/SukunaSlice";
import MegumiSlice from "../redux/character-slices/MegumiSlice";

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
  const gameSettings = useSelector((state: any) => state.GameSettingsState);
  const sukuna = useSelector((state: any) => state.SukunaState);
  const megumi = useSelector((state: any) => state.MegumiState);
  const gojo = useSelector((state: any) => state.GojoState);
  const nue = useSelector((state: any) => state.NueState);
  const divineDogs = useSelector((state: any) => state.DivineDogsState);
  const yDistance = useMemo(() => (megumi.y - sukuna.y), [megumi.y, sukuna.y]);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, q: false, t: false, space: false, y: false });
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
    dispatch(playerSlice.actions.moveCharacterTo({ x: 200, y: 100 }));
    dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 100 }));
  }, []);

  //check red damage, purple damage
  useEffect(() => {
    if (gameSettings.selectedCharacter === "gojo") {
      if (gojo.redAttackMoment) {
        let distance =
          gojo.direction === "right" ? (Math.abs(gojo.x + 250 - rivalCharacter.x) <= 200 ? "close range" : "far") :
            (Math.abs(gojo.x - 200 - rivalCharacter.x) <= 200 ? "close range" : "far")
        console.log("gamearea red: ", distance)
        if (distance === "close range") dispatch(rivalSlice.actions.updateHealth(redDamage))
      }
      if (gojo.purpleAttackMoment) {
        let distance =
          gojo.y - rivalCharacter.y >= -150 && gojo.y - rivalCharacter.y <= 100 ?
            gojo.direction === "right" ? (gojo.x - rivalCharacter.x <= 0 ? "hit" : "miss") :
              (gojo.x - rivalCharacter.x > 0 ? "hit" : "miss") : "miss"
        console.log("gamearea red: ", distance)
        if (distance === "hit") {
          dispatch(rivalSlice.actions.updateHealth(purpleDamage))
        }
      }
    }
    else {
      if (gojo.redAttackMoment) {
        let distance =
          gojo.direction === "right" ? (Math.abs(gojo.x + 250 - playerCharacter.x) <= 200 ? "close range" : "far") :
            (Math.abs(gojo.x - 200 - playerCharacter.x) <= 200 ? "close range" : "far")
        console.log("gamearea red: ", distance)
        if (distance === "close range") dispatch(playerSlice.actions.updateHealth(redDamage))
      }
      if (gojo.purpleAttackMoment) {
        let distance =
          gojo.y - playerCharacter.y >= -150 && gojo.y - playerCharacter.y <= 100 ?
            gojo.direction === "right" ? (gojo.x - playerCharacter.x <= 0 ? "hit" : "miss") :
              (gojo.x - playerCharacter.x > 0 ? "hit" : "miss") : "miss"
        console.log("gamearea red: ", distance)
        if (distance === "hit") {
          dispatch(playerSlice.actions.updateHealth(purpleDamage))
          dispatch(megumiSlice.actions.moveCharacterWD({ x: playerCharacter.direction === "right" ? -200 : +200, y: 0 }));
          dispatch(megumiSlice.actions.setAnimationState("takeDamage"))
          setTimeout(() => {
            dispatch(megumiSlice.actions.setAnimationState("stance"))
          }, 1000);
        }
      }
    }

  }, [gojo.redAttackMoment, gojo.purpleAttackMoment])

  // Cursed energy interval functions
  const startPlayerCursedEnergyInterval = () => {
    if (playerCEincreaseIntervalRef.current != null) return;
    playerCEincreaseIntervalRef.current = setInterval(() => {
      if (playerCharacter.cursedEnergy.currentCursedEnergy < playerCharacter.cursedEnergy.maxCursedEnergy) {
        dispatch(playerSlice.actions.changeCursedEnergy(gameSettings.selectedCharacter === "gojo" ? + 50 : 10));
      }
    }, 1000);
  };
  const startRivalCursedEnergyInterval = () => {
    if (rivalCEincreaseIntervalRef.current !== null) return;
    rivalCEincreaseIntervalRef.current = setInterval(() => {
      // && sukuna.rivalDomainExpansion === false
      if (rivalCharacter.cursedEnergy.currentCursedEnergy < rivalCharacter.cursedEnergy.maxCursedEnergy) {
        dispatch(rivalSlice.actions.changeCursedEnergy(+10));
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
  }, [playerCharacter.cursedEnergy, nue.isActive]);

  useEffect(() => {
    startRivalCursedEnergyInterval()
    return () => {
      stopInterval(rivalCEincreaseIntervalRef);
    }
  }, [rivalCharacter.cursedEnergy, sukuna.rivalDomainExpansion, nue.isActive]);

  // Megumi movement control
  useEffect(() => {
    const handleKeyDown = (event) => {
      let key = event.key.toLowerCase();
      if (event.key === " ") key = "space";
      keysPressed.current[key] = true;
    };

    const handleKeyUp = (event) => {
      let key = event.key.toLowerCase();
      if (event.key === " ") key = "space";
      keysPressed.current[key] = false;
      if (key === "q") {
        dispatch(playerSlice.actions.setIsBlocking(false));
        dispatch(playerSlice.actions.setCanMove(true));
      }
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
      if (playerCharacter.canMove) {

        dispatch(sukunaSlice.actions.setCloseRange(Math.abs(xDistance) < 200));

        // if (keysPressed.current.w && playerCharacter.y > 0) {
        //   dispatch(playerSlice.actions.moveCharacter({ x: 0, y: -megumiSpeed }));
        // }
        if (keysPressed.current.w && !playerCharacter.isJumping) {
          dispatch(megumiSlice.actions.jump());
          dispatch(megumiSlice.actions.setAnimatinBlocker(true))
          setTimeout(() => {
            dispatch(megumiSlice.actions.setAnimatinBlocker(false))
          }, 1500);
        }
        if (keysPressed.current.a && playerCharacter.x > 0) {
          dispatch(playerSlice.actions.moveCharacter({ x: -megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("left"));
          if (!playerCharacter.isJumping)
            dispatch(playerSlice.actions.setAnimationState("move"));
        }
        if (keysPressed.current.s && playerCharacter.y < gameAreaHeight - megumiHeight) {
          dispatch(playerSlice.actions.moveCharacter({ x: 0, y: megumiSpeed }));
        }
        if (keysPressed.current.d && playerCharacter.x < gameAreaWidth - megumiWidth) {
          dispatch(playerSlice.actions.moveCharacter({ x: megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("right"));
          if (!playerCharacter.isJumping)
            dispatch(playerSlice.actions.setAnimationState("move"));

        }
        if (keysPressed.current.q) {
          dispatch(playerSlice.actions.setIsBlocking(true));
          dispatch(playerSlice.actions.setCanMove(true));
        }
        if (keysPressed.current.t) {
          if (rivalCharacter.canMove) dispatch(rivalSlice.actions.setCanMove(false));
          else dispatch(rivalSlice.actions.setCanMove(true));
        }
        if (keysPressed.current.space)
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.direction === "right" ? 200 : -200, y: 0 }));
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
  }, [dispatch, playerCharacter.health, playerCharacter.y, playerCharacter.x, rivalCharacter.x,
    rivalCharacter.canMove, playerCharacter.canMove, xDistance, playerCharacter.isJumping]);

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
      if (rivalCharacter.canMove) {
        if (rivalCharacter.dashGauge > 70) {
          dispatch(rivalSlice.actions.moveCharacterTo({ x: playerCharacter.x, y: playerCharacter.y }));

          dispatch(rivalSlice.actions.setDashGauge(0))
        }
        else {
          dispatch(rivalSlice.actions.setDashGauge(rivalCharacter.dashGauge + 1))
          let stepX = 0;
          let stepY = 0;
          if (rivalCharacter.rivalDirection === "R") [stepX, stepY] = [10, 0];
          else if (rivalCharacter.rivalDirection === "L") [stepX, stepY] = [-10, 0];
          else if (rivalCharacter.rivalDirection === "U") [stepX, stepY] = [0, -10];
          else if (rivalCharacter.rivalDirection === "D") [stepX, stepY] = [0, 10];
          else if (rivalCharacter.rivalDirection === "UL") [stepX, stepY] = [-10, -10];
          else if (rivalCharacter.rivalDirection === "UR") [stepX, stepY] = [10, -10];
          else if (rivalCharacter.rivalDirection === "DL") [stepX, stepY] = [-10, 10];
          else if (rivalCharacter.rivalDirection === "DR") [stepX, stepY] = [10, 10];
          else if (rivalCharacter.rivalDirection === "stop") [stepX, stepY] = [0, 0];
          dispatch(rivalSlice.actions.moveCharacter({ x: stepX, y: stepY }));
        }
      }
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [rivalCharacter.rivalDirection, rivalCharacter.canMove, rivalCharacter.dashGauge]);

  // Rival Movement Control
  useEffect(() => {
    const interval = setInterval(() => {
      let direction = "";
      const deltaX = playerCharacter.x - rivalCharacter.x; // >0 is right, <0 is left
      const deltaY = playerCharacter.y - rivalCharacter.y; // >0 is up, <0 is down
      if (Math.abs(deltaX) <= 200 && Math.abs(deltaY) <= 80) { // Decide which direction sukuna should head to
        direction = "stop";
      } else {
        if (deltaX <= -100) { // left
          if (deltaY <= -20) { // up
            direction = "UL";
          } else if (deltaY >= 50) { // down
            direction = "DL";
          } else {
            direction = "L";
          }
        }
        else if (deltaX >= 100) { // right
          if (deltaY <= -20) { // up
            direction = "UR";
          } else if (deltaY >= 50) { // down
            direction = "DR";
          } else {
            direction = "R";
          }
        } else {
          if (deltaY > 0) direction = "D";
          else direction = "U"
        }
      }
      if (rivalCharacter.rivalDirection !== direction) {
        dispatch(rivalSlice.actions.setRivalDirection(direction));
      }
    }, 100); // Update interval
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, playerCharacter.x, playerCharacter.y, rivalCharacter.closeRange, rivalCharacter.rivalDirection]);

  // Main menu
  const [showMenu, setShowMenu] = React.useState(false); // Menü durumunu tutan state ##
  const [showFinishMenu, setShowFinishMenu] = React.useState(false); // Menü durumunu tutan state

  const handleStartGame = () => {
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    dispatch(playerSlice.actions.moveCharacterTo({ x: 200, y: 200 }));
    dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 200 }));
    setShowFinishMenu(false)
    setShowMenu(false); // Start Game butonuna tıklandığında menüyü gizle
    if (gameSettings.selectedCharacter === "gojo") {
      yowaimoSoundEffectRef.current.volume = 0.5;
      yowaimoSoundEffectRef.current.play();
    }
  };
  const handleRestart = () => {
    dispatch(playerSlice.actions.resetState())
    dispatch(rivalSlice.actions.resetState())
    dispatch(playerSlice.actions.moveCharacterTo({ x: 200, y: 200 }));
    dispatch(rivalSlice.actions.moveCharacterTo({ x: 800, y: 200 }));
    setShowFinishMenu(false);
    if (gameSettings.selectedCharacter === "gojo") {
      yowaimoSoundEffectRef.current.volume = 0.2;
      yowaimoSoundEffectRef.current.play();
    }
  };
  const handleReturnToMainMenu = () => {
    setShowMenu(true)
    setShowFinishMenu(false)
  };

  // useEffect(() => {
  //   if (xDistance < 0 && sukuna.rivalDirection !== "left") {
  //     dispatch(rivalDirection("left"));
  //   } else if (xDistance > 0 && sukuna.rivalDirection !== "right") {
  //     dispatch(rivalDirection("right"));
  //   }
  // }, [xDistance]);

  useEffect(() => {
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
  }, [playerCharacter.health.currentHealth, rivalCharacter.health.currentHealth]);

  // setInterval(function gravity() {
  //   if (playerCharacter.y < gameAreaHeight) {
  //     playerCharacter.y += 5;
  //   }
  // })

  // useEffect(() => {
  //   if (playerCharacter.y > rivalCharacter.y) {

  //   }
  // }, [playerCharacter.y, rivalCharacter.y]);


  return (
    <div className="game-area">
      <audio src={require("../Assets/audios/yowaimo.mp3")} ref={yowaimoSoundEffectRef}></audio>
      {showMenu ? ( // Menü gösteriliyor mu?
        <MainMenu onStartGame={handleStartGame} /> // Evet ise menüyü göster
      ) : showFinishMenu ? (
        <FinishMenu onRestart={handleRestart} onReturnToMainMenu={() => handleReturnToMainMenu()} />
      ) : (
        <>
          <div style={{
            width: "100%", height: "100%", position: "absolute",
            backgroundImage: `url(${require("../Assets/bg.jpg")})`, opacity: !sukuna.rivalDomainExpansion ? 0.7 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
          }}></div>
          <div style={{
            width: "100%", height: "100%", position: "absolute",
            backgroundImage: `url(${require("../Assets/pixel-sukuna-domain.png")})`, opacity: sukuna.rivalDomainExpansion ? 1 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
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
              <SatoruGojo rivalSlice={rivalSlice} rivalState={rivalCharacter} />
            </>
          )}
          {gameSettings.selectedRivalCharacter === "gojo" && (
            <>
              <SatoruGojo rivalSlice={playerSlice} rivalState={playerCharacter} />
            </>
          )}

          {/* PLAYER INTERFACE COMPONENT FOR SUKUNA */}
          {gameSettings.selectedCharacter === "sukuna" && (

            <div className="player-interface">
              <div className="health-and-ce-bars">

                <div className="megumi-health" style={{ position: "absolute", width: "250px", height: "25px", top: "30%", }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.health.currentHealth * 250 / playerCharacter.health.maxHealth, maxWidth: "250px", height: "25px",
                    top: "-120%", backgroundColor: "red", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -280%)", fontSize: "15px" }}>{playerCharacter.health.currentHealth}</p>
                </div>
                <div className="megumi-cursed-energy" style={{ position: "absolute", width: "250px", height: "25px", top: "30%" }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.cursedEnergy.currentCursedEnergy * 250 / playerCharacter.cursedEnergy.maxCursedEnergy,
                    maxWidth: "250px", height: "25px", top: "-2%", backgroundColor: "purple", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{playerCharacter.cursedEnergy.currentCursedEnergy}</p>
                </div>
              </div>
              <div className="skills-container">

                {/* Cleave Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.cleaveCD} />
                  <img src={require("../Assets/slash.png")} alt="" />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Cleave:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.cleaveCD.isReady ? "Ready - J" :
                      (playerCharacter.cleaveCD.remainingTime + "sec")}</p>
                </div>

                {/* Dismantle Attack */}
                <div className="skill" >
                  <CircularProgressBar skillCD={playerCharacter.dismantleCD} />
                  <div style={{ display: "block", position: "relative", top: "-40px", left: "0px", height: "50px" }}>
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "5px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "15px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "25px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "35px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />

                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "15px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "25px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "35px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "45px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                  </div>
                  <p style={{ marginTop: "-40px", lineBreak: "loose" }}>Dismantle:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.dismantleCD.isReady ?
                      (playerCharacter.closeRange ? "Ready - K" : "Get Closer") :
                      (playerCharacter.dismantleCD.remainingTime + "sec")}</p>
                  {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                </div>

                {/* Domain Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.domainCD} />
                  <img src={require("../Assets/malevolent_shrine.png")} alt="" style={{}} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Domain:</p>
                  <p style={{ marginTop: "-10px" }}>{playerCharacter.domainCD.isReady ?
                    (playerCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                    (playerCharacter.domainCD.remainingTime + "sec")}</p>
                </div>
              </div>
              {/* Rapid Slash */}
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {playerCharacter.rapidAttackCounter.currentCount >= playerCharacter.rapidAttackCounter.maxCount ? "Ready - J" : playerCharacter.rapidAttackCounter.currentCount + "/" + playerCharacter.rapidAttackCounter.maxCount} </p>
              </div>

            </div>
          )}

          {/* PLAYER INTERFACE COMPONENT FOR MEGUMI */}
          {gameSettings.selectedCharacter === "megumi" && (

            <div className="player-interface">
              <div className="health-and-ce-bars">

                <div className="megumi-health" style={{ position: "absolute", width: "250px", height: "25px", top: "30%", }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.health.currentHealth * 250 / playerCharacter.health.maxHealth, maxWidth: "250px", height: "25px",
                    top: "-120%", backgroundColor: "red", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -280%)", fontSize: "15px" }}>{playerCharacter.health.currentHealth}</p>
                </div>
                <div className="megumi-cursed-energy" style={{ position: "absolute", width: "250px", height: "25px", top: "30%" }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.cursedEnergy.currentCursedEnergy * 250 / playerCharacter.cursedEnergy.maxCursedEnergy,
                    maxWidth: "250px", height: "25px", top: "-2%", backgroundColor: "purple", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{playerCharacter.cursedEnergy.currentCursedEnergy}</p>
                </div>
              </div>
              <div className="skills-container">

                {/* Nue Attack */}
                <div className="skill" >
                  <CircularProgressBar skillCD={playerCharacter.nueAttackCD} />
                  <img src={require('../Assets/nue-side.png')} alt="" style={{ scale: "0.8" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Nue Attack:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.nueAttackCD.isReady ?
                      (nue.isActive ? "Ready - j" : "Call Nue First") :
                      (playerCharacter.nueAttackCD.remainingTime + "sec")}</p>
                  {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                </div>

                {/* Call Nue */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.callNueCD} />
                  <img src={require("../Assets/nue.png")} alt="" style={{ scale: "0.8", marginTop: "5px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                    {nue.isActive ? "Cancel Nue:" : "Call Nue:"}</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.callNueCD.isReady ? "Ready - K" :
                      (playerCharacter.callNueCD.remainingTime + "sec")}</p>
                </div>


                {/* Domain Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.divineDogsCD} />
                  <img src={require("../Assets/white-wolf.png")} alt="" style={{ scale: "0.8", marginTop: "10px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Wolf Attack:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.divineDogsCD.isReady ?
                      (playerCharacter.divineDogsCD.isReady ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                      (playerCharacter.divineDogsCD.remainingTime + "sec")}</p>
                </div>
              </div>
              {/* Rapid Slash
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {playerCharacter.rapidAttackCounter.currentCount >= playerCharacter.rapidAttackCounter.maxCount ? "Ready - J" : playerCharacter.rapidAttackCounter.currentCount + "/" + playerCharacter.rapidAttackCounter.maxCount} </p>
              </div> */}

            </div>
          )}

          {/* PLAYER INTERFACE COMPONENT FOR GOJO */}
          {gameSettings.selectedCharacter === "gojo" && (

            <div className="player-interface">
              <div className="health-and-ce-bars">

                <div className="megumi-health" style={{ position: "absolute", width: "250px", height: "25px", top: "30%", }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.health.currentHealth * 250 / playerCharacter.health.maxHealth, maxWidth: "250px", height: "25px",
                    top: "-120%", backgroundColor: "red", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -280%)", fontSize: "15px" }}>{playerCharacter.health.currentHealth}</p>
                </div>
                <div className="megumi-cursed-energy" style={{ position: "absolute", width: "250px", height: "25px", top: "30%" }}>
                  <div style={{
                    position: "absolute", width: playerCharacter.cursedEnergy.currentCursedEnergy * 250 / playerCharacter.cursedEnergy.maxCursedEnergy,
                    maxWidth: "250px", height: "25px", top: "-2%", backgroundColor: "purple", borderRadius: "10px"
                  }}>
                  </div>
                  <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{playerCharacter.cursedEnergy.currentCursedEnergy}</p>
                </div>
              </div>
              <div className="skills-container">

                {/* Blue Attack */}
                <div className="skill" >
                  <CircularProgressBar skillCD={playerCharacter.blueCD} />
                  <img src={require('../Assets/blue.png')} alt="" style={{ scale: "0.6" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Blue Attack:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.blueCD.isReady ?
                      "Ready - J" :
                      (playerCharacter.blueCD.remainingTime + "sec")}</p>
                  {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                </div>

                {/* Red Nue */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.redCD} />
                  <img src={require("../Assets/red.png")} alt="" style={{ scale: "0.6", marginTop: "0px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                    Red Attack:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.redCD.isReady ?
                      (playerCharacter.cursedEnergy.currentCursedEnergy >= 100 ? "Ready - K" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/100") :
                      (playerCharacter.redCD.remainingTime + "sec")}</p>
                </div>


                {/* Purple Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.purpleCD} />
                  <img src={require("../Assets/purple.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Purple Attack:</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.purpleCD.isReady ?
                      (playerCharacter.cursedEnergy.currentCursedEnergy >= 150 ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/150") :
                      (playerCharacter.purpleCD.remainingTime + "sec")}</p>
                </div>

                {/* Domain Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.domainCD} />
                  <img src={require("../Assets/domain-hand.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                  <p>coming soon...</p>
                  {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Infinite Void:</p>
                    
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.purpleCD.isReady ?
                      (playerCharacter.purpleCD.isReady ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                      (playerCharacter.purpleCD.remainingTime + "sec")}</p> */}
                </div>
              </div>
              {/* Rapid Slash
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {playerCharacter.rapidAttackCounter.currentCount >= playerCharacter.rapidAttackCounter.maxCount ? "Ready - J" : playerCharacter.rapidAttackCounter.currentCount + "/" + playerCharacter.rapidAttackCounter.maxCount} </p>
              </div> */}

            </div>
          )}


        </>
      )}



      {/*
      <img src={require('../Assets/malevolent_shrine.png')} alt="" style={{ position: "absolute", display: sukuna.rivalDomainExpansion ? "block" : "none", left: megumi.x < sukuna.x ? sukuna.x + 120 : sukuna.x - 150, top: sukuna.y - 50, height: shrineHeight, opacity: 0.8, scale: "1.2" }} />
      */}

    </div>
  );
};

export default GameArea;
