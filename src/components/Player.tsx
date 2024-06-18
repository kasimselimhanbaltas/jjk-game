import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { healthReducer, movePlayer } from "../store/PlayerSlice";
import setDismantleAttack from "../store/RivalSlice";
import { setNueDirection } from "../store/NueSlice";
import React from "react";

const Player = ({ xDistance }) => {
    const player = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const [displaySlash, setDisplaySlash] = React.useState("none");
    const [displayDismantle, setDisplayDismantle] = React.useState("block");
    const dispatch = useDispatch();
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "270deg" });
    const [slashRotation2, setSlashRotation2] = React.useState({ rotate: "270deg" });
    const intervalRef = useRef(null);
    const characterWidth = 50;
    const characterHeight = 180;

    useEffect(() => {
        rival.cleaveAttack && Math.abs(rival.x - player.x) >= 200 ? setDisplaySlash("block") : setDisplaySlash("none")
    }, [rival.cleaveAttack]);

    useEffect(() => {
        if (rival.rapidAttack) {
            rapidAttack()
            setDisplaySlash("block");
            setTimeout(() => {
                setDisplaySlash("none")
            }, 1000);
        }
    }, [rival.rapidAttack])


    useEffect(() => {
        if (rival.rivalDomainExpansion) {
            domainAttack()
            setDisplaySlash("block");
            intervalRef.current = setTimeout(() => {
                setDisplaySlash("none")
            }, 5000);
        }
    }, [rival.rivalDomainExpansion])

    // Rival domain attack function
    const domainAttack = () => {
        const attackDirection = rival.x - player.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                setSlashRotation2({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                dispatch(movePlayer({ x: stepDistance, y: 0 }));
                dispatch(healthReducer(-10));
            }, i * 100);
        }
        setTimeout(() => {
            setSlashRotation({ rotate: "270deg" });
            setSlashRotation2({ rotate: "270deg" });
        }, degrees.length * 100);
    }

    const rapidAttack = () => {
        const attackDirection = rival.x - player.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        for (let i = 0; i < degrees.length; i++) {
            setTimeout(() => {
                setSlashRotation({ rotate: degrees[i] + "deg" });
                dispatch(healthReducer(-10));
                dispatch(movePlayer({ x: stepDistance, y: 0 }));
            }, i * 100);
        }
        setTimeout(() => {
            setSlashRotation({ rotate: "270deg" });
        }, degrees.length * 100);
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
            <img src={require('../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash, height: characterHeight, width: "200px", ...slashRotation2, transform: "scale(0.7)" }} />
            {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: rival.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
            {/* <img src={require('../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: rival.isAttacking && Math.abs(rival.x - player.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "45deg", transform: "scale(0.5)" }} /> */}
            {/* DISMANTLE */}
            <div style={{ display: rival.dismantleAttack ? "block" : "none" }}>
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-35px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-25px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-5px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "5px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "15px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />

                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-50px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-40px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-30px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-20px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-10px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-10px", left: "0px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
            </div>
        </div>
    );
};

export default Player;
