import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import megumiSlice from "../../redux/character-slices/MegumiSlice";
import sukunaSlice from "../../redux/character-slices/SukunaSlice";
import nueSlice, { setNueDirection } from "../../redux/NueSlice";
import React from "react";
import divineDogsSlice from "../../redux/DivineDogsSlice";

const Megumi = ({ rivalState, rivalSlice }) => {
    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const nue = useSelector((state: any) => state.NueState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const [displaySlash, setDisplaySlash] = React.useState("block");
    const [displaySlash2, setDisplaySlash2] = React.useState("none");
    const [displayDismantle, setDisplayDismantle] = React.useState("block");
    const dispatch = useDispatch();
    const intervalRef = useRef(null);
    const characterWidth = 120;
    const characterHeight = 180;
    const gameAreaHeight = 600;

    // Sound effects
    const slashSoundEffectRef = React.useRef(null);
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
            setTimeout(() => {

                slashSoundEffectRef.current.volume = 0.1;
                slashSoundEffectRef.current.play()
            }, 400);
        }
        // else setDisplayDismantle("none")
    }, [sukuna.dismantleAttack]);

    const attackInterval = React.useRef(null);

    // const handleBlueAttack = () => {
    //     if (gojo.blueCD.isReady) {
    //         dispatch(gojoSlice.actions.changeCursedEnergy(blueCost));
    //         dispatch2(toggleBlueCD());
    //         blueAttack();
    //     }
    // }
    // const handleRedAttack = () => {
    //     if (gojo.redCD.isReady) {
    //         dispatch(gojoSlice.actions.changeCursedEnergy(redCost));
    //         dispatch2(toggleRedCD());
    //         redAttack();
    //     }
    // }
    // const handlePurpleAttack = () => {
    //     if (gojo.purpleCD.isReady) {
    //         dispatch(gojoSlice.actions.setCanMove(false));
    //         dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
    //         dispatch2(togglePurpleCD());
    //         purpleAttack();
    //         setTimeout(() => {
    //             dispatch(gojoSlice.actions.setCanMove(true));
    //         }, 15000);
    //     }
    // }

    const handleCallNue = () => {
        console.log("callnue")
        dispatch(nueSlice.actions.setNueAuto(true))
    }
    const handleNueAttack = () => {
        console.log("nueAttack")
        dispatch(nueSlice.actions.setNueAutoAttack(true))

        setTimeout(() => {
            dispatch(nueSlice.actions.setNueAutoAttack(false))
        }, 1000);
    }
    const handleDivineDogsAttack = () => {
        dispatch(divineDogsSlice.actions.setWolfAuto(true))
        setTimeout(() => {
            dispatch(divineDogsSlice.actions.setWolfAuto(false))
        }, 1000);
    }

    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = megumi.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        dispatch(megumiSlice.actions.setDirection(attackDirection))
        const randomInterval = 1000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        console.log("attack interval before")
        attackInterval.current = setInterval(() => {
            console.log("attack interval")
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && megumi.health.currentHealth > 0 && megumi.canMove && !sukuna.domainAttack) {
                const attackDirection = megumi.x - rivalState.x >= 0 ? "left" : "right";
                // const stepDistance = attackDirection === "left" ? -100 : 100;
                console.log("gojo ce: ", megumi.cursedEnergy.currentCursedEnergy)
                if (megumi.cursedEnergy.currentCursedEnergy >= 20 && megumi.divineDogsCD.isReady)
                    handleDivineDogsAttack();
                else if (nue.isActive && megumi.cursedEnergy.currentCursedEnergy >= 20 && megumi.nueAttackCD.isReady)
                    handleNueAttack();
                else if (megumi.cursedEnergy.currentCursedEnergy >= 100 && megumi.callNueCD.isReady && !nue.isActive)
                    handleCallNue();

            } else {
                stopAttackInterval(); // Megumi ölünce saldırıyı durdur
            }
        }, randomInterval);
    };
    const stopAttackInterval = () => {
        clearInterval(attackInterval.current);
    };

    useEffect(() => {
        if (megumi.health.currentHealth <= 0 && gameSettings.selectedCharacter !== "megumi")
            stopAttackInterval();
    }, [megumi.health.currentHealth >= 0]);

    // MEGUMI AUTO ATTACK
    useEffect(() => {
        if (megumi.health.currentHealth > 0 && rivalState.health.currentHealth > 0
            && megumi.canMove && gameSettings.selectedCharacter !== "megumi") {

            if (megumi.cursedEnergy.currentCursedEnergy >= 0) {
                startAttackInterval();
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, megumi.closeRange, megumi.direction, megumi.canMove,
        megumi.health.currentHealth, megumi.callNueCD.isReady, megumi.nueAttackCD.isReady, megumi.divineDogsCD.isReady,
        // megumi.domainCD.isReady,
        rivalState.health.currentHealth, megumi.health.currentHealth, rivalState.domainAttack]);

    const [megumiStyle, setMegumiStyle] = React.useState({
        animation: "stance 1s steps(1) infinite",
    });

    const keysPressed = useRef({ u: false, });

    // Megumi keyboard control
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
            if (gameSettings.selectedCharacter !== "megumi") return;
            if (rivalState.health.currentHealth > 0) {
                if (keysPressed.current.u && megumi.canMove) {
                    console.log("")
                    dispatch(megumiSlice.actions.setAnimationState("callMahoraga"))
                    dispatch(megumiSlice.actions.setCanMove(false))

                    setTimeout(() => {
                        dispatch(megumiSlice.actions.setAnimationState("stance"))
                        dispatch(megumiSlice.actions.setCanMove(true))

                    }, 2000);
                }
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, megumi.animationState, megumi.cursedEnergy]);

    const [mahoragaStyle, setMahoragaStyle] = React.useState({
        opacity: 0, animation: "stance 1s steps(1) infinite", bottom: gameAreaHeight - megumi.y, left: megumi.x
    });

    useEffect(() => {
        if (megumi.animationState === "stance") {
            setMegumiStyle({
                animation: "stance 1s steps(1) infinite",
            })
        }
        else if (megumi.animationState === "move") {
            setMegumiStyle({
                animation: "move .5s steps(1) infinite",
            })
        }
        else if (megumi.animationState === "jump") {
            setMegumiStyle({
                animation: "jump 1.5s steps(1)",
            })
            setTimeout(() => {
                dispatch(megumiSlice.actions.setAnimationState("stance"))
            }, 1500);
        }
        else if (megumi.animationState === "punch") {
            setMegumiStyle({
                animation: "punch .9s steps(8)",
            })
        }
        else if (megumi.animationState === "swordAttack") {
            setMegumiStyle({
                animation: "swordAttack 1s steps(14)",
            })
        }
        else if (megumi.animationState === "takeDamage") {
            dispatch(megumiSlice.actions.setTransition("all 1s ease, transform 0s"));
            setMegumiStyle({
                animation: "takeDamage 1s steps(1)",
            })
            dispatch(megumiSlice.actions.setAnimationBlocker(true))
            setTimeout(() => {
                dispatch(megumiSlice.actions.setAnimationBlocker(false))
                dispatch(megumiSlice.actions.setAnimationState("stance"))
                dispatch(megumiSlice.actions.setTransition("all .2s ease, transform 0s"));

            }, 1000);
        }
        else if (megumi.animationState === "callDivineDogs") {
            setMegumiStyle({
                animation: "call-divine-dogs 1s steps(1)",
            })
        }
        else if (megumi.animationState === "callNue") {
            setMegumiStyle({
                animation: "call-nue 1s steps(1)",
            })
        }
        else if (megumi.animationState === "callMahoraga") {
            setMegumiStyle({
                animation: "call-mahoraga 2s steps(1)",
            })
            setTimeout(() => {
                setMahoragaStyle({
                    opacity: 1,
                    animation: "mahoraga-stance 1s steps(1) infinite",
                    bottom: gameAreaHeight - megumi.y + 50,
                    left: megumi.x + 100,
                })
            }, 1000);

            setTimeout(() => {
                setMahoragaStyle(prevStyle => ({ ...prevStyle, opacity: 1 }));
            }, 2000);
        }

    }, [megumi.animationState]);

    return (
        <>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/nue.mp3")} ref={nueSoundEffectRef}></audio>


            <div className="mahoraga" style={{
                animation: mahoragaStyle.animation,
                opacity: mahoragaStyle.opacity,
                top: gameAreaHeight - mahoragaStyle.bottom, left: mahoragaStyle.left,
            }}>
                <div className="wheel" style={{
                    top: "-20px", left: "50%"
                }}></div>
            </div>
            <div className="megumi-container" style={{
                bottom: gameAreaHeight - megumi.y, left: megumi.x,
                animation: megumiStyle.animation,
                // animation: "takeDamage step(1) infinite",
                transform: megumi.direction === "left" ? "scaleX(-1)" : "none",
                display: megumi.health.currentHealth > 0 ? "block" : "none",
                transition: megumi.transition
            }}></div>
            <div
                className="megumi"
                style={{
                    bottom: gameAreaHeight - megumi.y, left: megumi.x,

                    display: megumi.health.currentHealth > 0 ? "block" : "none",
                }}
            >

                {/* {megumi.animationState} */}
                {/* <div className="megumi-container" style={{
                    animation: megumiStyle.animation,
                    // animation: "takeDamage step(1) infinite",
                    // transform: megumi.direction === "left" ? "scaleX(-1)" : "none",
                }}></div> */}
                {/* <img src={require('../../Assets/megumi.png')} alt="" style={{
                    transform: megumi.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
                }} /> */}
                {/* {gameSettings.selectedCharacter !== "megumi" && (
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
                )} */}

                {/* <img src={require('../../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-85px", left: "-55px", display: displaySlash, height: "120px", width: "120px", ...slashRotation, transform: "scale(0.7)" }} /> */}
                {/* <img src={require('../../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-85px", left: "-55px", display: displaySlash2, height: "120px", width: "120px", ...slashRotation2, transform: "scale(0.7)" }} /> */}

                {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: sukuna.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
                {/* <img src={require('../../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: sukuna.isAttacking && Math.abs(sukuna.x - megumi.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "45deg", transform: "scale(0.1)" }} /> */}
                {/* DISMANTLE */}
                {/* <div className="dismantle" style={{ display: sukuna.dismantleAttack ? "block" : "none" }}>
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
                </div> */}
            </div>
        </>
    );
};

export default Megumi;
