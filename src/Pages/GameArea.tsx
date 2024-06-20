import { useEffect, useMemo, useRef } from "react";
import Megumi from "../components/Megumi";
import Sukuna from "../components/Sukuna";
import Nue from "../components/Nue";
import { setCloseRange, updateRivalHealth, setRivalPosition, moveRival, setRivalCanMove, setDashGauge, moveRivalTo, setRivalCursedEnergy } from "../store/SukunaSlice";
import { changeCursedEnergy, movePlayer, setPlayerDirection } from "../store/MegumiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRivalDirection } from "../store/SukunaSlice";
import { nueActivity, setNueDirection } from "../store/NueSlice";
import DivineDogs from "../components/DivineDogs";
import MainMenu from "../components/MainMenu";
import React from "react";

const playerWidth = 50;
const playerHeight = 180;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const playerSpeed = 30;
const shrineHeight = 250;

const GameArea = () => {

  const dispatch = useDispatch()
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

  // Cursed energy interval functions
  const startPlayerCursedEnergyInterval = () => {
    if (playerCEincreaseIntervalRef.current !== null) return;
    playerCEincreaseIntervalRef.current = setInterval(() => {
      if (megumi.cursedEnergy < 100) {
        dispatch(changeCursedEnergy(+10));
      }
    }, 1000);
  };
  const startRivalCursedEnergyInterval = () => {
    if (rivalCEincreaseIntervalRef.current !== null) return;
    rivalCEincreaseIntervalRef.current = setInterval(() => {
      if (sukuna.cursedEnergy < 200 && sukuna.rivalDomainExpansion === false) {
        dispatch(setRivalCursedEnergy(sukuna.cursedEnergy + 10));
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
  }, [megumi.cursedEnergy, nueActivity]);

  useEffect(() => {
    startRivalCursedEnergyInterval()
    return () => {
      stopInterval(rivalCEincreaseIntervalRef);
    }
  }, [sukuna.cursedEnergy, sukuna.rivalDomainExpansion]);

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

    dispatch(setCloseRange(Math.abs(xDistance) < 200));

    clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (megumi.canMove) {
        if (keysPressed.current.w && megumi.y > 0) {
          dispatch(movePlayer({ x: 0, y: -playerSpeed }));
        }
        if (keysPressed.current.a && megumi.x > 0) {
          dispatch(movePlayer({ x: -playerSpeed, y: 0 }));
          dispatch(setPlayerDirection("left"));
        }
        if (keysPressed.current.s && megumi.y < gameAreaHeight - playerHeight) {
          dispatch(movePlayer({ x: 0, y: playerSpeed }));
        }
        if (keysPressed.current.d && megumi.x < gameAreaWidth - playerWidth) {
          dispatch(movePlayer({ x: playerSpeed, y: 0 }));
          dispatch(setPlayerDirection("right"));
        }
        if (keysPressed.current.t) {
          if (sukuna.canMove) dispatch(setRivalCanMove(false));
          else dispatch(setRivalCanMove(true));
        }
        if (keysPressed.current.space)
          dispatch(movePlayer({ x: megumi.direction === "right" ? 200 : -200, y: 0 }));
      }
    }, 75);
    if (!nue.isAttacking) dispatch(setNueDirection(megumi.direction));

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, megumi.health, megumi.y, megumi.x, sukuna.x, megumi.canMove]);

  // Sukuna movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (sukuna.canMove) {
        if (sukuna.dashGauge > 70) {
          dispatch(moveRivalTo({ x: megumi.x, y: megumi.y }));
          dispatch(setDashGauge(0))
        }
        else {
          dispatch(setDashGauge(sukuna.dashGauge + 1))
          let stepX = 0;
          let stepY = 0;
          if (sukuna.rivalDirection === "R") [stepX, stepY] = [10, 0];
          else if (sukuna.rivalDirection === "L") [stepX, stepY] = [-10, 0];
          else if (sukuna.rivalDirection === "U") [stepX, stepY] = [0, -10];
          else if (sukuna.rivalDirection === "D") [stepX, stepY] = [0, 10];
          else if (sukuna.rivalDirection === "UL") [stepX, stepY] = [-10, -10];
          else if (sukuna.rivalDirection === "UR") [stepX, stepY] = [10, -10];
          else if (sukuna.rivalDirection === "DL") [stepX, stepY] = [-10, 10];
          else if (sukuna.rivalDirection === "DR") [stepX, stepY] = [10, 10];
          else if (sukuna.rivalDirection === "stop") [stepX, stepY] = [0, 0];
          dispatch(moveRival({ x: stepX, y: stepY }));
        }
      }
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [sukuna.rivalDirection, sukuna.canMove, sukuna.dashGauge]);

  // Sukuna Movement Control
  useEffect(() => {
    const interval = setInterval(() => {
      let direction = "";
      const deltaX = megumi.x - sukuna.x; // >0 is right, <0 is left
      const deltaY = megumi.y - sukuna.y; // >0 is up, <0 is down
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
      if (sukuna.rivalDirection !== direction) {
        dispatch(setRivalDirection(direction));
      }
    }, 100); // Update interval
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, megumi.x, megumi.y, sukuna.closeRange, sukuna.rivalDirection]);

  // Main menu
  const [showMenu, setShowMenu] = React.useState(true); // Menü durumunu tutan state

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
          <Sukuna />

        </>
      )}



      {/*
      <img src={require('../Assets/malevolent_shrine.png')} alt="" style={{ position: "absolute", display: sukuna.rivalDomainExpansion ? "block" : "none", left: megumi.x < sukuna.x ? sukuna.x + 120 : sukuna.x - 150, top: sukuna.y - 50, height: shrineHeight, opacity: 0.8, scale: "1.2" }} />
      */}

    </div>
  );
};

export default GameArea;
