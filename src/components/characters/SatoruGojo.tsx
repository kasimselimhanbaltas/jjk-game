import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gojoSlice, { toggleBlueCD, toggleDomainCD, toggleRedCD, toggleSimpleDomainCD } from "../../redux/character-slices/GojoSlice";
import gameSettingsSlice from "../../redux/GameSettingsSlice";
import sukunaSlice, { updateHealth } from "../../redux/character-slices/SukunaSlice";
import { setNueDirection } from "../../redux/NueSlice";
import React from "react";
import { AppDispatch } from "../../redux/GlobalStore";
import "../../Gojo.css";

const Gojo = ({ xDistance, rivalState, rivalSlice }) => {
    // console.log("render GOJO")
    const gojo = useSelector((state: any) => state.GojoState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const characterWidth = 120;
    const characterHeight = 180;
    const keysPressed = useRef({
        s: false, e: false, r: false, j: false, k: false, l: false, u: false, f: false, g: false, shift: false,
        z: false, x: false, c: false, v: false
    });
    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;

    const blueCost = -50;
    const chargedBlueCost = -100;
    const redCost = -100;
    const chargedRedCost = -150;
    const purpleCost = -150;
    const domainCost = -200;
    const blueDamage = -150;
    const domainDamage = -1000;
    // Sound effects
    const blueSoundEffectRef = React.useRef(null);
    const redSoundEffectRef = React.useRef(null);
    const purpleSoundEffectRef = React.useRef(null);
    const shortPurpleSoundEffectRef = React.useRef(null);
    const purpleExplosionSoundEffectRef = React.useRef(null);
    const punchSoundEffectRef = React.useRef(null);
    const domainSoundEffectRef = React.useRef(null);

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
                    dispatch(gojoSlice.actions.setHardStun(true))
                    dispatch(rivalSlice.actions.setHardStun(true))
                    dispatch(gojoSlice.actions.setGravity(0))
                    dispatch(gojoSlice.actions.moveCharacterTo({ x: newPosition + 70, y: 500 }))
                    setGojoStyle({
                        animation: "gojo-purple-pose 1s ease forwards",
                    })
                    dispatch(gojoSlice.actions.setAnimationBlocker(true))
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
                                dispatch(rivalSlice.actions.setTakeDamage({
                                    isTakingDamage: true, damage: 1000, takeDamageAnimationCheck: true, knockback: 100, timeout: 300
                                }))
                                // dispatch(rivalSlice.actions.updateHealth(-1000));
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
                                    dispatch(gojoSlice.actions.setAnimationBlocker(false))
                                    dispatch(gojoSlice.actions.setHardStun(false))
                                    dispatch(rivalSlice.actions.setHardStun(false))
                                    dispatch(gojoSlice.actions.setGravity(5))
                                    dispatch(gojoSlice.actions.setAnimationState("stance"))
                                    setGojoStyle({
                                        animation: "gojo-stance 1s steps(1) infinite",
                                    })
                                }, 1000);
                            }, 150);
                        }, 3000);
                    }, 1000);
                }, 200);
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
    const [holeStyle, setHoleStyle] = useState({
        left: 200, top: 100, display: "none",
    })
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
                }, 15000); // 15 seconds of stay
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
                    }, 8000);
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

    const purpleAttack = () => {
        shortPurpleSoundEffectRef.current.volume = 0.5;
        setTimeout(() => {
            shortPurpleSoundEffectRef.current.play();
        }, 600);
        dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));
        dispatch(gojoSlice.actions.setCanMove(false))
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))
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
            console.log("purple moment true!!!")
            dispatch(gojoSlice.actions.setPurpleAttackMoment(true)) // handle skillshot damage in gamearea

            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(gojoSlice.actions.setAnimationState("stance"));
            setPurpleStyle(prevState => ({
                ...prevState, visibility: "visible",
                transition: "all .2s ease, left 1.5s ease-in",
                x: gojo.direction === "left" ? gojo.x - 200 : gojo.x + 200,
                attacking: true
            }))
            setTimeout(() => {
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
                    dispatch(rivalSlice.actions.setHardStun(false))
                }, 500);
            }, 500);
        }, 3000);

    }
    const [RCT, setRCT] = useState(
        {
            rctActive: false,
            rctMode: "body"
        }
    );
    const [rctCD, setRctCD] = useState(false);

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
            if (keysPressed.current.e && keysPressed.current.r && !sukuna.domainAttack && gojo.redCD.isReady && gojo.blueCD.isReady && !gojo.rct.rctActive) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && !sukuna.domainAttack && !gojo.isJumping
                    && !gojo.fallingBlossomEmotion.isActive
                ) {
                    console.log("er")
                    dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
                    dispatch2(toggleRedCD());
                    dispatch2(toggleBlueCD());
                    purpleAttack();
                }
            }
            else if (keysPressed.current.e && !sukuna.domainAttack && gojo.blueCD.isReady && !gojo.rct.rctActive) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -blueCost && !sukuna.domainAttack
                    && !gojo.isJumping && !gojo.fallingBlossomEmotion.isActive) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleBlueAttack(isShiftPressed);
                    } else {
                        handleBlueAttack(isShiftPressed);
                    }
                }
            }
            else if (keysPressed.current.r && !sukuna.domainAttack && gojo.redCD.isReady && !gojo.rct.rctActive) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -redCost && !gojo.isJumping
                    && !gojo.fallingBlossomEmotion.isActive
                ) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleRedAttack(true);
                    } else {
                        handleRedAttack(false);
                    }
                }
            }
            else if (keysPressed.current.j && !sukuna.domainAttack && gojo.canMove && !gojo.isJumping) {
                if (keysPressed.current.s)
                    kickCombo();
                else punchCombo();
            }
            else if (keysPressed.current.k && !sukuna.domainAttack && gojo.canMove && !gojo.isJumping) {
                blackFlashCombo();
            }
            else if (keysPressed.current.l && !sukuna.domainAttack && gojo.canMove && !gojo.isJumping
                && !gojo.fallingBlossomEmotion.isActive && gojo.domainCD.isReady
            ) {
                dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: true }))

                // setTimeout(() => {
                //     dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: false }))
                // }, 100);
                dispatch(gojoSlice.actions.setCanMove(false))
                setDomainBugFixer(true);
            }

            if (keysPressed.current.f) {
                // dispatch(gojoSlice.actions.setAnimationState("gojo-entry"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-punch-combination"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-blue"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-red"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-kick-combo"));

            }
            if (keysPressed.current.z && !rctCD) {
                // body, if rct is already on and body, turn off
                setRctCD(true);

                if (RCT.rctActive && RCT.rctMode === "body")
                    setRCT(prevState => ({
                        ...prevState, rctMode: "body", rctActive: false
                    }))
                else
                    setRCT(prevState => ({
                        ...prevState, rctMode: "body", rctActive: true
                    }))
            }
            if (keysPressed.current.x && !rctCD) {
                setRctCD(true);

                if (RCT.rctActive && RCT.rctMode === "ct") {
                    setRCT(prevState => ({
                        ...prevState, rctMode: "ct", rctActive: false,
                    }))
                }
                else {
                    setRCT(prevState => ({
                        ...prevState, rctMode: "ct", rctActive: true,
                    }))
                }
            }
            if (keysPressed.current.v) {
                dispatch(gojoSlice.actions.setInfinity(gojo.infinity ? false : true));
            }
            if (keysPressed.current.c) {
                // if DA already active, end it 
                // console.log("gojo SD: ", gojo.simpleDomain.isActive)
                // if (gojo.simpleDomain.isActive) {
                //     dispatch(gojoSlice.actions.setSimpleDomain({ ...gojo.simpleDomain, isActive: false }))
                // }
                // else {
                if (!gojo.simpleDomain.isActive && gojo.simpleDomain.skill.isReady
                    && !gojo.domainAmplification.isActive && !gojo.fallingBlossomEmotion.isActive
                ) {
                    dispatch(gojoSlice.actions.setSimpleDomain({ ...gojo.simpleDomain, isActive: true }))
                    setTimeout(() => {
                        console.log("simple domain is on CD now!")
                        dispatch2(toggleSimpleDomainCD());
                    }, gojo.simpleDomain.duration * 1000);
                }
                // }
            }
            if (keysPressed.current.g) {
                console.log(!gojo.domainAmplification.isActive && !gojo.simpleDomain.isActive)
                if (!gojo.domainAmplification.isActive && !gojo.simpleDomain.isActive) {
                    dispatch(gojoSlice.actions.setFallingBlossomEmotion({
                        ...gojo.fallingBlossomEmotion, isActive: gojo.fallingBlossomEmotion.isActive ? false : true,
                    }))
                }
            }
            // if (keysPressed.current.g) {
            //     dispatch(gojoSlice.actions.setTakeDamage({
            //         isTakingDamage: true, damage: 200, takeDamageAnimationCheck: true, knockback: 250, timeout: 300
            //     }));
            //     // handleTakeDamage(true, 500, 10, 500)
            // }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, gojo.canmove,
        gojo.cursedEnergy.currentCursedEnergy >= -blueCost || gojo.cursedEnergy.currentCursedEnergy >= -redCost
        || gojo.cursedEnergy.currentCursedEnergy >= -purpleCost,
        sukuna.domainAttack, gojo.x, gojo.blueCD, gojo.redCD, gojo.domainCD, gojo.canMove, gojo.isJumping,
        RCT, rctCD, gojo.rct.rctActive, gojo.simpleDomain, gojo.fallingBlossomEmotion, gojo.domainAmplification.isActive]);

    const [domainClashCDref, setDomainClashCDref] = useState(false);
    const [domainBugFixer, setDomainBugFixer] = useState(false);
    const [domainHit, setDomainHit] = useState(false);

    // *** ULTRA DOMAIN HANDLER
    useEffect(() => {
        if (gameSettings.domainClash && gojo.domainCD.isReady && gojo.cursedEnergy.currentCursedEnergy >= 200) {
            handleDomainExpansion();
            dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
            dispatch(gameSettingsSlice.actions.setDomainClash(false));
        }
        else if (gojo.domainStatus.isInitiated === true) { // user pressed domain expansion key or bot initiated domain
            dispatch(gojoSlice.actions.setCanMove(false));
            dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: false }))
            if (gameSettings.domainClashReady) { // rival already initiated domain
                dispatch(gameSettingsSlice.actions.setDomainClash(true));
            }
            else {
                dispatch(gameSettingsSlice.actions.setDomainClashReady(true));
                setTimeout(() => {
                    setDomainClashCDref(true);
                    dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
                }, 2000);
            }
        }
        else if (gojo.domainStatus.forceExpand) {
            handleDomainExpansion();
        }
        else {
            if (domainBugFixer && domainClashCDref && gojo.domainCD.isReady && gojo.cursedEnergy.currentCursedEnergy >= 200) {
                console.log("b")
                handleDomainExpansion();
            }
        }
    }, [gojo.domainStatus.isInitiated, gojo.domainStatus.forceExpand, gameSettings.domainClashReady, gameSettings.domainClash,
        domainClashCDref, gojo.domainCD.isReady, domainBugFixer])


    //     }
    // }, [gojo.domainStatus.isInitiated, gameSettings.domainClashReady, gameSettings.domainClash, domainClashCDref, rivalState.domainStatus.isInitiated])





    // check simpledomain and change sure hit effect of rival domain
    useEffect(() => {
        if (gojo.simpleDomain.isActive) {
            console.log("Simple Domain is Active!!!")
            dispatch(rivalSlice.actions.setDomainState({ ...rivalState.domainStatus, sureHitStatus: false }))
            console.log("rival sure hit is cancelled!")
        }
        else {
            dispatch(rivalSlice.actions.setDomainState({ ...rivalState.domainStatus, sureHitStatus: true }))
            console.log("rival sure hit is active again!")
        }
    }, [gojo.simpleDomain.isActive])

    useEffect(() => {
        console.log(rctCD)
        setTimeout(() => {
            setRctCD(false);
        }, 500);
    }, [rctCD]);

    useEffect(() => {
        let int = null;
        let bodyHealCost = -7;
        let bodyHealAmount = 10;
        let ctHealCost = -1;
        if (RCT.rctActive) {
            int = setInterval(() => {
                if (RCT.rctMode === "body") {
                    dispatch(gojoSlice.actions.setRCT({
                        rctActive: true, rctMode: "body"
                    }))
                    if (gojo.health.currentHealth < gojo.health.maxHealth && gojo.cursedEnergy.currentCursedEnergy >= -bodyHealCost) {

                        dispatch(gojoSlice.actions.updateHealth(bodyHealAmount))
                        dispatch(gojoSlice.actions.changeCursedEnergy(bodyHealCost))
                    }
                }
                if (RCT.rctMode === "ct") {
                    if (!gojo.blueCD.isReady || !gojo.redCD.isReady || !gojo.domainCD.isReady) {
                        if (gojo.cursedEnergy.currentCursedEnergy >= -ctHealCost) {
                            dispatch(gojoSlice.actions.setRCT({
                                rctActive: true, rctMode: "ct"
                            }))
                            dispatch(gojoSlice.actions.changeCursedEnergy(ctHealCost))
                        }
                        else {
                            dispatch(gojoSlice.actions.setRCT({
                                rctActive: false, rctMode: "ct"
                            }))
                        }
                    }
                }
            }, 100)
        } else {
            dispatch(gojoSlice.actions.setRCT({
                rctActive: false, rctMode: "body"
            }))

        }
        return () => {
            clearInterval(int)
        }
    }, [RCT, gojo.cursedEnergy.currentCursedEnergy < 5, gojo.health.currentHealth < gojo.health.maxHealth,
        gojo.blueCD.isReady, gojo.redCD.isReady, gojo.domainCD.isReady
    ])


    // GOJO AUTO ATTACK
    useEffect(() => {
        if (gojo.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && gojo.canMove && gameSettings.selectedCharacter !== "gojo") {

            if (gojo.cursedEnergy.currentCursedEnergy >= 0 && !gojo.hardStun && !gojo.devStun) {
                startAttackInterval();
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [gojo.hardStun, gojo.devStun, gojo.closeRange, gojo.direction, gojo.canMove,
    gojo.health.currentHealth > 0, gojo.redCD.isReady, gojo.blueCD.isReady, gojo.domainCD.isReady,
    rivalState.health.currentHealth > 0, gojo.cursedEnergy.currentCursedEnergy >= -blueCost || gojo.cursedEnergy.currentCursedEnergy >= -redCost
    || gojo.cursedEnergy.currentCursedEnergy >= -purpleCost, comboPicker]);

    const panelRef = useRef(null);
    const domainPanel = () => {
        if (panelRef) {
            setTimeout(() => {

                panelRef.current.style.display = "block"
                setTimeout(() => {
                    panelRef.current.style.height = "400px"
                    panelRef.current.style.width = "500px"
                }, 100);
                setTimeout(() => {
                    panelRef.current.style.height = "1px"
                    panelRef.current.style.width = "500px"
                    setTimeout(() => {
                        panelRef.current.style.display = "none";
                    }, 800);
                }, 3000);
            }, 4000);
        }
    }
    const domainClashPanelRef = useRef(null);
    const domainClashPanel = () => {
        if (domainClashPanelRef) {
            setTimeout(() => {

                domainClashPanelRef.current.style.display = "block"
                setTimeout(() => {
                    domainClashPanelRef.current.style.height = "400px"
                    domainClashPanelRef.current.style.width = "500px"
                }, 100);
                setTimeout(() => {
                    domainClashPanelRef.current.style.height = "1px"
                    domainClashPanelRef.current.style.width = "500px"
                    setTimeout(() => {
                        domainClashPanelRef.current.style.display = "none";
                    }, 800);
                }, 3000);
            }, 4000);
        }
    }


    const domainStarter = useRef(null)

    const handleDomainExpansion = useCallback(() => {
        setDomainBugFixer(false);
        dispatch2(toggleDomainCD());
        dispatch(gojoSlice.actions.setHardStun(true));
        dispatch(gojoSlice.actions.setInfinity(false));
        dispatch(gojoSlice.actions.setAnimationState("domain-pose"));
        dispatch(gojoSlice.actions.setAnimationBlocker(true));
        if (!gameSettings.domainClash) {
            domainPanel();
            dispatch(rivalSlice.actions.setDevStun(true));
        }
        else {
            dispatch(gojoSlice.actions.moveCharacterTo({ x: 250, y: 560 }));
            dispatch(gojoSlice.actions.setDirection("right"));
            domainClashPanel();
        }
        domainSoundEffectRef.current.play();

        if (domainStarter.current) {
            domainStarter.current.style.transition = "all .2s, scale 5s"
            dispatch(gojoSlice.actions.setHardStun(true))
            setTimeout(() => {
                domainStarter.current.style.scale = 300;
                setTimeout(() => {

                    if (!gameSettings.domainClash) {
                        setDomainHit(true);
                    }

                    dispatch(gojoSlice.actions.setAnimationBlocker(false)); // animation blocker false

                    dispatch(gojoSlice.actions.setDomainState(
                        { ...gojo.domainStatus, isActive: true }
                    ));
                    dispatch(gojoSlice.actions.setCanMove(true))

                    dispatch(gojoSlice.actions.setInfinity(true));
                    domainStarter.current.style.transition = "all 0s";
                    domainStarter.current.style.scale = 0;

                    dispatch(gojoSlice.actions.setHardStun(false));
                    setTimeout(() => {
                        dispatch(gojoSlice.actions.setAnimationState("stance"));
                        setTimeout(() => { // 10 seconds later domain ends
                            dispatch(gojoSlice.actions.setDomainState(
                                { ...gojo.domainStatus, isActive: false, isInitiated: false, forceExpand: false }
                            ));
                            if (!gameSettings.tutorial)
                                dispatch(rivalSlice.actions.setDevStun(false)); // *stun
                        }, gojo.domainStatus.duration * 1000); // duration
                    }, 1000);
                }, 6000);
            }, 1000);
        }
        setTimeout(() => {
            // domainStarter.current.style.scale = 1;
            dispatch(gojoSlice.actions.setHardStun(false))
        }, 5000)
    }, [gojo.x, gameSettings.domainClash])


    // Handle side effects of Satoru Gojo's domain expansion
    useEffect(() => {

        if (gojo.domainStatus.isActive && rivalState.domainStatus.isActive) {
            // domain clash happened
            dispatch(gojoSlice.actions.setDomainState(
                { ...gojo.domainStatus, sureHitStatus: false, domainClash: true }
            ));
            // dispatch(rivalSlice.actions.setDomainState(
            //     { ...rivalState.domainStatus, sureHitStatus: false, domainClash: true }
            // ));
        }
        if (gojo.domainStatus.isActive && !rivalState.domainStatus.isActive) {
            dispatch(gojoSlice.actions.setDomainState(
                { ...gojo.domainStatus, sureHitStatus: true, domainClash: false }
            ));
        }
        if (gojo.domainStatus.isActive && gojo.domainStatus.sureHitStatus && domainHit) {
            dispatch(rivalSlice.actions.updateHealth(-1000));
            setDomainHit(false);
        }
        // domain damage interval
        // let domainDamageInterval = null;
        // if (gojo.domainStatus.isActive && gojo.domainStatus.sureHitStatus) {
        //     domainDamageInterval = setInterval(() => {
        //         dispatch(rivalSlice.actions.updateHealth(-10));
        //     }, 100)
        // }
        return () => {
            // clearInterval(domainDamageInterval)
        }
    }, [gojo.domainStatus, rivalState.domainStatus, gameSettings.domainClash, domainHit]);


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
            const isShiftPressed = keysPressed.current.shift ? true : false;
            dispatch2(toggleBlueCD());
            dispatch(gojoSlice.actions.changeCursedEnergy(isShiftPressed ? chargedBlueCost : blueCost));
            blueAttack(isShiftPressed, gojo.x);
            setLocalBlueHelper(false); // blueAttack çağrısını kontrol eden durumu sıfırla
        }
    }, [gojo.x, localBlueHelper]);
    const [localRedHelper, setLocalRedHelper] = useState(false);
    useEffect(() => {
        if (localRedHelper) {
            const isShiftPressed = keysPressed.current.shift ? true : false
            dispatch(gojoSlice.actions.changeCursedEnergy(isShiftPressed ? chargedRedCost : redCost));
            dispatch2(toggleRedCD());
            redAttack(isShiftPressed, gojo.x);
            setLocalRedHelper(false); // redAttack çağrısını kontrol eden durumu sıfırla
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
        if (gojo.redCD.isReady && gojo.blueCD.isReady) {
            dispatch(gojoSlice.actions.setCanMove(false));
            dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
            dispatch2(toggleBlueCD());
            dispatch2(toggleRedCD());
            purpleAttack();
            setTimeout(() => {
                dispatch(gojoSlice.actions.setCanMove(true));
                // }, 15000);
            }, 3000);
        }
    }

    // CLOSE COMBAT METHODS
    const [chaseForCloseCombat, setChaseForCloseCombat] = useState(false);
    useEffect(() => { // update gojo position for close combat
        if (chaseForCloseCombat) {
            const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
            if (gojo.direction !== attackDirection) {
                dispatch(gojoSlice.actions.setDirection(attackDirection));
                dispatch(gojoSlice.actions.setPositioningSide(attackDirection === "left" ? "right" : "left"))
            }
            dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
            setChaseForCloseCombat(false)
        }
    }, [chaseForCloseCombat])
    const punchCombo = () => {
        if (Math.abs(xDistance) > 150) return;
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState("gojo-punch-combination"));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
            dispatch(rivalSlice.actions.setCanMove(false));
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setAnimationState("stance"))
            dispatch(rivalSlice.actions.setAnimationBlocker(true))
        }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 1 || punchCount === 4 || punchCount === 7 || punchCount === 10 || punchCount === 13) {
                setChaseForCloseCombat(true)
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: 0, timeout: 50
                }))
                // dispatch(rivalSlice.actions.updateHealth(-10));
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 100);
            }

            else if (punchCount === 14) { // last hit
                // dispatch(rivalSlice.actions.updateHealth(-20));
                // dispatch(rivalSlice.actions.moveCharacterWD(
                //     { x: attackDirection === "right" ? 30 : -30, y: 0 }
                // ));
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 30, timeout: 500
                }))
                setTimeout(() => {
                    dispatch(rivalSlice.actions.setCanMove(true)); //**********
                    dispatch(rivalSlice.actions.setAnimationBlocker(false))
                }, 500);
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))
                clearInterval(int)
            }
            punchCount++;
        }, 1000 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            // dispatch(rivalSlice.actions.setCanMove(true)); //**********
            // dispatch(rivalSlice.actions.setAnimationBlocker(false))
        }, 1000);
    }

    const blackFlashCombo = () => {
        if (Math.abs(xDistance) > 200) return;
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
            dispatch(rivalSlice.actions.setHardStun(true));
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setAnimationState("stance"))
            // dispatch(rivalSlice.actions.setAnimationBlocker(true))
        }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 0 || punchCount === 4 || punchCount === 7 || punchCount === 10) {
                if (punchCount === 0 || punchCount === 4 || punchCount === 7)
                    setChaseForCloseCombat(true)

                if (punchCount === 10)
                    dispatch(rivalSlice.actions.updateHealth(-50));
                else
                    dispatch(rivalSlice.actions.updateHealth(-10));
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 150);

            }
            else if (punchCount === 16) { // last hit
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(30))
                clearInterval(int)
            }
            if (punchCount === 10) {
                dispatch(sukunaSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 250, timeout: 500
                }));
            }
            punchCount++;
        }, 1500 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            setTimeout(() => {
                dispatch(rivalSlice.actions.setAnimationBlocker(false))
                dispatch(rivalSlice.actions.setCanMove(true));// **********
                dispatch(rivalSlice.actions.setHardStun(false));// **********

            }, 500);
        }, 1500);
    }
    const kickCombo = () => {
        if (Math.abs(xDistance) > 200) return;
        punchSoundEffectRef.current.volume = 0.5
        dispatch(gojoSlice.actions.setGravity(0)) //gravity
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState("gojo-kick-combo"));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(gojoSlice.actions.setAnimationBlocker(true))
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
            dispatch(rivalSlice.actions.setCanMove(false));
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setAnimationState("stance"))
            dispatch(rivalSlice.actions.setAnimationBlocker(true))
        }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 16) { // finish
                dispatch(rivalSlice.actions.updateHealth(-70));
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))
                clearInterval(int)
            }
            else if (punchCount === 1 || punchCount === 4 || punchCount === 8 || punchCount === 11 || punchCount === 14) {
                punchSoundEffectRef.current.play()
                dispatch(rivalSlice.actions.moveCharacterWD(
                    { x: attackDirection === "right" ? 100 : -100, y: 0 }
                ));
                dispatch(rivalSlice.actions.updateHealth(-75 / 5));
                if (punchCount === 11) {
                    // dispatch(gojoSlice.actions.moveCharacterTo({ x: gojo.x, y: 500 }))
                    console.log("up")
                }
            }
            else { // last hit
                setChaseForCloseCombat(true)
            }
            console.log(punchCount)
            punchCount++;
        }, 3000 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setCanMove(true));// **********
            dispatch(gojoSlice.actions.setGravity(5)) //gravity
        }, 3000);
    }

    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        const randomInterval = 1000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            console.log("int")
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && gojo.health.currentHealth > 0 && gojo.canMove && !sukuna.domainAttack) {
                const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
                // const stepDistance = attackDirection === "left" ? -100 : 100;
                const isShiftPressed = keysPressed.current.shift ? true : false; // auto shift?
                if (gojo.cursedEnergy.currentCursedEnergy >= 200 && gojo.domainCD.isReady) {
                    setDomainBugFixer(true);
                    dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: true }));
                }
                else if (gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && gojo.redCD.isReady && gojo.blueCD.isReady)
                    handlePurpleAttack();

                else if (gojo.cursedEnergy.currentCursedEnergy >= -redCost && gojo.redCD.isReady) {
                    handleRedAttack(isShiftPressed);
                }
                else if (gojo.cursedEnergy.currentCursedEnergy >= -blueCost && gojo.blueCD.isReady) {
                    handleBlueAttack(false);
                }
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

    useEffect(() => {
        const obj = gojo.takeDamage;
        console.log("obj: ", obj)
        if (obj.isTakingDamage) {
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback);
        }
    }, [gojo.takeDamage.isTakingDamage === true])

    const handleTakeDamage = useCallback((takeDamageAnimationCheck, timeout, damage, knockback) => {
        console.log("handling take damage")
        // Damage negation
        // if (gojo.domainAmplification.isActive) {
        //     damage = damage * 0.5;
        // }
        if (gojo.simpleDomain.isActive) {
            damage = damage * 0.2;
        }
        if (gojo.fallingBlossomEmotion.isActive &&
            (!gojo.infinity || (rivalState.domainStatus.isActive && rivalState.domainStatus.sureHitStatus))) {
            if (gojo.cursedEnergy.currentCursedEnergy > damage) {
                console.log("damage negation by FBE")
                damage = damage * 0.1;
                dispatch(gojoSlice.actions.changeCursedEnergy(-damage * 5));
            }
        }
        // check infinity and sure hit effect
        if (!gojo.infinity || (rivalState.domainStatus.isActive && rivalState.domainStatus.sureHitStatus
            || rivalState.domainAmplification.isActive)) {
            console.log("***** damage: ", damage)
            dispatch(gojoSlice.actions.updateHealth(-damage));
        }
        if (knockback && knockback > 0 && !gojo.infinity)
            dispatch(gojoSlice.actions.moveCharacterWD({ x: gojo.direction === "left" ? knockback : -knockback, y: 0 }))
        if (takeDamageAnimationCheck) {
            dispatch(gojoSlice.actions.setHardStun(true));
            dispatch(gojoSlice.actions.setAnimationState("take-damage"));
            dispatch(gojoSlice.actions.setTransition("all .2s ease, transform 0s, left .8s ease-in-out"));
            dispatch(gojoSlice.actions.setAnimationBlocker(true));
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationBlocker(false));
                dispatch(gojoSlice.actions.setHardStun(false)); // ****
                dispatch(gojoSlice.actions.setAnimationState("stance"));
                dispatch(gojoSlice.actions.setTransition("all .2s ease, transform 0s"));
                dispatch(gojoSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 50 }));
            }, 500 + timeout);
        }
        else {
            setTimeout(() => {
                dispatch(gojoSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 50 }));
            }, timeout);
        }
    }, [gojo.direction, gojo.infinity, rivalState.domainStatus,
    rivalState.domainAmplification.isActive, gojo.simpleDomain.isActive,
    gojo.fallingBlossomEmotion.isActive, gojo.cursedEnergy.currentCursedEnergy]);

    const [gojoStyle, setGojoStyle] = React.useState({
        animation: "gojo-first-pose steps(1) 1s infinite",
    });
    useEffect(() => {
        if (gojo.animationState === "stance") {
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
        else if (gojo.animationState === "first-pose") {
            if (gojo.direction === "right")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-first-pose 1s steps(1) infinite",
            })
            setTimeout(() => {
                if (gojo.direction === "right") dispatch(gojoSlice.actions.setPositioningSide("left"))

            }, 3000);
        }
        else if (gojo.animationState === "move") {
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
            // if (gojo.direction === "left")
            //     dispatch(gojoSlice.actions.setPositioningSide("right"))
            // setGojoStyle({
            //     animation: "gojo-running .4s steps(1) infinite",
            // })
            // setTimeout(() => {
            //     if (gojo.direction === "left") dispatch(gojoSlice.actions.setPositioningSide("left"))
            //     dispatch(gojoSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (gojo.animationState === "entry") { // requires reverse positioning
            if (gojo.direction === "right")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            if (gojo.direction === "left")
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
        else if (gojo.animationState === "gojo-kick-combo") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-kick-combo 3s steps(1)",
            })
            setTimeout(() => {
                if (gojo.direction === "left")
                    dispatch(gojoSlice.actions.setPositioningSide("left"))
                dispatch(gojoSlice.actions.setAnimationState("stance"))
            }, 3000);
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
        else if (gojo.animationState === "domain-pose") { // requires reverse positioning
            if (gojo.direction === "left")
                dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "domain-pose .3s steps(1) forwards",
            })
            // setTimeout(() => {
            //     if (gojo.direction === "left")
            //         dispatch(gojoSlice.actions.setPositioningSide("left"))
            //     dispatch(gojoSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (gojo.animationState === "take-damage") { // requires reverse positioning
            // if (gojo.direction === "left")
            //     dispatch(gojoSlice.actions.setPositioningSide("right"))
            setGojoStyle({
                animation: "gojo-take-damage .5s steps(1) forwards",
            })
            // setTimeout(() => {
            //     if (gojo.direction === "left")
            //         dispatch(gojoSlice.actions.setPositioningSide("left"))
            //     dispatch(gojoSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }

        else {
            console.log("Unknown animation: ", gojo.animationState)
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
    }, [gojo.animationState]);

    const gojoref = useRef<HTMLDivElement>(null);

    return (
        <>
            <audio src={require("../../Assets/audios/blue.mp3")} ref={blueSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/red-short.mp3")} ref={redSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple.mp3")} ref={purpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple-short.mp3")} ref={shortPurpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/hq-explosion-6288.mp3")} ref={purpleExplosionSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/punch.mp3")} ref={punchSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/gojo.mp3")} ref={domainSoundEffectRef}></audio>

            <div className="stun-div" style={{
                display: gojo.domainStatus.isActive ? "block" : "none",
                position: "absolute",
                zIndex: 10, left: rivalState.x - 25, top: rivalState.y - 135,
                width: 75, height: 75
            }}>

            </div>

            <div className="animation-container" style={{
                top: "50%",
                left: gameSettings.selectedCharacter === "gojo" ? "25%" : "75%",

            }}
                ref={panelRef}>
                <div className="line"></div>
                <div className="panel">
                    <img src={require("../../Assets/gojopanel.png")} alt="Manga Panel" />
                </div>
            </div>

            <div className="animation-container" style={{
                top: "50%",
                left: "50%",
            }}
                ref={domainClashPanelRef}>
                <div className="line"></div>
                <div className="panel">
                    <img src={require("../../Assets/domainclashpanel.png")} alt="Manga Panel" />
                </div>
            </div>



            <div className="rct-body"
                style={{
                    left: gojo.x, top: RCT.rctMode === "body" ? gojo.y + 15 : gojo.y,
                    translate: gojo.direction === "right" ? "-10px -100%" : "0px -100%",
                    display: RCT.rctActive ? "block" : "none",
                    animation: RCT.rctMode === "body" ? "rct-heal 1s steps(17) infinite" : "rct-ct 1s steps(19) infinite"
                }}
            // animation: rct-heal 1s steps(17) infinite;
            // animation: rct-ct 1s steps(19) infinite;
            ></div>
            <div className="simple-domain" style={{
                display: gojo.simpleDomain.isActive ? "block" : "none",
                left: gojo.x - 40, top: 525
            }}>
            </div>
            <div className="falling-blossom-emotion" style={{
                display: gojo.fallingBlossomEmotion.isActive ? "block" : "none",
                left: gojo.direction === "right" ? gojo.x - 15 : gojo.x - 10,
                top: gojo.y - 110,
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
            }}>
            </div>

            <div className="domain-starter" ref={domainStarter}
                style={{ top: gojo.y - 50, left: gojo.x + 20 }}
            ></div>
            <div className="hole" style={{
                display: holeStyle.display,
                left: holeStyle.left,
                top: holeStyle.top
            }}>

            </div>
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


            <div ref={gojoref} className="gojoCC" style={{
                bottom: gameAreaHeight - gojo.y,
                left: gojo.positioningSide === "left" ? gojo.x : undefined,
                right: gojo.positioningSide === "right" ? 1400 - gojo.x - 66 : undefined,
                display: gojo.health.currentHealth > 0 ? "block" : "none",
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
                animation: gojoStyle.animation,
                transition: gojo.transition,
            }}>
                <div className="infinity" style={{
                    top: 0,
                    left: gojo.positioningSide === "left" ? -10 : undefined,
                    right: gojo.positioningSide === "right" ? 20 : undefined,
                    // translate: gojo.direction === "right" ? "-10px -100%" : "0px -100%",
                    display: gojo.infinity ? "block" : "none",
                    transition: gojo.transition,
                }}
                ></div>
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
                {/* <img src={require(`../../Assets/guard.png`)} alt="" style={{
                    display: gojo.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -15,
                    height: 120, width: 120, opacity: 0.8, scale: "1",
                    transform: "translate(-10%,0)"
                }} /> */}
                <div className="gojo-domain-amplification" style={{
                    display: gojo.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -13,
                    transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
                }} />

            </div>
        </>
    );
};

export default Gojo;

