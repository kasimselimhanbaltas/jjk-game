import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { movePlayer } from "../store/PlayerSlice";
import { rivalDirection, setCloseRange } from "../store/RivalSlice";

const Player = ({ xDistance }) => {
    const player = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const dispatch = useDispatch();

    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;
    const characterWidth = 50;
    const characterHeight = 180;


    return (
        <div
            className="player"
            style={{
                top: player.y, left: player.x, width: characterWidth, height: characterHeight,
                display: player.health > 0 ? "block" : "none",
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
                transform: player.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
            }} />
            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-2%" }}>
                <div style={{ position: "absolute", width: player.health * 150 / 1000, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -120%)", fontSize: "15px" }}>{player.health}</p>
            </div>

            <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking && Math.abs(rival.x - player.x) >= 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg" }} />
            {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
            <img src="dismantle.png" alt="" style={{ top: "-15px", left: "-30px", display: rival.isAttacking && Math.abs(rival.x - player.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "225deg", transform: "scale(0.5)" }} />

        </div>
    );
};

export default Player;
