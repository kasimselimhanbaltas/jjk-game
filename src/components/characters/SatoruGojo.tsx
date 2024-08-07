import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gojoSlice, { toggleBlueCD, togglePurpleCD, toggleRedCD } from "../../redux/character-slices/GojoSlice";
import sukunaSlice from "../../redux/character-slices/SukunaSlice";
import { setNueDirection } from "../../redux/NueSlice";
import React from "react";
import { AppDispatch } from "../../redux/GlobalStore";
import "../../Gojo.css";

const Gojo = ({ xDistance, rivalState, rivalSlice }) => {

    const gojo = useSelector((state: any) => state.GojoState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const characterWidth = 120;
    const characterHeight = 180;
    const keysPressed = useRef({ e: false, r: false, j: false, k: false, l: false, u: false, f: false, g: false, shift: false });
    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;

    const blueCost = -50;
    const chargedBlueCost = -100;
    const redCost = -100;
    const chargedRedCost = -150;
    const purpleCost = -200;
    const domainCost = -200;
    const blueDamage = -150;
    const domainDamage = -1000;
    // Sound effects
    const slashSoundEffectRef = React.useRef(null);
    const blueSoundEffectRef = React.useRef(null);
    const redSoundEffectRef = React.useRef(null);
    const purpleSoundEffectRef = React.useRef(null);
    const shortPurpleSoundEffectRef = React.useRef(null);
    const purpleExplosionSoundEffectRef = React.useRef(null);

    const [comboPicker, setComboPicker] = useState(0);

    // domainSoundEffectRef.current.volume = 0.1;
    // nueSoundEffectRef.current.volume = 0.1;


    const [mergeRedAndBlueCheck, setMergeRedAndBlue] = useState({ red: false, blue: false });

    useEffect(() => {
        console.log(mergeRedAndBlueCheck);
        if (mergeRedAndBlueCheck.red && mergeRedAndBlueCheck.blue) {
            // console.log("red and blue is about to merge!!!");
            // console.log("red:", redStyle.x, redStyle.y)
            // console.log("blue:", blueStyle.x, blueStyle.y)
            const dif = Math.abs(redStyle.x - blueStyle.x)
            if (dif > 200) return; // too far to merge
            const newPosition = redStyle.x > blueStyle.x ? blueStyle.x + dif / 2 : redStyle.x + dif / 2
            setTimeout(() => {
                setBlueStyle(prevState => ({
                    ...prevState, transition: "left 1s"
                }))
                setRedStyle(prevState => ({
                    ...prevState, transition: "left 1s"
                }))
                setTimeout(() => {
                    setBlueStyle(prevState => ({
                        ...prevState, x: newPosition
                    }))
                    setRedStyle(prevState => ({
                        ...prevState, x: newPosition
                    }))
                    setTimeout(() => {
                        setBlueStyle(prevState => ({
                            ...prevState, visibility: "hidden"
                        }))
                        setRedStyle(prevState => ({
                            ...prevState, visibility: "hidden"
                        }))
                        setPurpleItselfStyle(prevState => ({
                            ...prevState, visibility: "visible",
                            transition: "all .2s ease, left 0s, transform .2s",
                            x: newPosition - 20,
                        }))
                        setTimeout(() => {
                            purpleExplosionSoundEffectRef.current.volume = 0.1;
                            purpleExplosionSoundEffectRef.current.play();
                            setPurpleItselfStyle(prevState => ({
                                ...prevState, scale: "5",
                                transition: "all .2s ease, left 0s, transform .2s",
                            }))
                            setTimeout(() => {
                                setPurpleItselfStyle(prevState => ({
                                    ...prevState, visibility: "hidden"
                                }))
                                dispatch(rivalSlice.actions.updateHealth(-10000));
                                setTimeout(() => {
                                    setPurpleItselfStyle(prevState => ({
                                        ...prevState, visibility: "hidden", transition: "all .2s ease, transform .2s, top 0s, left 0s",
                                        scale: "1",
                                    }))
                                    setBlueStyle(prevState => ({
                                        ...prevState, transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease"
                                    }))
                                    setRedStyle(prevState => ({
                                        ...prevState, transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease", scale: "0.5"
                                    }))
                                }, 1000);
                            }, 150);
                        }, 250);
                    }, 1000);
                }, 100);
            }, 1000);

        }
    }, [mergeRedAndBlueCheck]);



    const [blueStyle, setBlueStyle] = useState({
        x: 0, y: 0, scale: 0.3, visibility: "hidden", attacking: false,
        transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease",
        animation: "",
    });
    const [redStyle, setRedStyle] = useState({
        x: 0, y: 0, scale: "0.5", visibility: "hidden", attacking: false,
        transition: "all .2s ease, transform 4s, top 0s ease, left 0s ease",
        animation: "",
    });
    const [purpleStyle, setPurpleStyle] = useState({
        transition: "all .2s ease, left .1s ease-in, top .1s ease-in",
        x: gojo.x, visibility: "hidden",
        attacking: false,
    });
    const [purpleItselfStyle, setPurpleItselfStyle] = useState({
        transition: " all .2s ease, transform .2s, top 0s, left 0s",
        scale: "1",
        x: gojo.x, visibility: "hidden",
        attacking: false,
    });


    function updateRivalDirection(direction) {
        rivalSlice.actions.setDirection(direction);
    }
    const blueAttack = (isShiftPressed, gojoPosX) => {
        blueSoundEffectRef.current.volume = 0.5;
        blueSoundEffectRef.current.play();

        dispatch(gojoSlice.actions.setAnimationState("gojo-blue"))
        dispatch(gojoSlice.actions.setCanMove(false))
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        let blueW = 100;
        let blueH = 200;
        let blueX = gojo.direction === "right" ?
            gojoPosX + (isShiftPressed ? 350 : 150) - blueW : gojoPosX + (isShiftPressed ? -300 : -100) - blueW;
        let blueY = (isShiftPressed ? 400 : 500) - blueH;
        dispatch(gojoSlice.actions.setBluePosition({ x: blueX + blueW / 2, y: blueY + blueH / 2 + 30 }))
        setTimeout(() => {
            setBlueStyle(prevState => ({
                ...prevState, x: blueX + blueW / 2, y: blueY + 50,
                visibility: "visible",
                animation: "blueEffect .4s steps(1)"
            }))
            dispatch(gojoSlice.actions.setBlueAttackMoment(true))
        }, 1500);
        setTimeout(() => { // throw blue now
            setBlueStyle(prevState => ({
                ...prevState, x: blueX, y: blueY,
                visibility: "visible",
                animation: "blue-itself .3s steps(1) infinite"
            }))
            if (isShiftPressed) { // charge blue and make it stay longer
                setMergeRedAndBlue(prevState => ({ ...prevState, blue: true }))
                setTimeout(() => {
                    setMergeRedAndBlue(prevState => ({ ...prevState, blue: false }))
                    setBlueStyle(prevState => ({
                        ...prevState, visibility: "hidden",
                    }))
                    setTimeout(() => {
                        setBlueStyle(prevState => ({
                            ...prevState, animation: "",
                        }))
                    }, 500);
                }, 10000);
            } else {
                setTimeout(() => {
                    setBlueStyle(prevState => ({
                        ...prevState, visibility: "hidden",
                    }))
                    setTimeout(() => {
                        setBlueStyle(prevState => ({
                            ...prevState, animation: "",
                        }))
                    }, 500);
                }, 2000);
            }

            setTimeout(() => { // gojo animation finished
                dispatch(gojoSlice.actions.setAnimationBlocker(false))
                dispatch(gojoSlice.actions.setAnimationState("gojo-stance"))
                dispatch(gojoSlice.actions.setCanMove(true))
                dispatch(gojoSlice.actions.setBlueAttackMoment(false))

                // hitbox check in gamearea component
                // dispatch(rivalSlice.actions.setCanMove(false))
                // dispatch(rivalSlice.actions.setGravity(0))
                // // move rival to blue
                // dispatch(rivalSlice.actions.moveCharacterTo({ x: blueX + blueW, y: blueY + blueH / 2 + 30 }))
                // setTimeout(() => {
                //     const damageInterval = setInterval(() => { // give damage slowly
                //         dispatch(rivalSlice.actions.updateHealth(blueDamage / 8))
                //     }, 100)
                //     setTimeout(() => { // unstun rival
                //         // dispatch(rivalSlice.actions.setCanMove(true)) ***
                //         dispatch(rivalSlice.actions.setGravity(5))
                //         clearInterval(damageInterval);
                //     }, 800);

                //     // setTimeout(() => {
                //     //     setBlueStyle({
                //     //         x: gojo.x, y: gojo.y, visibility: "hidden", attacking: false,
                //     //         transition: "all .2s ease, transform 4s, top 0s, left 0s", ...blueStyle,
                //     //     })
                //     // }, 400);
                // }, 200);
            }, 300);
        }, 1900)
    }

    const redAttack = (isShiftPressed, gojoPosX) => {
        redSoundEffectRef.current.volume = 0.5;
        redSoundEffectRef.current.play();
        dispatch(gojoSlice.actions.setAnimationState(isShiftPressed ? "gojo-red-vertical" : "gojo-red-horizontal"))
        dispatch(gojoSlice.actions.setCanMove(false))
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        let redW = 100;
        let redH = 200;
        let redX = gojo.direction === "right" ?
            gojoPosX + (isShiftPressed ? 30 : 150) - redW :
            gojoPosX + (isShiftPressed ? 35 : -100) - redW;
        console.log("gojoPosX: ", gojoPosX, "redX", Math.abs(gojoPosX - redX))
        let redY = 500 - redH;

        setTimeout(() => { // animation not finished yet

            if (isShiftPressed) { // charge red and make it stay longer)
                setTimeout(() => { // 2800
                    // dispatch(gojoSlice.actions.setRedAttackMoment(false))
                    dispatch(gojoSlice.actions.setCanMove(true))
                    dispatch(gojoSlice.actions.setAnimationBlocker(false))
                    setRedStyle(prevState => ({
                        ...prevState,
                        visibility: "visible",
                        animation: "red-itself .3s steps(1) infinite",
                        x: redX,
                        scale: "1",
                        y: 200, attacking: true,
                    }))
                    setMergeRedAndBlue(prevState => ({ ...prevState, red: true }))

                    setTimeout(() => {
                        // dispatch(gojoSlice.actions.setRedAttackMoment(true)) // handle skillshot damage in gamearea
                        setRedStyle(prevState => ({
                            ...prevState, visibility: "hidden"
                        }))
                        setMergeRedAndBlue(prevState => ({ ...prevState, red: false }))
                        setTimeout(() => {
                            setRedStyle(prevState => ({
                                ...prevState, x: gojoPosX, attacking: false,
                                transition: "all .2s ease, transform 4s, top 0s, left 0s",
                                animation: ""
                            }))
                        }, 300);
                    }, 3000);
                }, 800);
            }
            else {
                setRedStyle(prevState => ({
                    ...prevState,
                    visibility: "visible",
                    animation: "red-itself .3s steps(1) infinite",
                    x: redX,
                    y: 400, attacking: true,
                }))
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setRedAttackMoment(true)) // handle skillshot damage in gamearea
                    setRedStyle(prevState => ({
                        ...prevState, visibility: "hidden"
                    }))
                    setTimeout(() => {
                        setRedStyle(prevState => ({
                            ...prevState, x: gojoPosX, attacking: false,
                            transition: "all .2s ease, transform 4s, top 0s, left 0s",
                            animation: ""
                        }))
                        dispatch(gojoSlice.actions.setRedAttackMoment(false))
                        dispatch(gojoSlice.actions.setCanMove(true))
                        dispatch(gojoSlice.actions.setAnimationBlocker(false))
                    }, 300);
                }, 200);
            }
        }, 2000)
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
        setTimeout(() => {

            shortPurpleSoundEffectRef.current.play();
        }, 600);
        dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));
        dispatch(gojoSlice.actions.setCanMove(false))
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setAnimationBlocker(false))
        dispatch(rivalSlice.actions.setAnimationState("stance"))
        updateRivalDirection(gojo.direction === "left" ? "right" : "left")

        dispatch(rivalSlice.actions.setAnimationBlocker(true))

        // setPurpleStyle(prevState => ({
        //     ...prevState, visibility: "visible",
        //     transition: "all .2s ease, left 3s ease-in",
        //     x: gojo.direction === "left" ? gojo.x - 200 : gojo.x + 200,
        // }))

        setTimeout(() => { // gojo animation end
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(gojoSlice.actions.setAnimationState("stance"));
            setPurpleStyle(prevState => ({
                ...prevState, visibility: "visible",
                transition: "all .2s ease, left 1.5s ease-in",
                x: gojo.direction === "left" ? gojo.x - 200 : gojo.x + 200,
                attacking: true
            }))
            setTimeout(() => {
                dispatch(gojoSlice.actions.setPurpleAttackMoment(true)) // handle skillshot damage in gamearea
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setPurpleAttackMoment(false))
                    setPurpleStyle(prevState => ({
                        ...prevState, visibility: "hidden"
                    }))
                    setTimeout(() => {
                        setPurpleStyle(prevState => ({
                            ...prevState,
                            transition: "all .2s ease, left .1s ease-in, top .1s ease-in",
                            visibility: "hidden", x: gojo.x,
                            attacking: false,
                        }))
                        dispatch(gojoSlice.actions.setCanMove(true))

                    }, 1000);
                    dispatch(rivalSlice.actions.setCanMove(true))
                }, 500);
            }, 500);
        }, 3000);

    }

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
            if (keysPressed.current.e && keysPressed.current.r && !sukuna.domainAttack && gojo.purpleCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && !sukuna.domainAttack
                ) {
                    dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
                    dispatch2(togglePurpleCD());
                    purpleAttack();
                }
            }
            else if (keysPressed.current.e && !sukuna.domainAttack && gojo.blueCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -blueCost && !sukuna.domainAttack
                ) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleBlueAttack(isShiftPressed);
                    } else {
                        handleBlueAttack(isShiftPressed);
                    }
                }
            }
            else if (keysPressed.current.r && !sukuna.domainAttack && gojo.redCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -redCost) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleRedAttack(true);
                    } else {
                        handleRedAttack(false);
                    }
                }
            }
            else if (keysPressed.current.j && !sukuna.domainAttack && gojo.canMove) {
                punchCombo();
            }
            else if (keysPressed.current.k && !sukuna.domainAttack && gojo.canMove) {
                blackFlashCombo();
            }

            if (keysPressed.current.f) {
                // dispatch(gojoSlice.actions.setAnimationState("gojo-entry"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-punch-combination"));
                dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-blue"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-red"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));

            }
            if (keysPressed.current.g) {
                if (gojo.positioningSide === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("right"));
                else dispatch(gojoSlice.actions.setPositioningSide("left"));
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, gojo.canmove,
        gojo.cursedEnergy.currentCursedEnergy >= -blueCost || gojo.cursedEnergy.currentCursedEnergy >= -redCost
        || gojo.cursedEnergy.currentCursedEnergy >= -purpleCost,
        sukuna.domainAttack, gojo.x, gojo.blueCD, gojo.redCD, gojo.purpleCD, gojo.domainCD, gojo.canMove]);


    // GOJO AUTO ATTACK
    useEffect(() => {
        if (gojo.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && gojo.canMove && gameSettings.selectedCharacter !== "gojo") {

            if (gojo.cursedEnergy.currentCursedEnergy >= 0) {
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
        rivalState.health.currentHealth, gojo.cursedEnergy.currentCursedEnergy >= -blueCost || gojo.cursedEnergy.currentCursedEnergy >= -redCost
        || gojo.cursedEnergy.currentCursedEnergy >= -purpleCost, comboPicker]);



    const attackInterval = React.useRef(null);

    const handleBlueAttack = (isShiftPressed) => {
        if (gojo.blueCD.isReady) {
            setLocalBlueHelper(true);
            // dispatch2(toggleBlueCD());
            // dispatch(gojoSlice.actions.changeCursedEnergy(isShiftPressed ? chargedBlueCost : blueCost));
            // blueAttack(isShiftPressed, gojo.x);
        }
    }
    const [localBlueHelper, setLocalBlueHelper] = useState(false);
    useEffect(() => {
        if (localBlueHelper) {
            dispatch2(toggleBlueCD());
            dispatch(gojoSlice.actions.changeCursedEnergy(false ? chargedBlueCost : blueCost));
            blueAttack(false, gojo.x);
            setLocalBlueHelper(false); // veya blueAttack çağrısını kontrol eden durumu sıfırla
        }
    }, [gojo.x, localBlueHelper]);
    const [localRedHelper, setLocalRedHelper] = useState(false);
    useEffect(() => {
        if (localRedHelper) {
            console.log("reddding")
            dispatch(gojoSlice.actions.changeCursedEnergy(false ? chargedRedCost : redCost));
            dispatch2(toggleRedCD());
            redAttack(false, gojo.x);
            setLocalRedHelper(false); // veya blueAttack çağrısını kontrol eden durumu sıfırla
        }
    }, [gojo.x, localRedHelper]);

    const handleRedAttack = (isShiftPressed) => {
        if (gojo.redCD.isReady) {
            // dispatch(gojoSlice.actions.changeCursedEnergy(isShiftPressed ? chargedRedCost : redCost));
            // dispatch2(toggleRedCD());
            // redAttack(isShiftPressed, gojo.x);
            setLocalRedHelper(true);
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
    const punchCombo = () => {

        if (Math.abs(xDistance) > 150) return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState("gojo-punch-combination"));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        dispatch(rivalSlice.actions.setCanMove(false));
        dispatch(rivalSlice.actions.setAnimationState("stance"))
        dispatch(rivalSlice.actions.setAnimationBlocker(true))
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount !== 3) dispatch(rivalSlice.actions.updateHealth(-10));
            else { // last hit
                dispatch(rivalSlice.actions.updateHealth(-70));
                dispatch(rivalSlice.actions.moveCharacterWD(
                    { x: attackDirection === "right" ? 30 : -30, y: 0 }
                ));
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))

                clearInterval(int)
            }
            punchCount++;
        }, 200)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setCanMove(true)); //**********
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
        }, 1000);
    }
    const blackFlashCombo = () => {
        if (Math.abs(xDistance) > 200) return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        dispatch(rivalSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount !== 3) dispatch(rivalSlice.actions.updateHealth(-10));
            else { // last hit
                dispatch(rivalSlice.actions.updateHealth(-70));
                dispatch(rivalSlice.actions.moveCharacterWD(
                    { x: attackDirection === "right" ? 30 : -30, y: 0 }
                ));
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(30))
                clearInterval(int)
            }
            punchCount++;
        }, 375)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setCanMove(true));// **********
        }, 1500);
    }

    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        const randomInterval = 1000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && gojo.health.currentHealth > 0 && gojo.canMove && !sukuna.domainAttack) {
                const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
                // const stepDistance = attackDirection === "left" ? -100 : 100;
                // const isShiftPressed = keysPressed.current.shift ? true : false; // auto shift?
                if (gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && gojo.purpleCD.isReady && false) // sil
                    handlePurpleAttack();

                // else if (gojo.cursedEnergy.currentCursedEnergy >= -redCost && gojo.redCD.isReady) {
                //     handleRedAttack(false);
                // }
                // else if (gojo.cursedEnergy.currentCursedEnergy >= -blueCost && gojo.blueCD.isReady) {
                //     handleBlueAttack(false);
                // }
                else {
                    if (comboPicker === 0) {
                        punchCombo()
                        setComboPicker(1)
                    }
                    else if (comboPicker === 1) {
                        blackFlashCombo()
                        setComboPicker(0)
                    }
                }

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
    }, [sukuna.health.currentHealth > 0]);

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


    const [gojoStyle, setGojoStyle] = React.useState({
        animation: "gojo-entry steps(1) 1s",
    });
    useEffect(() => {
        if (gojo.animationState === "stance") {
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
        else if (gojo.animationState === "move") {
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
        else if (gojo.animationState === "gojo-entry") { // requires reverse positioning
            if (gojo.direction === "right")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-entry 1s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "right") dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 1000);
        }
        else if (gojo.animationState === "jump") {
            setGojoStyle({
                animation: "gojo-jump 1.5s steps(1)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 1500);
        }
        else if (gojo.animationState === "gojo-punch-combination") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-punch-combination 1s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 1000);
        }
        else if (gojo.animationState === "gojo-blackflash-combination") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-blackflash-combination 1.5s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 1500);
        }
        else if (gojo.animationState === "gojo-blue") { // requires reverse positioning
            if (gojo.direction === "right")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-blue 2.2s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "right")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 2200);
        }
        else if (gojo.animationState === "gojo-red-horizontal") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-red-horizontal 3s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 3000);
        }
        else if (gojo.animationState === "gojo-red-vertical") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-red-vertical 3s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 3000);
        }
        else if (gojo.animationState === "gojo-makingPurple") { // requires reverse positioning
            if (gojo.direction === "left") {
                dispatch(gojoSlice.actions.setPositioningSide("right"))
                setGojoStyle({
                    animation: "gojo-makingPurple-left 3s steps(1)",
                })
            }
            else {
                setGojoStyle({
                    animation: "gojo-makingPurple 3s steps(1)",
                })
            }

            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 3000);
        }
        else {
            console.log("Unknown animation: ", gojo.animationState)
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
    }, [gojo.animationState]);



    return (
        <>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/blue.mp3")} ref={blueSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/red-short.mp3")} ref={redSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple.mp3")} ref={purpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple-short.mp3")} ref={shortPurpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/hq-explosion-6288.mp3")} ref={purpleExplosionSoundEffectRef}></audio>

            <div className="blue" style={{
                visibility: blueStyle.visibility as "visible" | "hidden",
                top: blueStyle.y,
                left: blueStyle.x,
                // transform: "scale(" + blueStyle.scale + ")",
                transition: blueStyle.transition,
                animation: blueStyle.animation
            }}>
            </div>
            <div className="red" style={{
                visibility: redStyle.visibility as "visible" | "hidden",
                // visibility: "visible",
                top: redStyle.y,
                left: redStyle.x,
                transition: redStyle.transition,
                animation: redStyle.animation,
                // animation: "red-itself .3s steps(1) infinite",
                scale: redStyle.scale,
            }}>
                {/* <img src={require('../../Assets/red.png')} style={{ transform: `rotate(${redAngle}deg)` }} /> */}
            </div>
            <div className="purple" style={{
                visibility: purpleStyle.visibility as "visible" | "hidden",
                top: 475,
                left: purpleStyle.attacking ?
                    (gojo.direction === "left" ? -2500 : 2500) :
                    (gojo.direction === "left" ? gojo.x - 110 : gojo.x - 90),
                transition: purpleStyle.transition,
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
            }}> </div>

            <div className="purple-itself" style={{
                // visibility: "visible",
                visibility: purpleItselfStyle.visibility as "visible" | "hidden",
                top: 180,
                left: purpleItselfStyle.x,
                transition: purpleItselfStyle.transition,
                scale: purpleItselfStyle.scale
                // animation: "purple-itself steps(1) 3s infinite"
                // transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
            }}> </div>

            <div className="gojoCC" style={{
                bottom: gameAreaHeight - gojo.y,
                left: gojo.positioningSide === "left" ? gojo.x : undefined,
                right: gojo.positioningSide === "right" ? 1400 - gojo.x - 66 : undefined,
                display: gojo.health.currentHealth > 0 ? "block" : "none",
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
                animation: gojoStyle.animation,
            }}>
            </div>
            <div
                className="gojo-container"
                style={{
                    bottom: gameAreaHeight - gojo.y, left: gojo.x,
                    display: gojo.health.currentHealth > 0 ? "block" : "none",
                }}
            >
                {/* <div className="blue" style={{ top: 0, left: gojo.direction === "left" ? -200 : 200, }}> */}
                <img src={require('../../Assets/electricity.png')} alt="" style={{ display: electricityEffect ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1", zIndex: 11 }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ display: divineDogs.isAttacking ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />
                <img src={require(`../../Assets/guard.png`)} alt="" style={{
                    display: gojo.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -15,
                    height: 120, width: 120, opacity: 0.8, scale: "1",
                    transform: "translate(-10%,0)"
                }} />

            </div>
        </>
    );
};

export default Gojo;

