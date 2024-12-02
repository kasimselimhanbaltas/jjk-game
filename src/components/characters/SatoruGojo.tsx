import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gojoSlice, { toggleBlueCD, toggleDomainCD, toggleRedCD, toggleSimpleDomainCD } from "../../redux/character-slices/GojoSlice";
import gameSettingsSlice from "../../redux/GameSettingsSlice";
import React from "react";
import { AppDispatch } from "../../redux/GlobalStore";
import "../../Gojo.css";
import tutorialSlice from "../../redux/TutorialSlice";

const SURFACE_Y = parseInt(process.env.REACT_APP_SURFACE_Y);
// Define the props interface
interface GojoProps {
    xDistance: number;
    rivalState: any;  // You can replace 'any' with the actual type if you know it
    rivalSlice: any;  // Same as above, replace 'any' with the correct type
}

// Pass the interface as the prop type to the Gojo component
const Gojo: React.FC<GojoProps> = memo(({ xDistance, rivalState, rivalSlice }) => {

    const gojo = useSelector((state: any) => state.GojoState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);
    const tutorialState = useSelector((state: any) => state.TutorialState);


    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const characterWidth = 120;
    const characterHeight = 180;
    const keysPressed = useRef({
        s: false, e: false, r: false, j: false, k: false, l: false, u: false, f: false, g: false, shift: false,
        z: false, x: false, c: false, v: false, space: false
    });
    const gameAreaWidth = 1400;
    const gameAreaHeight = 600;

    const blueCost = -50;
    const chargedBlueCost = -100;
    const redCost = -100;
    const chargedRedCost = -150;
    const purpleCost = -150;
    // Sound effects
    const blueSoundEffectRef = React.useRef(null);
    const redSoundEffectRef = React.useRef(null);
    const purpleSoundEffectRef = React.useRef(null);
    const shortPurpleSoundEffectRef = React.useRef(null);
    const purpleExplosionSoundEffectRef = React.useRef(null);
    const punchSoundEffectRef = React.useRef(null);
    const domainSoundEffectRef = React.useRef(null);
    const blackFlashEffectRef = React.useRef(null);


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
                    // dispatch(gojoSlice.actions.setAnimationBlocker(true))1
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
                            // dispatch(gojoSlice.actions.setAnimationBlocker(false))
                            // dispatch(gojoSlice.actions.setAnimationState("stance"))
                            dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
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
                                    isTakingDamage: true, damage: 1000, takeDamageAnimationCheck: true, knockback: 100, timeout: 300, animation: "", animationPriority: 11
                                }))
                                dispatch(gojoSlice.actions.setTakeDamage({
                                    isTakingDamage: true, damage: 200, takeDamageAnimationCheck: true, knockback: 100, timeout: 300, animation: "bypass", animationPriority: 11
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
                                    dispatch(gojoSlice.actions.setHardStun(false))
                                    dispatch(rivalSlice.actions.setHardStun(false))
                                    dispatch(gojoSlice.actions.setGravity(5))
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
        x: 0, y: 0, scale: 0.3, display: "none", attacking: false,
        transition: "all .2s ease, transform 4s",
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
    const [blueInGojosHands, setBlueInGojosHands] = useState(true)
    const blueAttack = (isShiftPressed, gojoPosX) => {
        blueSoundEffectRef.current.volume = 0.5;
        blueSoundEffectRef.current.play();

        dispatch(gojoSlice.actions.setAnimationState({ animation: "gojo-blue", animationPriority: 10, finishAnimation: false }));
        dispatch(gojoSlice.actions.setCanMove(false))
        dispatch(gojoSlice.actions.setGravity(0))
        dispatch(gojoSlice.actions.setTransition("all 0.2s ease 0s, transform 0s ease 0s, top 1s ease, bottom 1s ease"))
        dispatch(gojoSlice.actions.moveCharacter({ x: 0, y: -50 }))
        let blueW = 155;
        let blueX = gojo.direction === "right" ?
            gojoPosX + (isShiftPressed ? 550 : 450) - blueW : gojoPosX + (isShiftPressed ? -300 : -100) - blueW;
        let blueY = (isShiftPressed ? SURFACE_Y - 250 : SURFACE_Y - 200); // -160 / -260
        console.log("calculated blue y position: ", (isShiftPressed ? SURFACE_Y - 160 : SURFACE_Y - 260))
        dispatch(gojoSlice.actions.setBluePosition({ x: blueX, y: blueY }))
        setBlueStyle(prevState => ({
            ...prevState,
            display: "block",
            animation: "preparing-blue 1.5s steps(5)",
            transition: "all 1s ease"
        }))
        setBlueInGojosHands(true);
        setTimeout(() => { // start to move blue
            // in this moment, gojo changes his animation to gojo-blue from gojo-blue-first-pose
            setBlueInGojosHands(false); // blue is leaving gojo's hands
            setBlueStyle(prevState => ({ // move blue to destination in 1 second
                ...prevState, x: blueX, y: blueY,
                animation: "moving-blue .75s steps(5)"
            }))
            dispatch(gojoSlice.actions.setBlueAttackMoment(true))
            setTimeout(() => { //start to loop blue
                dispatch(gojoSlice.actions.setBlueAttackMoment(false))
                console.log("bat")
                // dispatch(gojoSlice.actions.setBlueAttackMoment(true)) // old pos
                setBlueStyle(prevState => ({
                    ...prevState,
                    animation: "looping-blue .5s steps(3) infinite"
                }))
                if (isShiftPressed) { // charge blue and make it stay longer
                    setMergeRedAndBlue(prevState => ({ ...prevState, blue: true }))
                    setTimeout(() => {
                        setMergeRedAndBlue(prevState => ({ ...prevState, blue: false }))
                        setBlueStyle(prevState => ({
                            ...prevState, animation: "exploding-blue .3s steps(3)",
                        }))
                        setTimeout(() => {

                            setBlueStyle(prevState => ({
                                ...prevState, display: "none",
                            }))
                            setTimeout(() => {
                                setBlueStyle(prevState => ({
                                    ...prevState, animation: "",
                                }))
                                // dispatch(gojoSlice.actions.setBlueAttackMoment(false))
                                setBlueInGojosHands(true);
                            }, 100);
                        }, 300);
                    }, 15000); // 15 seconds of stay
                } else {
                    setTimeout(() => {
                        setBlueStyle(prevState => ({
                            ...prevState, animation: "exploding-blue .3s steps(3)",
                        }))
                        setTimeout(() => {
                            setBlueStyle(prevState => ({
                                ...prevState, display: "none",
                            }))
                            setTimeout(() => {
                                setBlueStyle(prevState => ({
                                    ...prevState, animation: "",
                                }))
                                setBlueInGojosHands(true);
                                dispatch(gojoSlice.actions.setBlueAttackMoment(false))
                            }, 100);
                        }, 300);
                    }, 2000);
                }

                // gojo animation finished
                // dispatch(gojoSlice.actions.setAnimationBlocker(false))
                // dispatch(gojoSlice.actions.setAnimationState("gojo-stance"))
                dispatch(gojoSlice.actions.setCanMove(true))
                dispatch(gojoSlice.actions.setGravity(5))
                dispatch(gojoSlice.actions.setTransition("all 0.2s ease 0s, transform 0s ease 0s"))
            }, 750);
        }, 1500)
    }

    const redAttack = (isShiftPressed, gojoPosX) => {
        redSoundEffectRef.current.volume = 0.5;
        redSoundEffectRef.current.play();
        dispatch(gojoSlice.actions.setAnimationState({ animation: isShiftPressed ? "gojo-red-vertical" : "selim-red", animationPriority: 5, finishAnimation: false }));
        // dispatch(gojoSlice.actions.setAnimationState(isShiftPressed ? "gojo-red-vertical" : "gojo-red-horizontal"))
        dispatch(gojoSlice.actions.setCanMove(false))
        // dispatch(gojoSlice.actions.setAnimationBlocker(true))
        let redW = 100;
        let redH = 200;
        let redX = gojo.direction === "right" ?
            gojoPosX + (isShiftPressed ? 30 : 150) - redW :
            gojoPosX + (isShiftPressed ? 35 : -100) - redW;
        console.log("gojoPosX: ", gojoPosX, "redX", Math.abs(gojoPosX - redX))
        let redY = (isShiftPressed ? SURFACE_Y - redH - 150 : SURFACE_Y - redH + 35);

        setTimeout(() => { // animation not finished yet

            if (isShiftPressed) { // charge red and make it stay longer)
                setTimeout(() => { // 2800
                    // dispatch(gojoSlice.actions.setRedAttackMoment(false))
                    dispatch(gojoSlice.actions.setCanMove(true))
                    // dispatch(gojoSlice.actions.setAnimationBlocker(false))
                    setRedStyle(prevState => ({
                        ...prevState,
                        visibility: "visible",
                        animation: "red-itself .3s steps(1) infinite",
                        x: redX,
                        scale: "1",
                        y: redY, attacking: true,
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
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setRedAttackMoment(true)) // handle skillshot damage in gamearea

                    setTimeout(() => {
                        // setRedStyle(prevState => ({
                        //     ...prevState, x: gojoPosX, attacking: false,
                        //     transition: "all .2s ease, transform 4s, top 0s, left 0s",
                        //     animation: ""
                        // }))
                        dispatch(gojoSlice.actions.setRedAttackMoment(false))
                        dispatch(gojoSlice.actions.setCanMove(true))
                        // dispatch(gojoSlice.actions.setAnimationBlocker(false))
                    }, 300);
                }, 100);
            }
        }, 1500)
    }

    const purpleAttack = () => {
        shortPurpleSoundEffectRef.current.volume = 0.5;
        setTimeout(() => {
            shortPurpleSoundEffectRef.current.play();
        }, 600);
        // dispatch(gojoSlice.actions.setAnimationState("gojo-makingPurple"));
        dispatch(gojoSlice.actions.setAnimationState({ animation: "gojo-makingPurple", animationPriority: 10, finishAnimation: false }));

        dispatch(gojoSlice.actions.setCanMove(false))
        // dispatch(gojoSlice.actions.setAnimationBlocker(true))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))
        dispatch(rivalSlice.actions.setAnimationBlocker(false))
        // dispatch(rivalSlice.actions.setAnimationState("stance"))
        dispatch(rivalSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: false }));

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

            // dispatch(gojoSlice.actions.setAnimationBlocker(false))
            // dispatch(gojoSlice.actions.setAnimationState("stance"));
            dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
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


    const [inputBuffer, setInputBuffer] = useState<string[]>([]);

    // Function to add inputs to buffer with a limit (e.g., 4 inputs)
    const addInputToBuffer = (input: string) => {
        setInputBuffer((prev) => {
            const newBuffer = [...prev, input];
            return newBuffer.slice(-4); // Limit buffer to last 4 inputs
        });
    };

    // GOJO KEYBOARD CONTROL
    useEffect(() => {
        if (gameSettings.selectedCharacter !== "gojo") return;
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = true;
            if (key === " " && gojo.animationState !== "dash") {
                // dispatch(sukunaSlice.actions.setAnimationState("dash"));
                dispatch(gojoSlice.actions.setAnimationState({ animation: "dash", animationPriority: 1, finishAnimation: false }));
            }
            addInputToBuffer(key);
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = false;
            if (key === " " && gojo.animationState === "dash") {
                // dispatch(sukunaSlice.actions.setAnimationState("dash"));
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 1, finishAnimation: true }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const intervalId = setInterval(() => {
            if (gameSettings.selectedCharacter !== "gojo") return;
            if (keysPressed.current.e && keysPressed.current.r && !rivalState.domainAttack && gojo.redCD.isReady && gojo.blueCD.isReady && !gojo.rct.rctActive) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -purpleCost && !rivalState.domainAttack && !gojo.isJumping
                    && !gojo.fallingBlossomEmotion.isActive
                ) {
                    console.log("er")
                    dispatch(gojoSlice.actions.changeCursedEnergy(purpleCost));
                    dispatch2(toggleRedCD());
                    dispatch2(toggleBlueCD());
                    purpleAttack();
                }
            }
            else if (keysPressed.current.e && !rivalState.domainAttack && gojo.blueCD.isReady && !gojo.rct.rctActive) {
                if (gojo.canMove === true && gojo.cursedEnergy.currentCursedEnergy >= -blueCost && !rivalState.domainAttack
                    && !gojo.isJumping && !gojo.fallingBlossomEmotion.isActive) {
                    const isShiftPressed = keysPressed.current.shift ? true : false;
                    if (isShiftPressed && gojo.cursedEnergy.currentCursedEnergy >= -chargedBlueCost) {
                        handleBlueAttack(isShiftPressed);
                    } else {
                        handleBlueAttack(isShiftPressed);
                    }
                }
            }
            else if (keysPressed.current.r && !rivalState.domainAttack && gojo.redCD.isReady && !gojo.rct.rctActive) {
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
            else if (keysPressed.current.j && !rivalState.domainAttack && gojo.canMove && !gojo.isJumping) {
                if (keysPressed.current.s)
                    kickCombo();
                else punchCombo();
            }
            else if (keysPressed.current.k && !rivalState.domainAttack && gojo.canMove && !gojo.isJumping) {
                blackFlashCombo();
            }
            else if (keysPressed.current.l && !rivalState.domainAttack && gojo.canMove && !gojo.isJumping
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
            //         isTakingDamage: true, damage: 200, takeDamageAnimationCheck: true, knockback: 250, timeout: 300, animation: ""
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
        rivalState.domainAttack, gojo.x, gojo.blueCD, gojo.redCD, gojo.domainCD, gojo.canMove, gojo.isJumping,
        RCT, rctCD, gojo.rct.rctActive, gojo.simpleDomain, gojo.fallingBlossomEmotion, gojo.domainAmplification.isActive]);

    const [domainClashCDref, setDomainClashCDref] = useState(false);
    const [domainBugFixer, setDomainBugFixer] = useState(false);
    const [domainHit, setDomainHit] = useState(false);

    // *** ULTRA DOMAIN HANDLER
    useEffect(() => {

        if (gameSettings.domainClash && gojo.domainCD.isReady && gojo.cursedEnergy.currentCursedEnergy >= 200) {
            console.log("udh: satoru1", gameSettings.domainClash)
            handleDomainExpansion();
            dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
            dispatch(gameSettingsSlice.actions.setDomainClash(false));
        }
        else if (gojo.domainStatus.isInitiated === true) { // user pressed domain expansion key or bot initiated domain
            console.log("udh: satoru2")
            dispatch(gojoSlice.actions.setCanMove(false));
            dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: false }))
            if (gameSettings.domainClashReady) { // rival already initiated domain
                console.log("udh: satoru21")
                dispatch(gameSettingsSlice.actions.setDomainClash(true));
                if (tutorialState.tutorialMode) {
                    dispatch(tutorialSlice.actions.completeOneTaskInTutorial({
                        tutorialIndex: tutorialState.currentTaskIndex, taskIndex: 0, character: gameSettings.selectedCharacter
                    }));
                }
            }
            else {
                console.log("udh: satoru22")
                dispatch(gameSettingsSlice.actions.setDomainClashReady(true));
                setTimeout(() => {
                    setDomainClashCDref(true);
                    dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
                }, 2000);
            }
        }
        else if (gojo.domainStatus.forceExpand) {
            console.log("udh: satoru3")
            handleDomainExpansion();
        }
        else {
            console.log("udh: satoru4")
            if (domainBugFixer && domainClashCDref && gojo.domainCD.isReady && gojo.cursedEnergy.currentCursedEnergy >= 200) {
                console.log("udh: satoru5")
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


    const domainStarter = useRef(null);
    const [domainStarterEffect, setDomainStarterEffect] = useState(false);


    const handleDomainExpansion = useCallback(() => {
        setDomainBugFixer(false);
        dispatch2(toggleDomainCD());
        dispatch(gojoSlice.actions.setHardStun(true));
        dispatch(gojoSlice.actions.setInfinity(false));
        // dispatch(gojoSlice.actions.setAnimationState("domain-pose"));
        dispatch(gojoSlice.actions.setAnimationState({ animation: "domain-pose", animationPriority: 20, finishAnimation: false }));
        // dispatch(gojoSlice.actions.setAnimationBlocker(true));
        if (!gameSettings.domainClash) {
            domainPanel();
            dispatch(rivalSlice.actions.setDevStun(true));
        }
        else {
            dispatch(gojoSlice.actions.moveCharacterTo({ x: 250, y: SURFACE_Y }));
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
                    setDomainStarterEffect(true);
                }, 1000);
                setTimeout(() => {

                    if (!gameSettings.domainClash) {
                        setDomainHit(true);
                    }

                    // dispatch(gojoSlice.actions.setAnimationBlocker(false)); // animation blocker false

                    dispatch(gojoSlice.actions.setDomainState(
                        { ...gojo.domainStatus, isActive: true }
                    ));
                    dispatch(gojoSlice.actions.setCanMove(true))

                    dispatch(gojoSlice.actions.setInfinity(true));
                    domainStarter.current.style.transition = "all 0s";
                    domainStarter.current.style.scale = 0;
                    setDomainStarterEffect(false);

                    dispatch(gojoSlice.actions.setHardStun(false));
                    setTimeout(() => {
                        // dispatch(gojoSlice.actions.setAnimationState("stance"));
                        dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 20, finishAnimation: true }));

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
            }
            dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 55 : rivalState.x + 55, y: gojo.y }))
            setChaseForCloseCombat(false)
        }
    }, [chaseForCloseCombat])
    const punchCombo = () => {
        if (Math.abs(xDistance) > 150) return;
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        dispatch(gojoSlice.actions.setAnimationState({ animation: "gojo-punch-combination", animationPriority: 3, finishAnimation: false }));
        dispatch(gojoSlice.actions.setCanMove(false));
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 1 || punchCount === 4 || punchCount === 7 || punchCount === 10 || punchCount === 13) {
                setChaseForCloseCombat(true)
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 3
                }))
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 100);
            }

            else if (punchCount === 14) { // last hit
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 50, timeout: 500, animation: "", animationPriority: 3
                }))
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))
                clearInterval(int)
            }
            punchCount++;
        }, 1000 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
        }, 1000);
    }
    const [blackFlashAnimation, setBlackFlashAnimation] = useState(false);
    const [blackFlashPosition, setBlackFlashPosition] = useState({ x: 0, y: 0, direction: "left" });
    const [getBFpositionBool, setGetBFpositionBool] = useState(false);
    useEffect(() => {
        if (getBFpositionBool) {
            setBlackFlashPosition({ x: gojo.direction === "right" ? gojo.x - 220 : gojo.x - 280, y: gameAreaHeight - gojo.y, direction: gojo.direction });
            setGetBFpositionBool(false);
        }
    }, [getBFpositionBool])

    const blackFlashCombo = () => {
        if (Math.abs(xDistance) > 200) return;
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        // dispatch(gojoSlice.actions.setAnimationState("gojo-blackflash-combination"));
        dispatch(gojoSlice.actions.setAnimationState({ animation: "gojo-blackflash-combination", animationPriority: 4, finishAnimation: false }));
        dispatch(gojoSlice.actions.setCanMove(false));
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        // dispatch(gojoSlice.actions.setAnimationBlocker(true))
        // if (!rivalState.isBlocking) { // #ff
        //     dispatch(rivalSlice.actions.setHardStun(true));
        //     dispatch(rivalSlice.actions.setAnimationBlocker(false))
        //     dispatch(rivalSlice.actions.setAnimationState("stance"))
        //     // dispatch(rivalSlice.actions.setAnimationBlocker(true))
        // }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 80, y: gojo.y }))
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
                // left: gojo.direction === "right" ? gojo.x - 220 : gojo.x - 280, bottom: gameAreaHeight - gojo.y
                setGetBFpositionBool(true);
                setBlackFlashAnimation(true);
                blackFlashEffectRef.current.play();
                setTimeout(() => {
                    dispatch(rivalSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 250, timeout: 500, animation: "", animationPriority: 11
                    }));
                }, 1000);
                setTimeout(() => {
                    setBlackFlashAnimation(false);
                    dispatch(gojoSlice.actions.setCanMove(true));
                }, 1500);
            }
            punchCount++;
        }, 1500 / 16)

    }
    const kickCombo = () => {
        if (Math.abs(xDistance) > 200) return;
        punchSoundEffectRef.current.volume = 0.5
        dispatch(gojoSlice.actions.setGravity(0)) //gravity
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        // dispatch(gojoSlice.actions.setAnimationState("gojo-kick-combo"));
        dispatch(gojoSlice.actions.setAnimationState({ animation: "gojo-kick-combo", animationPriority: 3, finishAnimation: false }));

        dispatch(gojoSlice.actions.setCanMove(false));
        // dispatch(gojoSlice.actions.setAnimationBlocker(true))
        // if (!rivalState.isBlocking) { // #ff
        //     dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        //     dispatch(rivalSlice.actions.setCanMove(false));
        //     dispatch(rivalSlice.actions.setAnimationBlocker(false))
        //     dispatch(rivalSlice.actions.setAnimationState("stance"))
        //     dispatch(rivalSlice.actions.setAnimationBlocker(true))
        // }
        dispatch(gojoSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 75 : rivalState.x + 35, y: gojo.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 16) { // finish
                dispatch(rivalSlice.actions.setTakeDamage({ isTakingDamage: true, damage: 70, takeDamageAnimationCheck: true, knockback: 50, timeout: 50, animation: "", animationPriority: 3 }));

                // dispatch(rivalSlice.actions.updateHealth(-70));
                // increase ce
                dispatch(gojoSlice.actions.changeCursedEnergy(20))
                clearInterval(int)
            }
            else if (punchCount === 1 || punchCount === 4 || punchCount === 8 || punchCount === 11 || punchCount === 14) {
                punchSoundEffectRef.current.play()
                // dispatch(rivalSlice.actions.moveCharacterWD(
                //     { x: attackDirection === "right" ? 100 : -100, y: 0 }
                // ));
                dispatch(rivalSlice.actions.setTakeDamage({ isTakingDamage: true, damage: 75 / 5, takeDamageAnimationCheck: true, knockback: 50, timeout: 50, animation: "take-damage-short", animationPriority: 3 }));

                if (punchCount === 11) {
                    // dispatch(rivalSlice.actions.setTakeDamage({ isTakingDamage: true, damage: 0, takeDamageAnimationCheck: true, knockback: 50, timeout: 50 }));
                    // dispatch(gojoSlice.actions.moveCharacterTo({ x: gojo.x, y: 500 }))
                    console.log("up")
                }
            }
            else { // last hit
                setChaseForCloseCombat(true)
            }
            console.log(punchCount)
            punchCount++;
        }, 2000 / 16)
        setTimeout(() => { // after animation
            dispatch(gojoSlice.actions.setCanMove(true));
            // dispatch(gojoSlice.actions.setAnimationBlocker(false))
            // dispatch(rivalSlice.actions.setAnimationBlocker(false)) // #ff
            // dispatch(rivalSlice.actions.setCanMove(true));// **********
            dispatch(gojoSlice.actions.setGravity(5)) //gravity
        }, 2000);
    }

    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = gojo.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(gojoSlice.actions.setDirection(attackDirection))
        const randomInterval = 1000; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            console.log("int")
            // if (megumi.health.currentHealth > 0 && rivalState.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && gojo.health.currentHealth > 0 && gojo.canMove && !rivalState.domainAttack) {
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
        if (rivalState.health.currentHealth <= 0 && gameSettings.selectedCharacter !== "sukuna")
            stopAttackInterval();
    }, [rivalState.health.currentHealth > 0]);

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
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback, obj.animation, obj.animationPriority);
        }
    }, [gojo.takeDamage.isTakingDamage === true])

    const handleTakeDamage = useCallback((takeDamageAnimationCheck, timeout, damage, knockback, animation, animationPriority) => {
        console.log("handling take damage")
        const rivalDA = rivalState.domainAmplification.isActive;
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
            || rivalDA || animation !== "")) {
            console.log("***** damage: ", damage)
            dispatch(gojoSlice.actions.updateHealth(-damage));
        }
        console.log("gojo kb: ", knockback)
        if (knockback && knockback > 0) {
            if (!gojo.infinity) {
                dispatch(gojoSlice.actions.moveCharacterWD({ x: gojo.direction === "left" ? knockback : -knockback, y: 0 }))
            }
            else { // infity active
                if (rivalDA)
                    dispatch(gojoSlice.actions.moveCharacterWD({ x: gojo.direction === "left" ? knockback : -knockback, y: 0 }))
            }
        }
        if (takeDamageAnimationCheck && !gojo.animationBlocker && !(gojo.infinity && !rivalDA)) {
            dispatch(gojoSlice.actions.setHardStun(true));
            dispatch(gojoSlice.actions.setAnimationState({ animation: "take-damage", animationPriority: animationPriority, finishAnimation: false }));
            dispatch(gojoSlice.actions.setTransition("all .2s ease, transform 0s, left .8s ease-in-out"));
            setTimeout(() => {
                dispatch(gojoSlice.actions.setHardStun(false)); // ****
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: animationPriority, finishAnimation: true }));
                dispatch(gojoSlice.actions.setTransition("all .2s ease, transform 0s"));
                dispatch(gojoSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 0 }));
            }, 500 + timeout);
        }
        else {
            setTimeout(() => {
                dispatch(gojoSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 0 }));
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
                animation: "gojo-stance 1s steps(4) infinite",
            })
        }
        else if (gojo.animationState === "first-pose") {
            if (gojo.direction === "right")
                setGojoStyle({
                    animation: "gojo-first-pose 1s steps(1) infinite",
                })
        }
        else if (gojo.animationState === "move") {
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
            // if (gojo.direction === "left")
            // setGojoStyle({
            //     animation: "gojo-running .4s steps(1) infinite",
            // })
            // setTimeout(() => {
            //     dispatch(gojoSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (gojo.animationState === "dash") {
            setGojoStyle({
                animation: "gojo-dash 1s steps(1) infinite",
            })
        }
        else if (gojo.animationState === "entry") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-entry 1s steps(8)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 31, finishAnimation: true }));
            }, 1000);
        }
        else if (gojo.animationState === "jump") {
            setGojoStyle({
                animation: "gojo-jump 1.5s steps(1)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 2, finishAnimation: true }));
            }, 1500);
        }
        else if (gojo.animationState === "gojo-punch-combination") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-punch-combination 1s steps(16)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 3, finishAnimation: true }));
            }, 1000);
        }
        else if (gojo.animationState === "gojo-blackflash-combination") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-blackflash-combination 1.5s steps(14) forwards",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 4, finishAnimation: true }));
            }, 3000);
        }
        else if (gojo.animationState === "gojo-kick-combo") { // requires reverse positioning

            setGojoStyle({
                animation: "gojo-kick-combo 2s steps(15)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 3, finishAnimation: true }));
            }, 2000);
        }
        else if (gojo.animationState === "gojo-blue") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-blue-first-pose 1.2s steps(1)",
            })
            setTimeout(() => {
                setGojoStyle({
                    animation: "gojo-blue-pose 0.4s steps(3) forwards",
                })
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
                }, 1200);
            }, 1200);
        }
        else if (gojo.animationState === "selim-red") { // requires reverse positioning
            setGojoStyle({
                animation: "selim-red 1.8s steps(12)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 1800);
        }
        else if (gojo.animationState === "gojo-red-vertical") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-red-vertical 3s steps(1)",
            })
            setTimeout(() => {
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 3000);
        }
        else if (gojo.animationState === "gojo-makingPurple") { // requires reverse positioning
            if (gojo.direction === "left") {
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
                dispatch(gojoSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
            }, 3000);
        }
        else if (gojo.animationState === "domain-pose") { // requires reverse positioning
            setGojoStyle({
                animation: "domain-pose .3s steps(1) forwards",
            })
        }
        else if (gojo.animationState === "take-damage") { // requires reverse positioning
            setGojoStyle({
                animation: "gojo-take-damage .5s steps(2) forwards",
            })
        }
        else {
            console.log("Unknown animation: ", gojo.animationState)
            setGojoStyle({
                animation: "gojo-stance 1s steps(1) infinite",
            })
        }
    }, [gojo.animationState]);

    const gojoref = useRef<HTMLDivElement>(null);
    const actionTriggered = React.useRef(false);

    // Tutorial Effect
    useEffect(() => {
        if (gameSettings.selectedCharacter === "gojo") return;
        if (tutorialState.tutorialMode && !actionTriggered.current) {
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "domain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, isInitiated: true }))
                    setDomainBugFixer(true);
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "forceDomain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setDomainState({ ...gojo.domainStatus, forceExpand: true }))
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "useBlue") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setInfinity(false))
                    setLocalBlueHelper(true)
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "combat") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setInfinity(false))
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "rapid") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setInfinity(false))
                    if (rivalState.characterName === "sukuna")
                        dispatch(rivalSlice.actions.setRapidAttackCounter(10))
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
        }
    }, [tutorialState.currentTaskIndex])

    const lights = Array.from({ length: 50 });
    // const colors = ['red', 'blue'];
    const colors = ['#fa03eb', '#01dfff'];

    return (
        <>
            <audio src={require("../../Assets/audios/blue.mp3")} ref={blueSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/red-short.mp3")} ref={redSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple.mp3")} ref={purpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/purple-short.mp3")} ref={shortPurpleSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/hq-explosion-6288.mp3")} ref={purpleExplosionSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/punch.mp3")} ref={punchSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/gojo.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/black-flash.mp3")} ref={blackFlashEffectRef}></audio>
            {/* <div className='dotot' style={{
                width: "10px", height: "100px", backgroundColor: "black",
                position: "absolute", bottom: gameAreaHeight - gojo.y, left: gojo.x, zIndex: 99, transition: ".2s all"
            }}></div> */}
            <div className="black-flash-front" style={
                {
                    display: blackFlashAnimation ? "block" : "none",
                    left: blackFlashAnimation ? blackFlashPosition.x : (gojo.direction === "right" ? gojo.x - 240 : gojo.x - 240),
                    bottom: blackFlashAnimation ? blackFlashPosition.y : (gameAreaHeight - gojo.y),
                    transform: blackFlashAnimation ? blackFlashPosition.direction : (gojo.direction === "left" ? "scaleX(-1)" : "none"),
                }
            }></div>
            <div className="black-flash-back" style={
                {
                    display: blackFlashAnimation ? "block" : "none",
                    left: blackFlashAnimation ? blackFlashPosition.x : (gojo.direction === "right" ? gojo.x - 240 : gojo.x - 240),
                    bottom: blackFlashAnimation ? blackFlashPosition.y : (gameAreaHeight - gojo.y),
                    transform: blackFlashAnimation ? blackFlashPosition.direction : (gojo.direction === "left" ? "scaleX(-1)" : "none"),
                }
            }></div>

            <div className="center-dot" style={
                { display: domainStarterEffect ? "block" : "none", left: gojo.x + 20, top: gojo.y - 50 }
            }>
                {lights.map((_, index) => {
                    const angle = Math.random() * 360; // Random angle between 0 and 360
                    const animationDelay = Math.random() * 2 + 's'; // Random delay between 0 and 2 seconds
                    return (
                        <div className="light-container"
                            key={index}
                            style={{
                                transform: `rotate(${angle}deg)`,
                            }}>
                            <div
                                className="light"
                                style={{
                                    animationDelay: animationDelay,
                                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                                }}
                            ></div>
                        </div>
                    );
                })}
            </div>

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
                left: gojo.x - 40, top: SURFACE_Y - 35
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
                display: blueStyle.display as "block" | "none",
                // visibility: "visible",
                top: blueInGojosHands ? gojo.y - 44 : blueStyle.y,
                left: gojo.direction === "right" ? (blueInGojosHands ? gojo.x - 25 : blueStyle.x) : (blueInGojosHands ? gojo.x + 25 : blueStyle.x),
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
                top: SURFACE_Y - 85,
                left: purpleStyle.attacking ?
                    (gojo.direction === "left" ? -2500 : 2500) :
                    (gojo.direction === "left" ? gojo.x - 110 : gojo.x - 90),
                transition: purpleStyle.transition,
                transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
            }}> </div>

            <div className="purple-itself" style={{
                // visibility: "visible",
                visibility: purpleItselfStyle.visibility as "visible" | "hidden",
                top: SURFACE_Y - 355,
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

                <div className="gojo-domain-amplification" style={{
                    display: gojo.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -13,
                    transform: gojo.direction === "left" ? "scaleX(-1)" : "none",
                }} />

            </div>
        </>
    );
});

export default Gojo;

