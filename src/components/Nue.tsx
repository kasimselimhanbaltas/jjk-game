import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import nueSlice, { moveNue, nueActivity, nueAttacking, setAnimationState, setNueAuto, setNueAutoAttack, setNueDirection } from "../redux/NueSlice";
import megumiSlice, { changeCursedEnergy, toggleCallNueCD, toggleNueAttackCD } from "../redux/character-slices/MegumiSlice";
import { AppDispatch } from "../redux/GlobalStore";


const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callNueCost = 50;
const nueAttackCost = 20;
const nueDamage = 100;
const shikigamiDrainingCost = 2;



const Nue = ({ rivalSlice, rivalState }) => {

    const megumi = useSelector((state: any) => state.MegumiState);
    const nue = useSelector((state: any) => state.NueState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const keysPressed = useRef({ j: false, k: false });

    const [nueStyle, setNueStyle] = useState({
        transition: "all .4s ease, width 0s, transform 0s", animation: "", width: 100,
        height: 128
    });

    const nueSound = useRef(null);


    const nueIntervalRef = useRef(null);

    const startNueInterval = () => {
        // Interval zaten çalışıyorsa başlatma
        if (nueIntervalRef.current !== null) return;

        nueIntervalRef.current = setInterval(() => {
            console.log("int: ", megumi.cursedEnergy.currentCursedEnergy)
            if (megumi.cursedEnergy.currentCursedEnergy >= 5) dispatch(changeCursedEnergy(-shikigamiDrainingCost));
            else {
                dispatch(nueActivity(false));
                stopInterval(nueIntervalRef)
            }
        }, 1000);
    };


    const stopInterval = (ref) => {
        // Interval çalışmıyorsa durdurma
        if (ref.current === null) return;

        clearInterval(ref.current);
        ref.current = null;
    };

    useEffect(() => {
        if (megumi.cursedEnergy.currentCursedEnergy <= 0) {
            stopInterval(nueIntervalRef);
            dispatch(nueActivity(false));
        }
    }, [megumi.cursedEnergy]);

    function nueAttack() {
        if (megumi.cursedEnergy.currentCursedEnergy < nueAttackCost) return;
        dispatch2(toggleNueAttackCD());
        // setNueStyle({ ...nueStyle, transition: "all 2s ease" });
        dispatch(nueSlice.actions.setAnimationState("nueAttack"));
        // dispatch(nueSlice.actions.setAnimationBlocker(true));
        setTimeout(() => {
            // dispatch(nueSlice.actions.setAnimationBlocker(false));
            dispatch(nueSlice.actions.setAnimationState("nueStance"));
        }, 1500);
        let attackDirection = "";
        attackDirection = megumi.x < rivalState.x ? "right" : "left";
        console.log("nue direction: ", nue.direction, "attackDirection: ", attackDirection,)
        // nue updates

        dispatch(nueAttacking(true));
        dispatch(changeCursedEnergy(-nueAttackCost));
        dispatch(setNueDirection(attackDirection));
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });
        dispatch(moveNue({ x: rivalState.x - 20, y: rivalState.y - 50 })); //move to rivalState

        setTimeout(() => {
            // dispatch(rivalSlice.actions.setCanMove(false)); // stun rivalState
            // setImageSrc(require('../Assets/nue.png')); // nue arrives to rivalState
            setTimeout(() => { // electric attack
                // setImageSrc(require('../Assets/nue-side.png')); // nue move after electric attack
                if (rivalState.x > megumi.x) { // move to beside rival
                    dispatch(moveNue({ x: rivalState.x + 100, y: rivalState.y - 100 }));
                } else {
                    dispatch(moveNue({ x: rivalState.x - 100, y: rivalState.y - 100 }));
                }
                if (nue.isAttacking) return;
                setTimeout(() => { // damage
                    dispatch(rivalSlice.actions.updateHealth(-nueDamage))
                    // dispatch(moveNue({ x: megumi.direction === "left" ? megumi.x + 30 : megumi.x - 50, y: megumi.y - 75 }));
                    setTimeout(() => { // return
                        dispatch(nueAttacking(false));
                        // dispatch(rivalSlice.actions.setCanMove(true)); // cancel stun rivalState
                        // dispatch(setNueDirection(attackDirection === "right" ? "left" : "right")); // set nue direction for coming back, not needed anymore
                        setNueStyle({ ...nueStyle, transition: "all .4s ease, width 0s, transform 0s" });
                    }, 1000);
                }, 250)
            }, 250)
        }, 1000)
    }

    useEffect(() => {
        if (nue.nueAuto) {
            if (nue.isActive === false && megumi.cursedEnergy.currentCursedEnergy >= callNueCost + shikigamiDrainingCost * 2) {
                console.log(" nue auto ")
                dispatch(changeCursedEnergy(-callNueCost));
                dispatch2(toggleCallNueCD());
                startNueInterval();
                nueSound.current.volume = 0.5;
                nueSound.current.play();
                dispatch(nueActivity(true));
            } else {
                dispatch(nueActivity(false));
                stopInterval(nueIntervalRef);
            }
            dispatch(setNueAuto(false));
        }
        else if (nue.isActive && nue.isAttacking === false && !rivalState.domainAttack) {
            if (megumi.nueAttackCD.isReady && nue.nueAutoAttack) {
                console.log("--------------")
                dispatch2(toggleNueAttackCD());
                nueAttack();
                dispatch(setNueAutoAttack(false))
            }
        }
    }, [nue.nueAuto, nue.nueAutoAttack, nue.isActive]);

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

            if (keysPressed.current.j && nue.isAttacking === false && !rivalState.domainAttack) {
                if (nue.isActive === true && rivalState.health.currentHealth > 0 && megumi.nueAttackCD.isReady) {
                    nueAttack();
                }
            }
            if ((keysPressed.current.k || nue.nueAuto) && megumi.animationState !== "callNue") {
                console.log(" nue auto ")
                if (nue.isActive === false && megumi.cursedEnergy.currentCursedEnergy >= callNueCost + shikigamiDrainingCost * 2) {
                    dispatch(megumiSlice.actions.setAnimationState("callNue"))
                    dispatch(megumiSlice.actions.setCanMove(false))
                    dispatch(megumiSlice.actions.setAnimationBlocker(true))

                    setTimeout(() => {

                        dispatch(megumiSlice.actions.setCanMove(true))
                        dispatch(megumiSlice.actions.setAnimationBlocker(false))
                        dispatch(megumiSlice.actions.setAnimationState("stance"))
                    }, 1000);
                    dispatch(changeCursedEnergy(-callNueCost));
                    dispatch2(toggleCallNueCD());
                    startNueInterval();
                    nueSound.current.volume = 0.5;
                    nueSound.current.play();
                    setTimeout(() => {
                        dispatch(nueActivity(true));
                    }, 500);
                } else {
                    dispatch(nueActivity(false));
                    stopInterval(nueIntervalRef);
                }
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue.isAttacking, nue, megumi.cursedEnergy, rivalState.domainAttack, nue.nueAuto, megumi.nueAttackCD]);


    useEffect(() => {
        if (nue.animationState === "nueStance") {
            console.log("effect nueStance")
            setNueStyle({ ...nueStyle, width: 100, height: 128, animation: "nueStance 1s steps(1) infinite" })
        }
        else if (nue.animationState === "nueAttack") {
            console.log("effect nueAttack")
            setNueStyle({ ...nueStyle, width: 160, height: 128, animation: "nueAttack 1.5s steps(1)" })
        }
    }, [nue.animationState]);

    return (
        // <div
        //     className="nue"
        //     style={{
        //         opacity: nue.isActive ? "1" : "0",
        //         top: nue.isAttacking ? nue.y : megumi.y - 100,
        //         left: nue.isAttacking ? nue.x : megumi.direction === "left" ? megumi.x + 100 : megumi.x - 100,
        //         width: characterWidth,
        //         height: characterHeight,
        //         ...nueStyle,
        //     }}>
        <div className="nue-container" style={{
            opacity: nue.isActive ? "1" : "0",
            top: nue.isAttacking ? nue.y : megumi.y - 75,
            left: nue.isAttacking ? nue.x : megumi.direction === "left" ? megumi.x + 30 : megumi.x - 50,
            ...nueStyle,
            transition: nue.isAttacking === true ? "left 1s, top 1s" : nueStyle.transition,
            transform: "translate(-50%, -50%) scaleX(" + (nue.direction === "left" ? -1 : 1) + ")",
        }}>

            < audio src={require("../Assets/audios/nue.mp3")} ref={nueSound} />
        </div >


    );
};

export default Nue;
