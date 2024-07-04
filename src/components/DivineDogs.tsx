import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveNue, nueActivity, nueAttacking, setNueDirection } from "../redux/NueSlice";
import { setCanMove, updateHealth } from "../redux/character-slices/SukunaSlice";
import megumiSlice, { changeCursedEnergy, toggleDivineDogsAttackCD } from "../redux/character-slices/MegumiSlice";
import { divineDogsActivity, divineDogsAttacking, moveDivineDogs, setDivineDogsDirection, setWolfAuto } from "../redux/DivineDogsSlice";
import React from "react";
import gameSettingsSlice from "../redux/GameSettingsSlice";
import { AppDispatch } from "../redux/GlobalStore";
import "../Megumi.css";

const surfaceY = 560;
const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callDivineDogsCost = 40;
// const nueAttackCost = 10;
const divineDogsDamage = 150;
// const shikigamiDrainingCost = 4;
const defaultNueTransform = "all .5s ease-in, transform 0s";


const DivineDogs = ({ rivalSlice, rivalState }) => {

    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const keysPressed = useRef({ l: false });
    // const [imageSrc, setImageSrc] = useState(require('../Assets/nue-side.png'));
    // const [imageStyle, setImageStyle] = useState({
    //     transition: "all .2s ease, transform 0s",
    //     transform: "",
    // });
    const [wolfStyle, setWolfStyle] = useState({ transition: defaultNueTransform, animation: "" });
    const [wolf2Style, setWolf2Style] = useState({ transition: defaultNueTransform, animation: "" });
    const [whiteDivineDogPosition, setWhiteDivineDogPosition] = useState({ x: 200, y: 300 });
    const [blackDivineDogSidePosition, setBlackDivineDogSidePosition] = useState("stop"); // right, left, sukuna, stop
    const [whiteDivineDogSidePosition, setWhiteDivineDogSidePosition] = useState("stop"); // right, left, sukuna, stop
    const [whiteDogDirection, setWhiteDogDirection] = useState("right"); // right, left, sukuna, stop
    const [blackDogDirection, setBlackDogDirection] = useState("right"); // right, left, sukuna, stop
    const slashSoundEffectRef = React.useRef(null);
    const wolfSoundEffectRef = React.useRef(null);




    const divineDogsSound = new Audio(require("../Assets/audios/wolf.mp3"))


    const nueIntervalRef = useRef(null);

    // const startNueInterval = () => {
    //     // Interval zaten çalışıyorsa başlatma
    //     if (nueIntervalRef.current !== null) return;

    //     nueIntervalRef.current = setInterval(() => {
    //         if (megumi.cursedEnergy >= 5) dispatch(changeCursedEnergy(-shikigamiDrainingCost));
    //         else {
    //             dispatch(nueActivity(false));
    //             stopInterval(nueIntervalRef)
    //         }
    //     }, 1000);
    // };


    const stopInterval = (ref) => {
        // Interval çalışmıyorsa durdurma
        if (ref.current === null) return;

        clearInterval(ref.current);
        ref.current = null;
    };

    useEffect(() => {
        if (megumi.cursedEnergy <= 0) {
            stopInterval(nueIntervalRef);
            dispatch(nueActivity(false));
        }
    }, [megumi.cursedEnergy]);

    const moveDivineDogsToRival = () => {
        setBlackDivineDogSidePosition("sukuna");
        setWhiteDivineDogSidePosition("sukuna");
    };
    const divineDogsAttackEffects = () => {
        slashSoundEffectRef.current.volume = 0.5;
        dispatch(divineDogsAttacking(true));
        slashSoundEffectRef.current.play();
        setTimeout(() => {
            dispatch(divineDogsAttacking(false));
        }, 250)
    };

    function divineDogsAttack() {
        // if (megumi.cursedEnergy < callDivineDogsCost) return;
        dispatch(changeCursedEnergy(-callDivineDogsCost)); // reduce cursed energy by cost
        dispatch(megumiSlice.actions.setAnimationState("callDivineDogs"))
        dispatch(megumiSlice.actions.setCanMove(false))
        dispatch(megumiSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(megumiSlice.actions.setCanMove(true))
            dispatch(megumiSlice.actions.setAnimationBlocker(false))
            dispatch(megumiSlice.actions.setAnimationState("stance"))
        }, 1000);
        wolfSoundEffectRef.current.volume = 0.5
        wolfSoundEffectRef.current.play()
        let attackDirection = "";
        attackDirection = megumi.x < rivalState.x ? "right" : "left"; // direction of attack
        setWhiteDogDirection(attackDirection);
        setBlackDogDirection(attackDirection);
        dispatch(setDivineDogsDirection(attackDirection));
        dispatch(moveDivineDogs({ x: attackDirection === "right" ? megumi.x + 30 : megumi.x - 100, y: surfaceY - 37 })); // shikigami appears at megumi's position
        setWhiteDivineDogPosition({ x: attackDirection === "right" ? megumi.x + 50 : megumi.x - 80, y: surfaceY - 37 });
        setTimeout(() => {
            dispatch(divineDogsActivity(true)); // shikigami activate
            setWolfStyle({ ...wolfStyle, animation: "divineDogBlack 4s steps(1)" });
            setWolf2Style({ ...wolf2Style, animation: "divineDogWhite 4s steps(1)" });
        }, 200);


        // divine dogs updates
        // setWolfStyle({ ...wolfStyle, transition: "all .5s ease" });
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });

        setTimeout(() => { // **1 seconds of sleep for divine dogs sound effect
            // dispatch(setCanMove(false)) // FIRST ATTACK
            moveDivineDogsToRival();

            setTimeout(() => { // 250 ms sleep for attack
                // setFirstAttack(false)
                divineDogsAttackEffects(); // sound and image effect

                setBlackDogDirection("right");
                setBlackDivineDogSidePosition("right");
                setWhiteDogDirection("left");
                setWhiteDivineDogSidePosition("left");

                dispatch(rivalSlice.actions.updateHealth(-divineDogsDamage))

                setTimeout(() => { // 250 ms sleep for attack / SECOND ATTACK
                    setBlackDogDirection("left");
                    setWhiteDogDirection("right");

                    moveDivineDogsToRival();

                    setTimeout(() => { // 250 ms sleep for attack
                        divineDogsAttackEffects(); // sound and image effect
                        setBlackDogDirection("left");
                        setBlackDivineDogSidePosition("left");
                        setWhiteDogDirection("right");
                        setWhiteDivineDogSidePosition("right");

                        dispatch(rivalSlice.actions.updateHealth(-divineDogsDamage))
                        setTimeout(() => {
                            setTimeout(() => {
                                setTimeout(() => {
                                    dispatch(divineDogsActivity(false));
                                    setWolfStyle({ ...wolfStyle, transition: defaultNueTransform });
                                    setWolf2Style({ ...wolf2Style, transition: defaultNueTransform });
                                    // dispatch(setCanMove(true))
                                    setBlackDivineDogSidePosition("stop")
                                    setWhiteDivineDogSidePosition("stop")
                                }, 250);
                            }, 1000);
                        }, 500)
                    }, 500)
                }, 500)
            }, 500)
        }, 2000)
    }

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
            if (keysPressed.current.l) {
                if (divineDogs.isActive === false && megumi.cursedEnergy.currentCursedEnergy >= callDivineDogsCost && !sukuna.domainAttack
                    && megumi.divineDogsCD.isReady
                ) {
                    dispatch2(toggleDivineDogsAttackCD());
                    divineDogsAttack();
                }
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue.isAttacking, nue, megumi.cursedEnergy, sukuna.domainAttack, megumi.divineDogsCD]);


    useEffect(() => {
        if (divineDogs.wolfAuto) {
            if (divineDogs.isActive === false && megumi.cursedEnergy.currentCursedEnergy >= callDivineDogsCost && !sukuna.domainAttack
                && megumi.divineDogsCD.isReady
            ) {
                dispatch2(toggleDivineDogsAttackCD());
                divineDogsAttack();
                dispatch(setWolfAuto(false))
            }
        }

    }, [divineDogs.wolfAuto]);



    return (
        <div>
            <audio src={require("../Assets/audios/claw.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../Assets/audios/wolf.mp3")} ref={wolfSoundEffectRef}></audio>


            <div
                className="divine-dog-black"
                style={{
                    position: "absolute",
                    opacity: divineDogs.isActive ? "1" : "0",
                    top: blackDivineDogSidePosition === "stop" ? divineDogs.y :
                        (blackDivineDogSidePosition === "sukuna" ? surfaceY - 60 : surfaceY - 37),
                    left: blackDivineDogSidePosition === "stop" ? divineDogs.x :
                        (blackDivineDogSidePosition === "left" ? rivalState.x - 90 :
                            (blackDivineDogSidePosition === "right" ? rivalState.x + 50 :
                                (blackDivineDogSidePosition === "sukuna" ? rivalState.x - 30 : 0))),
                    transform: blackDogDirection === "right" ? "scaleX(1)" : "scaleX(-1)",
                    ...wolfStyle,
                }}>
            </div>
            <div
                className="divine-dog-white"
                style={{
                    position: "absolute",
                    opacity: divineDogs.isActive ? "1" : "0",// right, left, sukuna, stop
                    top: whiteDivineDogSidePosition === "stop" ? whiteDivineDogPosition.y :
                        (whiteDivineDogSidePosition === "sukuna" ? surfaceY - 60 : surfaceY - 37),
                    left: whiteDivineDogSidePosition === "stop" ? whiteDivineDogPosition.x :
                        (whiteDivineDogSidePosition === "left" ? rivalState.x - 90 :
                            (whiteDivineDogSidePosition === "right" ? rivalState.x + 50 :
                                (whiteDivineDogSidePosition === "sukuna" ? rivalState.x - 30 : 0))),
                    transform: whiteDogDirection === "right" ? "scaleX(1)" : "scaleX(-1)",
                    ...wolf2Style,
                }}>


            </div>
        </div>
    );
};

export default DivineDogs;
