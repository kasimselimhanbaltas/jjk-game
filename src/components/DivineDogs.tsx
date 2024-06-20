import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveNue, nueActivity, nueAttacking, setNueDirection } from "../store/NueSlice";
import { setRivalCanMove, updateRivalHealth } from "../store/SukunaSlice";
import { changeCursedEnergy } from "../store/MegumiSlice";
import { divineDogsActivity, divineDogsAttacking, moveDivineDogs, setDivineDogsDirection } from "../store/DivineDogsSlice";
import React from "react";


const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callDivineDogsCost = 40;
// const nueAttackCost = 10;
const divineDogsDamage = 25;
// const shikigamiDrainingCost = 4;
const defaultNueTransform = "all .5s ease-in, transform 0s";


const DivineDogs = () => {

    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const dispatch = useDispatch();
    const keysPressed = useRef({ l: false });
    // const [imageSrc, setImageSrc] = useState(require('../Assets/nue-side.png'));
    // const [imageStyle, setImageStyle] = useState({
    //     transition: "all .2s ease, transform 0s",
    //     transform: "",
    // });
    const [wolfStyle, setWolfStyle] = useState({ transition: defaultNueTransform });
    const [wolf2Style, setWolf2Style] = useState({ transition: defaultNueTransform });
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
        wolfSoundEffectRef.current.volume = 0.5
        wolfSoundEffectRef.current.play()
        dispatch(moveDivineDogs({ x: megumi.x - 100, y: megumi.y + 50 })); // shikigami appears at megumi's position
        setWhiteDivineDogPosition({ x: megumi.x + 100, y: megumi.y + 50 });
        setTimeout(() => {
            dispatch(divineDogsActivity(true)); // shikigami activate
        }, 1000);
        let attackDirection = "";
        attackDirection = megumi.x < sukuna.x ? "right" : "left"; // direction of attack
        setWhiteDogDirection(attackDirection);
        setBlackDogDirection(attackDirection);

        // divine dogs updates
        // setWolfStyle({ ...wolfStyle, transition: "all .5s ease" });
        dispatch(setDivineDogsDirection(attackDirection));
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });

        setTimeout(() => { // **5 seconds of sleep for divine dogs sound effect
            dispatch(setRivalCanMove(false)) // FIRST ATTACK
            moveDivineDogsToRival();

            setTimeout(() => { // 250 ms sleep for attack
                // setFirstAttack(false)
                divineDogsAttackEffects(); // sound and image effect

                setBlackDogDirection("right");
                setBlackDivineDogSidePosition("right");
                setWhiteDogDirection("left");
                setWhiteDivineDogSidePosition("left");

                dispatch(updateRivalHealth(-divineDogsDamage))

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

                        dispatch(updateRivalHealth(-divineDogsDamage))
                        setTimeout(() => {
                            setTimeout(() => {
                                setTimeout(() => {
                                    dispatch(divineDogsActivity(false));
                                    setWolfStyle({ ...wolfStyle, transition: defaultNueTransform });
                                    dispatch(setRivalCanMove(true))
                                    setBlackDivineDogSidePosition("stop")
                                    setWhiteDivineDogSidePosition("stop")
                                }, 250);
                            }, 1000);
                        }, 500)
                    }, 500)
                }, 500)
            }, 500)
        }, 4000)
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

            if (keysPressed.current.l) {
                if (divineDogs.isActive === false && megumi.cursedEnergy >= callDivineDogsCost && !sukuna.domainAttack) {
                    divineDogsAttack();
                }
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue.isAttacking, nue, megumi.cursedEnergy]);

    return (
        <div>
            <audio src={require("../Assets/audios/claw.mp3")} ref={slashSoundEffectRef}></audio>
            <audio src={require("../Assets/audios/wolf.mp3")} ref={wolfSoundEffectRef}></audio>


            <div
                className="wolf"
                style={{
                    position: "absolute",
                    opacity: divineDogs.isActive ? "1" : "0",
                    top: blackDivineDogSidePosition === "stop" ? divineDogs.y :
                        (blackDivineDogSidePosition === "sukuna" ? sukuna.y : sukuna.y + 50),
                    left: blackDivineDogSidePosition === "stop" ? divineDogs.x :
                        (blackDivineDogSidePosition === "left" ? sukuna.x - 200 :
                            (blackDivineDogSidePosition === "right" ? sukuna.x + 200 :
                                (blackDivineDogSidePosition === "sukuna" ? sukuna.x : 0))),
                    transform: blackDogDirection === "right" ? "scaleX(1)" : "scaleX(-1)",
                    ...wolfStyle,
                }}>
            </div>
            <div
                className="wolf2"
                style={{
                    position: "absolute",
                    opacity: divineDogs.isActive ? "1" : "0",// right, left, sukuna, stop
                    top: whiteDivineDogSidePosition === "stop" ? whiteDivineDogPosition.y :
                        (whiteDivineDogSidePosition === "sukuna" ? sukuna.y : sukuna.y + 50),
                    left: whiteDivineDogSidePosition === "stop" ? whiteDivineDogPosition.x :
                        (whiteDivineDogSidePosition === "left" ? sukuna.x - 200 :
                            (whiteDivineDogSidePosition === "right" ? sukuna.x + 200 :
                                (whiteDivineDogSidePosition === "sukuna" ? sukuna.x : 0))),
                    transform: whiteDogDirection === "right" ? "scaleX(1)" : "scaleX(-1)",
                    ...wolf2Style,
                }}>


            </div>
        </div>
    );
};

export default DivineDogs;
