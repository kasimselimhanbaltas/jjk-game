import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import nueSlice, { moveNue, nueActivity, nueAttacking, setNueAuto, setNueAutoAttack, setNueDirection } from "../store/NueSlice";
import { changeCursedEnergy, toggleCallNueCD, toggleNueAttackCD } from "../store/character-slices/MegumiSlice";
import { AppDispatch } from "../store/GlobalStore";


const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callNueCost = 50;
const nueAttackCost = 20;
const nueDamage = 100;
const shikigamiDrainingCost = 2;
const defaultNueTransform = "all .4s ease";


const Nue = ({ rivalSlice, rivalState }) => {

    const megumi = useSelector((state: any) => state.MegumiState);
    const nue = useSelector((state: any) => state.NueState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch<AppDispatch>();
    const keysPressed = useRef({ j: false, k: false });
    const [imageSrc, setImageSrc] = useState(require('../Assets/nue-side.png'));
    const [imageStyle, setImageStyle] = useState({
        transition: "all .2s ease, transform 0s",
        transform: "",
    });
    const [nueStyle, setNueStyle] = useState({ transition: defaultNueTransform });

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

        let attackDirection = "";
        attackDirection = megumi.x < rivalState.x ? "right" : "left";
        console.log("nue direction: ", nue.direction, "attackDirection: ", attackDirection,)
        // nue updates

        dispatch(nueAttacking(true));
        dispatch(changeCursedEnergy(-nueAttackCost));
        setNueStyle({ ...nueStyle, transition: "all .5s ease" });
        dispatch(setNueDirection(attackDirection));
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });
        dispatch(moveNue({ x: rivalState.x, y: rivalState.y - 100 })); //move to rivalState

        setTimeout(() => {
            dispatch(rivalSlice.actions.setCanMove(false)); // stun rivalState
            setImageSrc(require('../Assets/nue.png')); // nue arrives to rivalState

            setTimeout(() => { // electric attack
                setImageSrc(require('../Assets/nue-side.png')); // nue move after electric attack
                if (rivalState.x > megumi.x) {
                    dispatch(moveNue({ x: rivalState.x + 200, y: rivalState.y - 200 }));
                } else {
                    dispatch(moveNue({ x: rivalState.x - 200, y: rivalState.y - 200 }));
                }
                if (nue.isAttacking) return;
                setTimeout(() => {
                    dispatch(rivalSlice.actions.updateHealth(-nueDamage))
                    setTimeout(() => {
                        dispatch(nueAttacking(false));
                        dispatch(rivalSlice.actions.setCanMove(true)); // cancel stun rivalState
                        dispatch(setNueDirection(attackDirection === "right" ? "left" : "right"));
                        setTimeout(() => {
                            setImageStyle({ ...imageStyle, transform: "" });
                            setNueStyle({ ...nueStyle, transition: defaultNueTransform });
                        }, 1000);
                    }, 1000);
                }, 250)
            }, 250)
        }, 500)
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
                    dispatch2(toggleNueAttackCD());
                    nueAttack();
                }
            }
            if (keysPressed.current.k || nue.nueAuto) {
                console.log(" nue auto ")
                if (nue.isActive === false && megumi.cursedEnergy.currentCursedEnergy >= callNueCost + shikigamiDrainingCost * 2) {
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
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue.isAttacking, nue, megumi.cursedEnergy, rivalState.domainAttack, nue.nueAuto]);

    return (
        <div
            className="nue"
            style={{
                opacity: nue.isActive ? "1" : "0",
                top: nue.isAttacking ? nue.y : megumi.y - 100,
                left: nue.isAttacking ? nue.x : megumi.direction === "left" ? megumi.x + 100 : megumi.x - 100,
                width: characterWidth,
                height: characterHeight,
                ...nueStyle,
            }}>

            <img src={imageSrc} alt="" style={{
                ...imageStyle, transform: nue.direction === "left" ? "scaleX(-1)" : "scaleX(1)", height: characterHeight // Direction'a göre resmi ters çevir
            }} />
            <audio src={require("../Assets/audios/nue.mp3")} ref={nueSound}></audio>
        </div>
    );
};

export default Nue;
