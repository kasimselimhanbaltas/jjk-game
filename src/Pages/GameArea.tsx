import { useEffect, useMemo, useRef } from "react";
import Megumi from "../components/Megumi";
import Sukuna from "../components/Sukuna";
import Nue from "../components/Nue";
import sukunaSlice from "../store/SukunaSlice";
import megumiSlice from "../store/MegumiSlice";
import { useDispatch, useSelector } from "react-redux";
import { nueActivity, setNueDirection } from "../store/NueSlice";
import DivineDogs from "../components/DivineDogs";
import MainMenu from "../components/MainMenu";
import React from "react";
import CircularProgressBar from "../components/CircularProgressBar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const characterHeight = 50;

const megumiWidth = 50;
const megumiHeight = 180;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const megumiSpeed = 30;
const shrineHeight = 250;

const GameArea = () => {

  const dispatch = useDispatch()
  const gameSettings = useSelector((state: any) => state.GameSettingsState);
  const sukuna = useSelector((state: any) => state.SukunaState);
  const megumi = useSelector((state: any) => state.MegumiState);
  const nue = useSelector((state: any) => state.NueState);
  const divineDogs = useSelector((state: any) => state.DivineDogsState);
  const xDistance = useMemo(() => (megumi.x - sukuna.x), [megumi.x, sukuna.x]);
  const yDistance = useMemo(() => (megumi.y - sukuna.y), [megumi.y, sukuna.y]);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, t: false, space: false });
  let intervalId = null;
  const playerCEincreaseIntervalRef = useRef(null);
  const rivalCEincreaseIntervalRef = useRef(null);


  const selectedState = useSelector((state: any) => {
    if (gameSettings.selectedCharacter === "sukuna") {
      return { player: state.SukunaState, rival: state.MegumiState };
    } else {
      return { player: state.MegumiState, rival: state.SukunaState };
    }
  });
  const selectedSlice = useSelector((state: any) => {
    if (gameSettings.selectedCharacter === "sukuna") {
      return { player: sukunaSlice, rival: megumiSlice };
    } else {
      return { player: megumiSlice, rival: sukunaSlice };
    }
  });
  // for reducer methods
  const playerSlice = selectedSlice.player;
  const rivalSlice = selectedSlice.rival;

  // for reading
  const playerCharacter = selectedState.player;
  const rivalCharacter = selectedState.rival;


  // place characters
  useEffect(() => {
    playerSlice.actions.moveCharacterTo({ x: 200, y: 200 });
    rivalSlice.actions.moveCharacterTo({ x: 800, y: 200 });

  }, []);

  // Cursed energy interval functions
  const startPlayerCursedEnergyInterval = () => {
    console.log("inc1", playerCEincreaseIntervalRef.current)
    if (playerCEincreaseIntervalRef.current != null) return;
    console.log("inc2")
    playerCEincreaseIntervalRef.current = setInterval(() => {
      console.log("inc3", playerCharacter.cursedEnergy.currentCursedEnergy, playerCharacter.cursedEnergy.maxCursedEnergy)

      if (playerCharacter.cursedEnergy.currentCursedEnergy < playerCharacter.cursedEnergy.maxCursedEnergy) {
        console.log("inc4")
        dispatch(playerSlice.actions.changeCursedEnergy(+10));
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
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    dispatch(sukunaSlice.actions.setCloseRange(Math.abs(xDistance) < 200));

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (playerCharacter.canMove) {
        dispatch(sukunaSlice.actions.setCloseRange(Math.abs(xDistance) < 200));

        if (keysPressed.current.w && playerCharacter.y > 0) {
          dispatch(playerSlice.actions.moveCharacter({ x: 0, y: -megumiSpeed }));
        }
        if (keysPressed.current.a && playerCharacter.x > 0) {
          dispatch(playerSlice.actions.moveCharacter({ x: -megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("left"));
        }
        if (keysPressed.current.s && playerCharacter.y < gameAreaHeight - megumiHeight) {
          dispatch(playerSlice.actions.moveCharacter({ x: 0, y: megumiSpeed }));
        }
        if (keysPressed.current.d && playerCharacter.x < gameAreaWidth - megumiWidth) {
          dispatch(playerSlice.actions.moveCharacter({ x: megumiSpeed, y: 0 }));
          dispatch(playerSlice.actions.setDirection("right"));
        }
        if (keysPressed.current.t) {
          if (rivalCharacter.canMove) dispatch(rivalSlice.actions.setCanMove(false));
          else dispatch(rivalSlice.actions.setCanMove(true));
        }
        if (keysPressed.current.space)
          dispatch(playerSlice.actions.moveCharacter({ x: playerCharacter.direction === "right" ? 200 : -200, y: 0 }));
      }
    }, 75);


    if (!nue.isAttacking) dispatch(setNueDirection(megumi.direction));

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, playerCharacter.health, playerCharacter.y, playerCharacter.x, rivalCharacter.x, rivalCharacter.canMove, xDistance]);

  // Sukuna movement
  useEffect(() => {
    if (gameSettings.selectedCharacter === "sukuna") return;
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

  // Sukuna Movement Control
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
  const [showMenu, setShowMenu] = React.useState(false); // Menü durumunu tutan state

  const handleStartGame = () => {
    setShowMenu(false); // Start Game butonuna tıklandığında menüyü gizle
  };

  // useEffect(() => {
  //   if (xDistance < 0 && sukuna.rivalDirection !== "left") {
  //     dispatch(rivalDirection("left"));
  //   } else if (xDistance > 0 && sukuna.rivalDirection !== "right") {
  //     dispatch(rivalDirection("right"));
  //   }
  // }, [xDistance]);

  return (
    <div className="game-area">
      {showMenu ? ( // Menü gösteriliyor mu?
        <MainMenu onStartGame={handleStartGame} /> // Evet ise menüyü göster
      ) : (
        <>
          <div style={{
            width: "100%", height: "100%", position: "absolute",
            backgroundImage: `url(${require("../Assets/bg.jpg")})`, opacity: !sukuna.rivalDomainExpansion ? 0.7 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
          }}></div>
          <div style={{
            width: "100%", height: "100%", position: "absolute",
            backgroundImage: `url(${require("../Assets/sukuna-domain.jpg")})`, opacity: sukuna.rivalDomainExpansion ? 1 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
          }}></div>
          <Megumi />
          <Nue />
          <DivineDogs />
          <Sukuna xDistance={xDistance} />
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
                      (playerCharacter.nueAttackCD.isReady ? "Ready - j" : "Get Closer") :
                      (playerCharacter.nueAttackCD.remainingTime + "sec")}</p>
                  {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                </div>

                {/* Call Nue */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.callNueCD} />
                  <img src={require("../Assets/nue.png")} alt="" style={{ scale: "0.8", marginTop: "5px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                    {playerCharacter.nueActive ? "Cancel Nue:" : "Call Nue:"}</p>
                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.callNueCD.isReady ? "Ready - K" :
                      (playerCharacter.callNueCD.remainingTime + "sec")}</p>
                </div>


                {/* Domain Attack */}
                <div className="skill">
                  <CircularProgressBar skillCD={playerCharacter.divineDogsCD} />
                  <img src={require("../Assets/white-wolf.png")} alt="" style={{ scale: "0.8", marginTop: "10px" }} />
                  <p style={{ marginTop: "10px", lineBreak: "loose" }}>Call Wolves:</p>
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

        </>
      )}



      {/*
      <img src={require('../Assets/malevolent_shrine.png')} alt="" style={{ position: "absolute", display: sukuna.rivalDomainExpansion ? "block" : "none", left: megumi.x < sukuna.x ? sukuna.x + 120 : sukuna.x - 150, top: sukuna.y - 50, height: shrineHeight, opacity: 0.8, scale: "1.2" }} />
      */}

    </div>
  );
};

export default GameArea;
