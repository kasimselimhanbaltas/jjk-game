import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerState from "../store/GlobalStore";
import { move } from "../store/PlayerSlice";
import { nueActivity } from "../store/NueSlice";

const Player = () => {
    const { x, y, direction, health } = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const dispatch = useDispatch();
    const keysPressed = useRef({ w: false, a: false, s: false, d: false });

    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;
    const characterWidth = 50;
    const characterHeight = 180;

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

        const intervalId = setInterval(() => {
            if (keysPressed.current.w && y > 0) {
                dispatch(move({ x: 0, y: -10 }));
            }
            if (keysPressed.current.a && x > 0) {
                dispatch(move({ x: -10, y: 0 }));
            }
            if (keysPressed.current.s && y < gameAreaHeight - characterHeight) {
                dispatch(move({ x: 0, y: 10 }));
            }
            if (keysPressed.current.d && x < gameAreaWidth - characterWidth) {
                dispatch(move({ x: 10, y: 0 }));
            }
        }, 50);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, health]);

    return (
        <div
            className="player"
            style={{
                top: y, left: x, width: characterWidth, height: characterHeight,
                display: health > 0 ? "block" : "none",
            }}
        >
            {/* <h3>X: {x}</h3>
            <h3>Y: {y}</h3>
            <h3>
                {keysPressed.current.w ? "w" : ""}
                {keysPressed.current.a ? "a" : ""}
                {keysPressed.current.s ? "s" : ""}
                {keysPressed.current.d ? "d" : ""}{direction}
            </h3> */}
            <img src="megumi.png" alt="" style={{
                transform: direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
            }} />
            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-2%" }}>
                <div style={{ position: "absolute", width: health * 150 / 100, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -120%)", fontSize: "15px" }}>{health}</p>
            </div>

            <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg" }} />
            <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} />

        </div>
    );
};

export default Player;
