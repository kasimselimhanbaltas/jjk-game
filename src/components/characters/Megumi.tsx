import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import megumiSlice from "../../store/character-slices/MegumiSlice";
import sukunaSlice from "../../store/character-slices/SukunaSlice";
import { setNueDirection } from "../../store/NueSlice";
import React from "react";

const Megumi = () => {
    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const [displaySlash, setDisplaySlash] = React.useState("none");
    const [displaySlash2, setDisplaySlash2] = React.useState("none");
    const [displayDismantle, setDisplayDismantle] = React.useState("block");
    const dispatch = useDispatch();
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "270deg" });
    const [slashRotation2, setSlashRotation2] = React.useState({ rotate: "270deg" });
    const intervalRef = useRef(null);
    const characterWidth = 120;
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
        if (sukuna.cleaveAttack) {
            setDisplaySlash("block")
            slashSoundEffectRef.current.volume = 0.1;
            slashSoundEffectRef.current.play()
        } else setDisplaySlash("none")
    }, [sukuna.cleaveAttack]);

    useEffect(() => {
        if (sukuna.dismantleAttack) {
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
        if (sukuna.rivalDomainExpansion && sukuna.health.currentHealth > 0) {
            domainAttack()
        }
    }, [sukuna.rivalDomainExpansion])

    // Sukuna domain attack function
    const domainAttack = () => {
        if (sukuna.health.currentHealth <= 0) return;
        setTimeout(() => {
            setDisplaySlash("block");
            setDisplaySlash2("block");
            let slashDamage = -25;
            let maxSlashCount = (megumi.health.currentHealth / Math.abs(slashDamage)) >= 50 ? 50 : (megumi.health.currentHealth / Math.abs(slashDamage));
            console.log("maxslash", maxSlashCount)
            const attackDirection = sukuna.x - megumi.x >= 0 ? "left" : "right";
            const stepDistance = attackDirection === "left" ? -10 : 10;
            const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
            domainSoundEffectRef.current.volume = 0.3
            domainSoundEffectRef.current.play()


            for (let i = 0; i < 50; i++) { // 50 random slashes -> rotate slash images, push megumi back and reduce health
                setTimeout(() => { // random slashes delay
                    setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    setSlashRotation2({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    dispatch(megumiSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
                    dispatch(megumiSlice.actions.updateHealth(slashDamage));
                    if (i >= maxSlashCount - 1) {
                        domainSoundEffectRef.current.pause()
                        domainSoundEffectRef.current.currentTime = 0; // İsterseniz başa sarabilirsiniz
                    }

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
                dispatch(megumiSlice.actions.updateHealth(-10));
                dispatch(megumiSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
            }, i * 100);
        }
        setTimeout(() => {
            setSlashRotation({ rotate: "270deg" });
        }, degrees.length * 3 * 100);
    };

    return (
        <>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/nue.mp3")} ref={nueSoundEffectRef}></audio>
            <div
                className="megumi"
                style={{
                    top: megumi.y, left: megumi.x, width: characterWidth, height: characterHeight,
                    display: megumi.health.currentHealth > 0 ? "block" : "none",
                }}
            >
                <img src={require('../../Assets/megumi.png')} alt="" style={{
                    transform: megumi.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
                }} />
                {gameSettings.selectedCharacter !== "megumi" && (
                    <>
                        <div className="megumi-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-16%" }}>
                            <div style={{ position: "absolute", width: megumi.health.currentHealth * 150 / megumi.health.maxHealth, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{megumi.health.currentHealth}</p>
                        </div>
                        <div className="megumi-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-2%" }}>
                            <div style={{ position: "absolute", width: megumi.cursedEnergy.currentCursedEnergy * 150 / megumi.cursedEnergy.maxCursedEnergy, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{megumi.cursedEnergy.currentCursedEnergy}</p>
                        </div>
                    </>
                )}
                <p style={{ marginTop: gameSettings.selectedCharacter === "megumi" ? -20 : -60, width: 250, marginLeft: -50, color: "black", fontSize: "20px" }}>Megumi Fushiguro</p>

                <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash, height: characterHeight, width: "200px", ...slashRotation, transform: "scale(0.7)" }} />
                <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash2, height: characterHeight, width: "200px", ...slashRotation2, transform: "scale(0.7)" }} />
                {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: sukuna.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
                {/* <img src={require('../../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: sukuna.isAttacking && Math.abs(sukuna.x - megumi.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "45deg", transform: "scale(0.1)" }} /> */}
                {/* DISMANTLE */}
                <div className="dismantle" style={{ display: sukuna.dismantleAttack ? "block" : "none" }}>
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-35px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-25px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-5px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "5px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "15px", left: "-30px", height: characterHeight, width: "200px", rotate: "45deg", transform: "scale(0.4)" }} />

                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-50px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-40px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-30px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-20px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "-10px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                    <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-10px", left: "0px", height: characterHeight, width: "200px", rotate: "-45deg", transform: "scale(0.4)" }} />
                </div>
            </div>
        </>
    );
};

export default Megumi;
