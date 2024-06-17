import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { healthReducer, movePlayer } from "../store/PlayerSlice";
import { setRivalDirection, setCloseRange } from "../store/RivalSlice";
import { setNueDirection } from "../store/NueSlice";
import React from "react";

const Player = ({ xDistance }) => {
    const player = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const [displaySlash, setDisplaySlash] = React.useState("none");
    const dispatch = useDispatch();
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "270deg" });

    const characterWidth = 50;
    const characterHeight = 180;

    useEffect(() => {
        rival.isAttacking && Math.abs(rival.x - player.x) >= 200 ? setDisplaySlash("block") : setDisplaySlash("none")
    }, [rival.isAttacking]);

    useEffect(() => {
        if (rival.rapidAttack) {
            rapidAttack()
            setDisplaySlash("block");
            setTimeout(() => {
                setDisplaySlash("none")
            }, 1000);
        }
    }, [rival.rapidAttack])

    const rapidAttack = () => {
        const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        for (let i = 0; i < degrees.length; i++) {
            setTimeout(() => {
                setSlashRotation({ rotate: degrees[i] + "deg" });
                dispatch(healthReducer(-10));
            }, i * 100);
        }
    };

    return (
        <div
            className="player"
            style={{
                top: player.y, left: player.x, width: characterWidth, height: characterHeight,
                display: player.health > 0 ? "block" : "none",
            }}
        >
            <img src={require('../Assets/megumi.png')} alt="" style={{
                transform: player.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
            }} />
            <div className="player-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-16%" }}>
                <div style={{ position: "absolute", width: player.health * 150 / 1000, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{player.health}</p>
            </div>
            <div className="player-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-2%" }}>
                <div style={{ position: "absolute", width: player.cursedEnergy * 150 / 100, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                </div>
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{player.cursedEnergy}</p>
            </div>

            <img src={require('../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash, height: characterHeight, width: "200px", ...slashRotation, transform: "scale(0.7)" }} />
            {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
            <img src={require('../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: rival.isAttacking && Math.abs(rival.x - player.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scale(0.5)" }} />
        </div>
    );
};

export default Player;
