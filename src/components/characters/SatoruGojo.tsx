import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gojoSlice, { toggleBlueCD, togglePurpleCD, toggleRedCD } from "../../store/character-slices/GojoSlice";
import sukunaSlice from "../../store/character-slices/SukunaSlice";
import { setNueDirection } from "../../store/NueSlice";
import React from "react";
import { AppDispatch } from "../../store/GlobalStore";

const Gojo = ({ rivalState, rivalSlice }) => {

    const gojo = useSelector((state: any) => state.GojoState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);


    const [displaySlash, setDisplaySlash] = React.useState("none");
    const [displaySlash2, setDisplaySlash2] = React.useState("none");
    const [displayDismantle, setDisplayDismantle] = React.useState("block");
    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "270deg" });
    const [slashRotation2, setSlashRotation2] = React.useState({ rotate: "270deg" });
    const intervalRef = useRef(null);
    const characterWidth = 120;
    const characterHeight = 180;
    const keysPressed = useRef({ j: false, k: false, l: false, u: false });

    const blueCost = -50;
    const redCost = -100;
    const purpleCost = -150;
    const domainCost = -200;
    const blueDamage = -150;
    const domainDamage = -1000;
    // Sound effects
    const slashSoundEffectRef = React.useRef(null);
    const rapidSlashSoundEffectRef = React.useRef(null);
    const domainSoundEffectRef = React.useRef(null);
    const blueSoundEffectRef = React.useRef(null);
    const redSoundEffectRef = React.useRef(null);
    const purpleSoundEffectRef = React.useRef(null);
    const shortPurpleSoundEffectRef = React.useRef(null);

    // domainSoundEffectRef.current.volume = 0.1;
    // nueSoundEffectRef.current.volume = 0.1;

    // Slash style control
    useEffect(() => { //take cleave attack
        if (sukuna.cleaveAttack) {
            setDisplaySlash("block")
            slashSoundEffectRef.current.volume = 0.1;
            slashSoundEffectRef.current.play()
        } else setDisplaySlash("none")
    }, [sukuna.cleaveAttack]);

    useEffect(() => { // take dismantle attack
        if (sukuna.dismantleAttack) {
            // setDisplayDismantle("block")
            slashSoundEffectRef.current.volume = 0.1;
            slashSoundEffectRef.current.play()
        }
        // else setDisplayDismantle("none")
    }, [sukuna.dismantleAttack]);

    useEffect(() => { // take rapid attack
        if (sukuna.rapidAttack) {
            rapidAttack()
            setDisplaySlash("block");
            setTimeout(() => {
                setDisplaySlash("none")
            }, 3000);
        }
    }, [sukuna.rapidAttack])

    useEffect(() => { // take domain attack
        if (sukuna.rivalDomainExpansion && sukuna.health.currentHealth > 0) {
            domainAttack()
        }
    }, [sukuna.rivalDomainExpansion])

    // Sukuna attacks animations
    const domainAttack = () => {
        if (sukuna.health.currentHealth <= 0) return;
        setTimeout(() => {
            setDisplaySlash("block");
            setDisplaySlash2("block");
            let slashDamage = -25;
            let maxSlashCount = (gojo.health.currentHealth / Math.abs(slashDamage)) >= 50 ? 50 : (gojo.health.currentHealth / Math.abs(slashDamage));
            console.log("maxslash", maxSlashCount)
            const attackDirection = sukuna.x - gojo.x >= 0 ? "left" : "right";
            const stepDistance = attackDirection === "left" ? -10 : 10;
            const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
            domainSoundEffectRef.current.volume = 0.3
            domainSoundEffectRef.current.play()


            for (let i = 0; i < 50; i++) { // 50 random slashes -> rotate slash images, push gojo back and reduce health
                setTimeout(() => { // random slashes delay
                    setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    setSlashRotation2({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                    dispatch(gojoSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
                    dispatch(gojoSlice.actions.updateHealth(slashDamage));
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
        const attackDirection = sukuna.x - gojo.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        for (let i = 0; i < degrees.length * 3; i++) {
            setTimeout(() => {
                setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
                dispatch(gojoSlice.actions.updateHealth(-10));
                dispatch(gojoSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
            }, i * 100);
        }
        setTimeout(() => {
            setSlashRotation({ rotate: "270deg" });
        }, degrees.length * 3 * 100);
    };

    const [gojoImage, setGojoImage] = useState(require("../../Assets/gojo.png"));
    const [bluePositionState, setBluePositionState] = useState({
        x: 0, y: 0, scale: 0.3, visibility: "hidden", attacking: false,
        transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
    });
    const [redPositionState, setRedPositionState] = useState({
        x: 0, scale: 0.2, visibility: "hidden", attacking: false,
        transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
    });
    const [purplePositionState, setPurplePositionState] = useState({
        x: 0, scale: 0.2, visibility: "visible", visibilityP: "hidden", scaleR: 0, scaleB: 0, scaleP: 8,
        attacking: false, redY: 350, blueY: -350,
        transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
    });

    const [blueAngle, setBlueAngle] = useState(0);
    const [redAngle, setRedAngle] = useState(0);

    const blueAttack = useCallback(() => {
        blueSoundEffectRef.current.volume = 0.5;
        blueSoundEffectRef.current.play();
        setBluePositionState(prevState => ({
            ...prevState,
            x: gojo.x, y: gojo.y, visibility: "visible", attacking: true, transition: "all .2s ease, transform 4s, top 2s ease, left 2s ease"
        }))
        let inc = 5;
        const interval = setInterval(() => { // start rotating
            setBlueAngle(prevAngle => prevAngle + inc);
            inc++;
        }, 35);
        setBluePositionState(prevState => ({ ...prevState, scale: 1 }))
        setTimeout(() => {
            setGojoImage(require("../../Assets/gojo-attack.png"));
            setBluePositionState(prevState => ({ ...prevState, x: gojo.x + bluePosition().x, y: gojo.y + bluePosition().y, scale: 1 }))
            setTimeout(() => {
                setGojoImage(require("../../Assets/gojo.png"));
            }, 1000);
            setTimeout(() => {
                dispatch(rivalSlice.actions.setCanMove(false))
                setTimeout(() => {

                }, 1000);
                dispatch(rivalSlice.actions.moveCharacterTo({ x: gojo.x + bluePosition().x, y: gojo.y + bluePosition().y }))
                setTimeout(() => {
                    const damageInterval = setInterval(() => {
                        dispatch(rivalSlice.actions.updateHealth(blueDamage / 4))
                    }, 100)
                    setTimeout(() => {
                        dispatch(rivalSlice.actions.setCanMove(true))
                        clearInterval(damageInterval);
                    }, 400);
                    setTimeout(() => {
                        setBluePositionState(prevState => ({
                            ...prevState, visibility: "hidden"
                        }))
                        setTimeout(() => {
                            setBluePositionState({
                                x: gojo.x, y: gojo.y, scale: 0.3, visibility: "hidden", attacking: false,
                                transition: "all .2s ease, transform 4s, top 0s, left 0s"
                            })
                        }, 400);
                        clearInterval(interval); // Temizleme
                    }, 600);
                }, 500);
            }, 1000);
        }, 1000)
    }, [gojo.x, gojo.y])

    const redAttack = () => {
        redSoundEffectRef.current.volume = 0.5;
        redSoundEffectRef.current.play();
        setRedPositionState(prevState => ({
            ...prevState,
            visibility: "visible", transition: "all .2s ease, transform 4s, top .1s ease-in, left .1s ease-in"
        }))
        let inc = 5;
        const interval = setInterval(() => { // start rotating
            setRedAngle(prevAngle => prevAngle + inc);
            inc++;
        }, 35);
        // setRedPositionState(prevState => ({ ...prevState, }))
        setTimeout(() => { // 4sec
            setGojoImage(require("../../Assets/gojo-attack.png"));
            setRedPositionState(prevState => ({
                ...prevState, x: gojo.direction === "left" ? gojo.x - 200 : gojo.x + 250,
                y: rivalState.y, attacking: true
            }))
            setTimeout(() => {
                dispatch(gojoSlice.actions.setRedAttackMoment(true)) // handle skillshot damage in gamearea
                setRedPositionState(prevState => ({
                    ...prevState, visibility: "hidden"
                }))
                setTimeout(() => {
                    setRedPositionState(prevState => ({
                        ...prevState, x: gojo.x, attacking: false,
                        transition: "all .2s ease, transform 4s, top 0s, left 0s",
                    }))
                    dispatch(gojoSlice.actions.setRedAttackMoment(false))
                    setGojoImage(require("../../Assets/gojo.png"));
                }, 300);
                clearInterval(interval); // Dönme intervali temizleme
            }, 100);
        }, 2300)
    }

    // const purpleAttack = () => {
    //     purpleSoundEffectRef.current.volume = 0.5;
    //     purpleSoundEffectRef.current.play();
    //     dispatch(rivalSlice.actions.setCanMove(false))
    //     setTimeout(() => {
    //         setPurplePositionState(prevState => ({
    //             ...prevState, scaleB: 3, transition: "left .1s ease-in, top .1s ease-in"
    //         }))
    //         setTimeout(() => {
    //             setPurplePositionState(prevState => ({
    //                 ...prevState, scaleR: 3,
    //             }))
    //             setTimeout(() => {
    //                 let inc = 20;
    //                 const interval1 = setInterval(() => { // start rotating
    //                     setRedAngle(prevAngle => prevAngle + inc);
    //                     inc++;
    //                 }, 10);
    //                 const interval2 = setInterval(() => { // start rotating
    //                     setBlueAngle(prevAngle => prevAngle - inc);
    //                     inc--;
    //                 }, 35);
    //                 setPurplePositionState(prevState => ({
    //                     ...prevState, redY: 150, blueY: -150
    //                 }))
    //                 setTimeout(() => {
    //                     setPurplePositionState(prevState => ({
    //                         ...prevState, visibilityP: "visible", scaleP: 12
    //                     }))
    //                     setTimeout(() => {
    //                         setPurplePositionState(prevState => ({
    //                             ...prevState, scaleR: 0, scaleB: 0
    //                         }))
    //                         clearInterval(interval1); // Dönme intervali temizleme
    //                         clearInterval(interval2); // Dönme intervali temizleme
    //                     }, 1000);
    //                     setTimeout(() => {
    //                         setGojoImage(require("../../Assets/gojo-attack.png"));
    //                         setPurplePositionState(prevState => ({
    //                             ...prevState, attacking: true, transition: "left 1s ease-in, top .1s ease-in"
    //                         }))
    //                         setTimeout(() => {
    //                             dispatch(gojoSlice.actions.setPurpleAttackMoment(true)) // handle skillshot damage in gamearea
    //                             setTimeout(() => {
    //                                 setGojoImage(require("../../Assets/gojo.png"));
    //                                 dispatch(gojoSlice.actions.setPurpleAttackMoment(false))
    //                                 setPurplePositionState({
    //                                     x: 0, scale: 0.2, visibility: "visible", visibilityP: "hidden", scaleR: 0, scaleB: 0, scaleP: 8,
    //                                     attacking: false, redY: 350, blueY: -350,
    //                                     transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
    //                                 })
    //                                 dispatch(rivalSlice.actions.setCanMove(true))
    //                             }, 2000);
    //                         }, 500);
    //                     }, 4200);
    //                 }, 4000);
    //             }, 1000);
    //         }, 2500);
    //     }, 2100);

    // }

    const purpleAttack = () => {
        shortPurpleSoundEffectRef.current.volume = 0.5;
        shortPurpleSoundEffectRef.current.play();
        dispatch(rivalSlice.actions.setCanMove(false))
        setPurplePositionState(prevState => ({
            ...prevState, scaleB: 3, scaleR: 3, transition: "left .1s ease-in, top .1s ease-in"
        }))

        let inc = 20;
        const interval1 = setInterval(() => { // start rotating
            setRedAngle(prevAngle => prevAngle + inc);
            inc++;
        }, 10);
        const interval2 = setInterval(() => { // start rotating
            setBlueAngle(prevAngle => prevAngle - inc);
            inc--;
        }, 35);

        setPurplePositionState(prevState => ({
            ...prevState, redY: 150, blueY: -150
        }))
        setTimeout(() => {
            setPurplePositionState(prevState => ({
                ...prevState, visibilityP: "visible", scaleP: 12
            }))
            setTimeout(() => {
                setPurplePositionState(prevState => ({
                    ...prevState, scaleR: 0, scaleB: 0
                }))
                clearInterval(interval1); // Dönme intervali temizleme
                clearInterval(interval2); // Dönme intervali temizleme
            }, 1000);
            setTimeout(() => {
                setGojoImage(require("../../Assets/gojo-attack.png"));
                setPurplePositionState(prevState => ({
                    ...prevState, attacking: true, transition: "left 1s ease-in, top .1s ease-in"
                }))
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setPurpleAttackMoment(true)) // handle skillshot damage in gamearea
                    setTimeout(() => {
                        setGojoImage(require("../../Assets/gojo.png"));
                        dispatch(gojoSlice.actions.setPurpleAttackMoment(false))
                        setPurplePositionState({
                            x: 0, scale: 0.2, visibility: "visible", visibilityP: "hidden", scaleR: 0, scaleB: 0, scaleP: 8,
                            attacking: false, redY: 350, blueY: -350,
                            transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
                        })
                        dispatch(rivalSlice.actions.setCanMove(true))
                    }, 500);
                }, 200);
            }, 1000);
        }, 1000);

    }

    const bluePosition = useCallback(() => {
        return { x: gojo.direction === "right" ? 250 : -200, y: 0 }
    }, [gojo.x, gojo.y])

    // GOJO KEYBOARD CONTROL
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
            if (gameSettings.selectedCharacter !== "gojo") return;
            if (keysPressed.current.j && !sukuna.domainAttack && gojo.blueCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -blueCost && !sukuna.domainAttack
                ) {
                    handleBlueAttack();
                }
            }
            if (keysPressed.current.k && !sukuna.domainAttack && gojo.redCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -redCost && !sukuna.domainAttack
                ) {
                    handleRedAttack();
                }
            }
            if (keysPressed.current.l && !sukuna.domainAttack && gojo.purpleCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && !sukuna.domainAttack
                ) {
                    dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
                    dispatch2(togglePurpleCD());
                    purpleAttack();
                }
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, gojo.canmove, gojo.cursedEnergy, sukuna.domainAttack, gojo.x, gojo.blueCD, gojo.redCD, gojo.purpleCD, gojo.domainCD]);


    // GOJO AUTO ATTACK
    useEffect(() => {
        if (gojo.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && gojo.canMove && gameSettings.selectedCharacter !== "gojo") {
            console.log("attack interval before 1")

            if (gojo.cursedEnergy.currentCursedEnergy >= 0) {
                console.log("attack interval before 2")
                startAttackInterval();
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, gojo.closeRange, gojo.direction, gojo.canMove,
        gojo.health.currentHealth, gojo.redCD.isReady, gojo.blueCD.isReady, gojo.purpleCD.isReady, gojo.domainCD.isReady,
        rivalState.health.currentHealth]);



    const attackInterval = React.useRef(null);

    const handleBlueAttack = () => {
        if (gojo.blueCD.isReady) {
            dispatch(gojoSlice.actions.changeCursedEnergy(blueCost));
            dispatch2(toggleBlueCD());
            blueAttack();
        }
    }
    const handleRedAttack = () => {
        if (gojo.redCD.isReady) {
            dispatch(gojoSlice.actions.changeCursedEnergy(redCost));
            dispatch2(toggleRedCD());
            redAttack();
        }
    }
    const handlePurpleAttack = () => {
        if (gojo.purpleCD.isReady) {
            dispatch(gojoSlice.actions.setCanMove(false));
            dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
            dispatch2(togglePurpleCD());
            purpleAttack();
            setTimeout(() => {
                dispatch(gojoSlice.actions.setCanMove(true));
                // }, 15000);
            }, 3000);
        }
    }

    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        const randomInterval = 2000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        console.log("attack interval before")
        attackInterval.current = setInterval(() => {
            console.log("attack interval")
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && gojo.health.currentHealth > 0 && gojo.canMove && !sukuna.domainAttack) {
                const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
                // const stepDistance = attackDirection === "left" ? -100 : 100;
                console.log("gojo ce: ", gojo.cursedEnergy.currentCursedEnergy)
                if (gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && gojo.purpleCD.isReady)
                    handlePurpleAttack();

                else if (gojo.cursedEnergy.currentCursedEnergy >= -redCost && gojo.redCD.isReady)
                    handleRedAttack();

                else if (gojo.cursedEnergy.currentCursedEnergy >= -blueCost && gojo.blueCD.isReady)
                    handleBlueAttack();



            } else {
                stopAttackInterval(); // Megumi ölünce saldırıyı durdur
            }
        }, randomInterval);
    };
    const stopAttackInterval = () => {
        clearInterval(attackInterval.current);
    };

    useEffect(() => {
        if (sukuna.health.currentHealth <= 0 && gameSettings.selectedCharacter !== "sukuna")
            stopAttackInterval();
    }, [sukuna.health.currentHealth]);

    const [electricityEffect, setElectricityEffect] = React.useState(false);
    // Nue elecetric image animation
    useEffect(() => {
        if (!nue.isAttacking) return
        setTimeout(() => {
            setElectricityEffect(true)
            setTimeout(() => {
                setElectricityEffect(false)
            }, 2000);
        }, 500);
    }, [nue.isAttacking]);


    return (
        <>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/blue.mp3")} ref={blueSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/red-short.mp3")} ref={redSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple.mp3")} ref={purpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple-short.mp3")} ref={shortPurpleSoundEffectRef}></audio>

            {/* <div>
                {gojo.direction === "right" ? gojo.x + 250 : gojo.x - 200}
                {gojo.direction === "right" ? (Math.abs(gojo.x + 250 - rivalState.x) <= 200 ? "close range" : "far") :
                    (Math.abs(gojo.x - 200 - rivalState.x) <= 200 ? "close range" : "far")}
                <br />
            </div> */}
            <div className="blue" style={{
                visibility: bluePositionState.visibility as "visible" | "hidden",
                top: bluePositionState.attacking ? bluePositionState.y : gojo.y,
                left: bluePositionState.attacking ? bluePositionState.x : gojo.x,
                transform: "scale(" + bluePositionState.scale + ")",
                transition: bluePositionState.transition
            }}>
                <img src={require('../../Assets/blue.png')} style={{ transform: `rotate(${blueAngle}deg)` }} />
            </div>
            <div className="red" style={{
                visibility: redPositionState.visibility as "visible" | "hidden",
                top: gojo.y,
                left: redPositionState.attacking ? gojo.direction === "left" ? gojo.x - 200 : gojo.x + 250 : gojo.direction === "left" ? gojo.x - 70 : gojo.x + 50,
                transform: "scale(" + redPositionState.scale + ")",
                transition: redPositionState.transition
            }}>
                <img src={require('../../Assets/red.png')} style={{ transform: `rotate(${redAngle}deg)` }} />
            </div>

            <div className="purple" style={{
                visibility: purplePositionState.visibility as "visible" | "hidden",
                top: gojo.y,
                left: purplePositionState.attacking ? gojo.direction === "left" ? gojo.x - 2500 : gojo.x + 2500 : gojo.direction === "left" ? gojo.x - 150 : gojo.x + 100,
                transform: "scale(" + redPositionState.scale + ")",
                transition: purplePositionState.transition
            }}>
                <img src={require('../../Assets/blue.png')} style={{
                    top: purplePositionState.blueY,
                    transform: "scale(" + purplePositionState.scaleB + ")" + ` rotate(${blueAngle}deg)`,

                }} />
                <img src={require('../../Assets/red.png')} style={{
                    transform: "scale(" + purplePositionState.scaleR + ")" + ` rotate(${redAngle}deg)`,
                    top: purplePositionState.redY,
                }} />
                <img src={require('../../Assets/purple.png')} style={{
                    visibility: purplePositionState.visibilityP as "visible" | "hidden",
                    transform: "scale(" + purplePositionState.scaleP + ")",
                }} />
            </div>

            <div
                className="gojo"
                style={{
                    top: gojo.y, left: gojo.x, width: characterWidth, height: characterHeight,
                    display: gojo.health.currentHealth > 0 ? "block" : "none",
                }}
            >
                {/* <div className="blue" style={{ top: 0, left: gojo.direction === "left" ? -200 : 200, }}> */}
                <img src={require('../../Assets/electricity.png')} alt="" style={{ display: electricityEffect ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1", zIndex: 11 }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ display: divineDogs.isAttacking ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />

                <img src={gojoImage} alt="" style={{
                    transform: gojo.direction === "left" ? "scaleX(-1)" : "none", height: characterHeight, // Direction'a göre resmi ters çevir
                }} />
                {gameSettings.selectedCharacter !== "gojo" && (
                    <>
                        <div className="gojo-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-28%" }}>
                            <div style={{ position: "absolute", width: gojo.health.currentHealth * 150 / gojo.health.maxHealth, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "red" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{gojo.health.currentHealth}</p>
                        </div>
                        <div className="gojo-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                            <div style={{ position: "absolute", width: gojo.cursedEnergy.currentCursedEnergy * 150 / gojo.cursedEnergy.maxCursedEnergy, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{gojo.cursedEnergy.currentCursedEnergy}</p>
                        </div>
                    </>
                )}
                <p style={{ marginTop: gameSettings.selectedCharacter === "gojo" ? -30 : -80, width: 250, marginLeft: -60, color: "black", fontSize: "20px" }}>Satoru Gojo</p>

                <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash, height: characterHeight, width: "200px", ...slashRotation, transform: "scale(0.7)" }} />
                <img src={require('../../Assets/slash.png')} alt="" style={{ top: "-15px", left: "-30px", display: displaySlash2, height: characterHeight, width: "200px", ...slashRotation2, transform: "scale(0.7)" }} />
                {/* <img src="slash.png" alt="" style={{ top: "-25px", left: "-10px", display: sukuna.isAttacking ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "270deg", transform: "scaleY(-1)" }} /> */}
                {/* <img src={require('../../Assets/dismantle.png')} alt="" style={{ top: "-15px", left: "-30px", display: sukuna.isAttacking && Math.abs(sukuna.x - gojo.x) < 200 ? "block" : "none", height: characterHeight, width: "200px", opacity: 0.8, rotate: "45deg", transform: "scale(0.1)" }} /> */}
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

export default Gojo;

