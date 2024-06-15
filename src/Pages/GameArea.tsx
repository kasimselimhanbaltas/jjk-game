import { useEffect, useMemo, useRef } from "react";
import Player from "../components/Player";
import Rival from "../components/Rival";
import Nue from "../components/Nue";
import { setCloseRange, updateRivalHealth, setRivalPosition, moveRival, setRivalCanMove } from "../store/RivalSlice";
import { changeCursedEnergy, movePlayer } from "../store/PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRivalDirection } from "../store/RivalSlice";

const playerWidth = 50;
const playerHeight = 180;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const playerSpeed = 30;

const GameArea = () => {

  const dispatch = useDispatch()
  const rival = useSelector((state: any) => state.RivalState);
  const player = useSelector((state: any) => state.PlayerState);
  const xDistance = useMemo(() => (player.x - rival.x), [player.x, rival.x]);
  const yDistance = useMemo(() => (player.y - rival.y), [player.y, rival.y]);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, t: false });
  let intervalId = null;
  const ceIncreaseIntervalRef = useRef(null);


  const startCursedEnergyInterval = () => {

    // Interval zaten çalışıyorsa başlatma
    console.log("increase ce")

    if (ceIncreaseIntervalRef.current !== null) return;

    ceIncreaseIntervalRef.current = setInterval(() => {

      if (player.cursedEnergy < 100) {
        console.log("increase ce")
        dispatch(changeCursedEnergy(+20));
      }
    }, 1000);
  };

  const stopInterval = (ref) => {
    // Interval çalışmıyorsa durdurma
    if (ref.current === null) return;

    clearInterval(ref.current);
    ref.current = null;
  };


  useEffect(() => {
    startCursedEnergyInterval()
    return () => {
      stopInterval(ceIncreaseIntervalRef);
    }
  }, [player.cursedEnergy]);
  // Player movement control
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      keysPressed.current[key] = true;
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      keysPressed.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    dispatch(setCloseRange(Math.abs(xDistance) < 200));
    // dispatch(setRivalDirection(xDistance < 0 ? "left" : "right"));

    clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (keysPressed.current.w && player.y > 0) {
        dispatch(movePlayer({ x: 0, y: -playerSpeed }));
      }
      if (keysPressed.current.a && player.x > 0) {
        dispatch(movePlayer({ x: -playerSpeed, y: 0 }));
      }
      if (keysPressed.current.s && player.y < gameAreaHeight - playerHeight) {
        dispatch(movePlayer({ x: 0, y: playerSpeed }));
      }
      if (keysPressed.current.d && player.x < gameAreaWidth - playerWidth) {
        dispatch(movePlayer({ x: playerSpeed, y: 0 }));
      }
      if (keysPressed.current.t) {
        if (rival.canMove) dispatch(setRivalCanMove(false));
        else dispatch(setRivalCanMove(true));
      }
    }, 75);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, player.health, player.y, player.x, rival.x]);

  // Rival movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (rival.canMove) {

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
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };

  }, [rival.rivalDirection, rival.canMove]);

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

  // useEffect(() => {
  //   if (xDistance < 0 && rival.rivalDirection !== "left") {
  //     dispatch(rivalDirection("left"));
  //   } else if (xDistance > 0 && rival.rivalDirection !== "right") {
  //     dispatch(rivalDirection("right"));
  //   }
  // }, [xDistance]);

  return (
    <div className="game-area">
      <Player xDistance={xDistance} />
      <h1>{rival.rivalDirection}
        <br /> {yDistance}
      </h1>
      <Nue />
      <Rival xDistance={xDistance} />
    </div>
  );
};

export default GameArea;
