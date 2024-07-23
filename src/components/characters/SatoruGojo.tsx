import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gojoSlice, { toggleBlueCD, togglePurpleCD, toggleRedCD } from "../../redux/character-slices/GojoSlice";
import sukunaSlice from "../../redux/character-slices/SukunaSlice";
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
    const keysPressed = useRef({ s: false, e: false, r: false, j: false, k: false, l: false, u: false, f: false, g: false, shift: false });
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
                                dispatch(rivalSlice.actions.updateHealth(-1000));
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
                    dispatch(rivalSlice.actions.setHardStun(false))
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
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && !sukuna.domainAttack && !gojo.isJumping
                ) {
                    console.log("er")
                    dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
                    dispatch2(togglePurpleCD());
                    purpleAttack();
                }
            }
            else if (keysPressed.current.e && !sukuna.domainAttack && gojo.blueCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -blueCost && !sukuna.domainAttack
                    && !gojo.isJumping) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleBlueAttack(isShiftPressed);
                    } else {
                        handleBlueAttack(isShiftPressed);
                    }
                }
            }
            else if (keysPressed.current.r && !sukuna.domainAttack && gojo.redCD.isReady) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -redCost && !gojo.isJumping) {
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

            if (keysPressed.current.f) {
                // dispatch(gojoSlice.actions.setAnimationState("gojo-entry"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-punch-combination"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-blue"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-red"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));
                // dispatch(gojoSlice.actions.setAnimationState("gojo-kick-combo"));
                handleDomainExpansion();

            }
            if (keysPressed.current.g) {
                dispatch(gojoSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 250, timeout: 300
                }));
                // handleTakeDamage(true, 500, 10, 500)
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
        sukuna.domainAttack, gojo.x, gojo.blueCD, gojo.redCD, gojo.purpleCD, gojo.domainCD, gojo.canMove, gojo.isJumping]);


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
    gojo.health.currentHealth, gojo.redCD.isReady, gojo.blueCD.isReady, gojo.purpleCD.isReady, gojo.domainCD.isReady,
    rivalState.health.currentHealth, gojo.cursedEnergy.currentCursedEnergy >= -blueCost || gojo.cursedEnergy.currentCursedEnergy >= -redCost
    || gojo.cursedEnergy.currentCursedEnergy >= -purpleCost, comboPicker]);


    const domainStarter = useRef(null)

    const handleDomainExpansion = useCallback(() => {
        dispatch(gojoSlice.actions.setAnimationState("domain-pose"));
        dispatch(gojoSlice.actions.setHardStun(true));
        domainSoundEffectRef.current.play();

        dispatch(rivalSlice.actions.setDevStun(true));

        if (domainStarter.current) {
            dispatch(gojoSlice.actions.setHardStun(true))
            setTimeout(() => {
                domainStarter.current.style.scale = 300;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setDomainState("open"));
                    domainStarter.current.style.transition = "all 0s";
                    domainStarter.current.style.scale = 0;

                    dispatch(gojoSlice.actions.setHardStun(false));
                    setTimeout(() => {
                        dispatch(gojoSlice.actions.setAnimationState("stance"));
                    }, 1000);
                }, 6000);
            }, 1000);
        }
        setTimeout(() => {
            // domainStarter.current.style.scale = 1;
            dispatch(gojoSlice.actions.setHardStun(false))
        }, 5000)
    }, [gojo.x])

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
        if (gojo.purpleCD.isReady) {
            dispatch(gojoSlice.actions.setCanMove(false));
            dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
            dispatch2(togglePurpleCD());
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
            setChaseForCloseCombat(true)
            if (punchCount === 1 || punchCount === 4 || punchCount === 7 || punchCount === 10 || punchCount === 13) {
                dispatch(rivalSlice.actions.updateHealth(-10));
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 100);
            }

            else if (punchCount === 16) { // last hit
                // dispatch(rivalSlice.actions.updateHealth(-20));
                dispatch(rivalSlice.actions.moveCharacterWD(
                    { x: attackDirection === "right" ? 30 : -30, y: 0 }
                ));
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))
                clearInterval(int)
            }
            punchCount++;
        }, 1000 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            dispatch(gojoSlice.actions.setAnimationBlocker(false))
            dispatch(rivalSlice.actions.setCanMove(true)); //**********
            dispatch(rivalSlice.actions.setAnimationBlocker(false))
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
                if (gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && gojo.purpleCD.isReady)
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
        if (obj.isTakingDamage) {
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback);
        }
    }, [gojo.takeDamage.isTakingDamage === true])
    const handleTakeDamage = useCallback((takeDamageAnimationCheck, timeout, damage, knockback) => {
        dispatch(gojoSlice.actions.updateHealth(-damage));
        if (knockback && knockback > 0)
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
                dispatch(gojoSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 0 }));
            }, 500 + timeout);
        }
    }, [gojo.direction]);
    useEffect(() => {
        const obj = gojo.takeDamage;
        if (obj.isTakingDamage) {
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback);
        }
    }, [gojo.takeDamage.isTakingDamage === true])

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
                animation: "domain-pose 1s steps(1) forwards",
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



    return (
        <>
            <audio src={require("../../Assets/audios/blue.mp3")} ref={blueSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/red-short.mp3")} ref={redSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple.mp3")} ref={purpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple-short.mp3")} ref={shortPurpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/hq-explosion-6288.mp3")} ref={purpleExplosionSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/punch.mp3")} ref={punchSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/gojo.mp3")} ref={domainSoundEffectRef}></audio>


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

            <div className="gojoCC" style={{
                bottom: gameAreaHeight - gojo.y,
                left: gojo.positioningSide === "left" ? gojo.x : undefined,
                right: gojo.positioningSide === "right" ? 1400 - gojo.x - 66 : undefined,
                display: gojo.health.currentHealth > 0 ? "block" : "none",
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
                animation: gojoStyle.animation,
                transition: gojo.transition,
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

