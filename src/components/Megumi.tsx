import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { healthReducer, movePlayer } from "../store/MegumiSlice";
import setDismantleAttack, { moveRival } from "../store/SukunaSlice";
import { setNueDirection } from "../store/NueSlice";
import React from "react";

const Megumi = () => {
    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const [displaySlash, setDisplaySlash] = React.useState("none");
    const [displaySlash2, setDisplaySlash2] = React.useState("none");
    const [displayDismantle, setDisplayDismantle] = React.useState("block");
    const dispatch = useDispatch();
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "270deg" });
    const [slashRotation2, setSlashRotation2] = React.useState({ rotate: "270deg" });
    const intervalRef = useRef(null);
    const characterWidth = 50;
    const characterHeight = 180;


    // Sound effects
    const slashSoundEffectRef = React.useRef(null);
    const rapidSlashSoundEffectRef = React.useRef(null);
    const domainSoundEffectRef = React.useRef(null);
    const nueSoundEffectRef = React.useRef(null);
    // domainSoundEffectRef.current.volume = 0.1;
    // nueSoundEffectRef.current.volume = 0.1;

    // Slash style control
    useEffect(() => {
        if (sukuna.cleaveAttack && Math.abs(sukuna.x - megumi.x) >= 200) {
            setDisplaySlash("block")
            slashSoundEffectRef.current.volume = 0.1;
            slashSoundEffectRef.current.play()
        } else setDisplaySlash("none")
    }, [sukuna.cleaveAttack]);

    useEffect(() => {
        if (sukuna.dismantleAttack && Math.abs(sukuna.x - megumi.x) <= 200) {
            // setDisplayDismantle("block")
            slashSoundEffectRef.current.volume = 0.1;
            slashSoundEffectRef.current.play()
        }
        // else setDisplayDismantle("none")
    }, [sukuna.dismantleAttack]);

    useEffect(() => {
        if (sukuna.rapidAttack) {
            rapidAttack()
            setDisplaySlash("block");
            setTimeout(() => {
                setDisplaySlash("none")
            }, 3000);
        }
    }, [sukuna.rapidAttack])


    useEffect(() => {
        if (sukuna.rivalDomainExpansion && sukuna.health > 0) {
            domainAttack()
        }
    }, [sukuna.rivalDomainExpansion])

    // Sukuna domain attack function
    const domainAttack = () => {
        if (sukuna.health <= 0) return;
        setTimeout(() => {
            setDisplaySlash("block");
            setDisplaySlash2("block");

            const attackDirection = sukuna.x - megumi.x >= 0 ? "left" : "right";
            const stepDistance = attackDirection === "left" ? -10 : 10;
            const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
            domainSoundEffectRef.current.volume = 0.3
            domainSoundEffectRef.current.play()

            for (let i = 0; i < 50; i++) { // 50 random slashes -> rotate slash images, push megumi back and reduce health
                setTimeout(() => { // random slashes delay
                    setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    setSlashRotation2({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    dispatch(movePlayer({ x: stepDistance, y: 0 }));
                    dispatch(healthReducer(-25));
                }, i * 100);
            }
            setTimeout(() => {
                setSlashRotation({ rotate: "270deg" });
                setSlashRotation2({ rotate: "270deg" });
                setDisplaySlash("none");
                setDisplaySlash2("none");

            }, 4800);
        }, 1000);


    }

    const rapidAttack = () => {
        rapidSlashSoundEffectRef.current.volume = 0.1;

        rapidSlashSoundEffectRef.current.play()
        const attackDirection = sukuna.x - megumi.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        for (let i = 0; i < degrees.length * 3; i++) {
            setTimeout(() => {
                setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                dispatch(healthReducer(-10));
                dispatch(movePlayer({ x: stepDistance, y: 0 }));
            }, i * 100);
        }
        setTimeout(() => {
            setSlashRotation({ rotate: "270deg" });
        }, degrees.length * 3 * 100);
    };

    return (
        <>
            <audio src={require("../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../Assets/audios/nue.mp3")} ref={nueSoundEffectRef}></audio>
            <div
                className="megumi"
                style={{
                    top: megumi.y, left: megumi.x, width: characterWidth, height: characterHeight,
                    display: megumi.health > 0 ? "block" : "none",
                }}
            >
                <img src={require('../Assets/megumi.png')} alt="" style={{
                    transform: megumi.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
                }} />
                <div className="megumi-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-16%" }}>
                    <div style={{ position: "absolute", width: megumi.health * 150 / 2000, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                    </div>
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{megumi.health}</p>
                </div>
                <div className="megumi-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-2%" }}>
                    <div style={{ position: "absolute", width: megumi.cursedEnergy * 150 / 200, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                    </div>
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{megumi.cursedEnergy}</p>
                </div>
                <p style={{ marginTop: -60, width: 250, marginLeft: -50, color: "black", fontSize: "20px" }}>Fushiguro Megumi</p>

                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash, height: characterHeight, width: "200px", ...slashRotation, transform: "scale(0.7)" }} />
                <img src={require('../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash2, height: characterHeight, width: "200px", ...slashRotation2, transform: "scale(0.7)" }} />
                {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: sukuna.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
                {/* <img src={require('../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: sukuna.isAttacking && Math.abs(sukuna.x - megumi.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "45deg", transform: "scale(0.1)" }} /> */}
                {/* DISMANTLE */}
                <div style={{ display: sukuna.dismantleAttack ? "block" : "none" }}>
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
        </>
    );
};

export default Megumi;
