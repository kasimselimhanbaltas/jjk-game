import { useEffect, useMemo, useRef } from "react";
import Player from "../components/Player";
import Rival from "../components/Rival";
import Nue from "../components/Nue";
import { setCloseRange, updateRivalHealth, setRivalPosition } from "../store/RivalSlice";
import { movePlayer } from "../store/PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { rivalDirection } from "../store/RivalSlice";

const playerWidth = 50;
const playerHeight = 180;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;

const GameArea = () => {

  const dispatch = useDispatch()
  const rival = useSelector((state: any) => state.RivalState);
  const player = useSelector((state: any) => state.PlayerState);
  const xDistance = useMemo(() => (player.x - rival.x), [player.x, rival.x]);
  const keysPressed = useRef({ w: false, a: false, s: false, d: false });
  let intervalId = null;

  // Player movement control effect
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

    // ???
    dispatch(setCloseRange(Math.abs(xDistance) < 200));
    dispatch(rivalDirection(xDistance < 0 ? "left" : "right"));

    clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (keysPressed.current.w && player.y > 0) {
        dispatch(movePlayer({ x: 0, y: -10 }));
      }
      if (keysPressed.current.a && player.x > 0) {
        dispatch(movePlayer({ x: -10, y: 0 }));
      }
      if (keysPressed.current.s && player.y < gameAreaHeight - playerHeight) {
        dispatch(movePlayer({ x: 0, y: 10 }));
      }
      if (keysPressed.current.d && player.x < gameAreaWidth - playerWidth) {
        dispatch(movePlayer({ x: 10, y: 0 }));
      }
      console.log("check DIRECTION")
      if (rival.x - player.x < 10) {
        dispatch(rivalDirection("right"));
      } else {
        dispatch(rivalDirection("left"));
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, player.health, player.y, player.x, rival.x]);

  // Rival movement
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaX = player.x - rival.x;
      const deltaY = player.y - rival.y;
      const stepX = deltaX !== 0 ? deltaX / Math.abs(deltaX) : 0;
      const stepY = deltaY !== 0 ? deltaY / Math.abs(deltaY) : 0;
      dispatch(setRivalPosition({ x: rival.x + stepX, y: rival.y + stepY }));
    }, 100); // Update interval

    return () => {
      clearInterval(interval);
    };
  }, [player, rival, dispatch]);


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
      <Nue />
      <Rival xDistance={xDistance} />
    </div>
  );
};

export default GameArea;
