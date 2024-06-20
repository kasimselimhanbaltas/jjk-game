import { useEffect, useMemo, useRef } from "react";
import Player from "../components/Player";
import Rival from "../components/Rival";
import Nue from "../components/Nue";
import { setCloseRange, updateRivalHealth, setRivalPosition, moveRival, setRivalCanMove, setDashGauge, moveRivalTo, setRivalCursedEnergy } from "../store/RivalSlice";
import { changeCursedEnergy, movePlayer, setPlayerDirection } from "../store/PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRivalDirection } from "../store/RivalSlice";
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
  const rival = useSelector((state: any) => state.RivalState);
  const player = useSelector((state: any) => state.PlayerState);
  const nue = useSelector((state: any) => state.NueState);
  const xDistance = useMemo(() => (player.x - rival.x), [player.x, rival.x]);
  const yDistance = useMemo(() => (player.y - rival.y), [player.y, rival.y]);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, t: false, space: false });
  let intervalId = null;
  const playerCEincreaseIntervalRef = useRef(null);
  const rivalCEincreaseIntervalRef = useRef(null);

  // Cursed energy interval functions
  const startCursedEnergyInterval = () => {
    if (playerCEincreaseIntervalRef.current === null) {
      playerCEincreaseIntervalRef.current = setInterval(() => {
        if (player.cursedEnergy < 100) {
          console.log("increase ce")
          dispatch(changeCursedEnergy(+10));
        }
      }, 1000);
    }
    if (rivalCEincreaseIntervalRef.current === null) {
      rivalCEincreaseIntervalRef.current = setInterval(() => {
        if (rival.cursedEnergy < 200 && rival.rivalDomainExpansion === false) {
          console.log("increase ce")
          dispatch(setRivalCursedEnergy(rival.cursedEnergy + 10));
        }
      }, 1000);
    }

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
    startCursedEnergyInterval()
    return () => {
      stopInterval(playerCEincreaseIntervalRef);
      stopInterval(rivalCEincreaseIntervalRef);
    }
  }, [player.cursedEnergy, rival.cursedEnergy, rival.rivalDomainExpansion, nueActivity]);

  // Player movement control
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
      if (player.canMove) {
        if (keysPressed.current.w && player.y > 0) {
          dispatch(movePlayer({ x: 0, y: -playerSpeed }));
        }
        if (keysPressed.current.a && player.x > 0) {
          dispatch(movePlayer({ x: -playerSpeed, y: 0 }));
          dispatch(setPlayerDirection("left"));
        }
        if (keysPressed.current.s && player.y < gameAreaHeight - playerHeight) {
          dispatch(movePlayer({ x: 0, y: playerSpeed }));
        }
        if (keysPressed.current.d && player.x < gameAreaWidth - playerWidth) {
          dispatch(movePlayer({ x: playerSpeed, y: 0 }));
          dispatch(setPlayerDirection("right"));
        }
        if (keysPressed.current.t) {
          if (rival.canMove) dispatch(setRivalCanMove(false));
          else dispatch(setRivalCanMove(true));
        }
        if (keysPressed.current.space)
          dispatch(movePlayer({ x: player.direction === "right" ? 200 : -200, y: 0 }));
      }
    }, 75);
    if (!nue.isAttacking) dispatch(setNueDirection(player.direction));

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, player.health, player.y, player.x, rival.x, player.canMove]);

  // Rival movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (rival.canMove) {
        if (rival.dashGauge > 70) {
          dispatch(moveRivalTo({ x: player.x, y: player.y }));
          dispatch(setDashGauge(0))
        }
        else {
          dispatch(setDashGauge(rival.dashGauge + 1))
          let stepX = 0;
          let stepY = 0;
          if (rival.rivalDirection === "R") [stepX, stepY] = [10, 0];
          else if (rival.rivalDirection === "L") [stepX, stepY] = [-10, 0];
          else if (rival.rivalDirection === "U") [stepX, stepY] = [0, -10];
          else if (rival.rivalDirection === "D") [stepX, stepY] = [0, 10];
          else if (rival.rivalDirection === "UL") [stepX, stepY] = [-10, -10];
          else if (rival.rivalDirection === "UR") [stepX, stepY] = [10, -10];
          else if (rival.rivalDirection === "DL") [stepX, stepY] = [-10, 10];
          else if (rival.rivalDirection === "DR") [stepX, stepY] = [10, 10];
          else if (rival.rivalDirection === "stop") [stepX, stepY] = [0, 0];
          dispatch(moveRival({ x: stepX, y: stepY }));
        }
      }
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [rival.rivalDirection, rival.canMove, rival.dashGauge]);

  // Rival Movement Control
  useEffect(() => {
    const interval = setInterval(() => {
      let direction = "";
      const deltaX = player.x - rival.x; // >0 is right, <0 is left
      const deltaY = player.y - rival.y; // >0 is up, <0 is down
      if (Math.abs(deltaX) <= 200 && Math.abs(deltaY) <= 80) { // Decide which direction rival should head to
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
      if (rival.rivalDirection !== direction) {
        dispatch(setRivalDirection(direction));
      }
    }, 100); // Update interval
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, player.x, player.y, rival.closeRange, rival.rivalDirection]);

  // Main menu
  const [showMenu, setShowMenu] = React.useState(false); // Menü durumunu tutan state

  const handleStartGame = () => {
    setShowMenu(false); // Start Game butonuna tıklandığında menüyü gizle
  };

  // useEffect(() => {
  //   if (xDistance < 0 && rival.rivalDirection !== "left") {
  //     dispatch(rivalDirection("left"));
  //   } else if (xDistance > 0 && rival.rivalDirection !== "right") {
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
            backgroundImage: `url(${require("../Assets/bg.jpg")})`, opacity: !rival.rivalDomainExpansion ? 0.7 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
          }}></div>
          <div style={{
            width: "100%", height: "100%", position: "absolute",
            backgroundImage: `url(${require("../Assets/sukuna-domain.jpg")})`, opacity: rival.rivalDomainExpansion ? 1 : 0,
            backgroundSize: "cover", backgroundPosition: "center", transition: "opacity 0.5s ease-in-out",
          }}></div>
          <Player />
          <Nue />
          <DivineDogs />
          <Rival />
        </>
      )}



      {/*
      <img src={require('../Assets/malevolent_shrine.png')} alt="" style={{ position: "absolute", display: rival.rivalDomainExpansion ? "block" : "none", left: player.x < rival.x ? rival.x + 120 : rival.x - 150, top: rival.y - 50, height: shrineHeight, opacity: 0.8, scale: "1.2" }} />
      */}

    </div>
  );
};

export default GameArea;
