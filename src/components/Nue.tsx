import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveNue, nueActivity, nueAttacking, setNueDirection } from "../store/NueSlice";
import { setCanMove, updateRivalHealth } from "../store/SukunaSlice";
import { changeCursedEnergy } from "../store/MegumiSlice";


const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callNueCost = 40;
const nueAttackCost = 10;
const nueDamage = 10;
const shikigamiDrainingCost = 2;
const defaultNueTransform = "all .4s ease";


const Nue = () => {

    const megumi = useSelector((state: any) => state.MegumiState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const nue = useSelector((state: any) => state.NueState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);

    const dispatch = useDispatch();
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
            if (megumi.cursedEnergy >= 5) dispatch(changeCursedEnergy(-shikigamiDrainingCost));
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
        if (megumi.cursedEnergy <= 0) {
            stopInterval(nueIntervalRef);
            dispatch(nueActivity(false));
        }
    }, [megumi.cursedEnergy]);

    function nueAttack() {
        if (megumi.cursedEnergy < nueAttackCost) return;

        let attackDirection = "";
        attackDirection = megumi.x < sukuna.x ? "right" : "left";
        console.log("nue direction: ", nue.direction, "attackDirection: ", attackDirection,)
        // nue updates

        dispatch(nueAttacking(true));
        dispatch(changeCursedEnergy(-nueAttackCost));
        setNueStyle({ ...nueStyle, transition: "all .5s ease" });
        dispatch(setNueDirection(attackDirection));
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });
        dispatch(moveNue({ x: sukuna.x, y: sukuna.y - 100 })); //move to sukuna

        setTimeout(() => {
            dispatch(setCanMove(false)); // stun sukuna
            setImageSrc(require('../Assets/nue.png')); // nue arrives to sukuna

            setTimeout(() => { // electric attack
                setImageSrc(require('../Assets/nue-side.png')); // nue move after electric attack
                if (sukuna.x > megumi.x) {
                    dispatch(moveNue({ x: sukuna.x + 200, y: sukuna.y - 200 }));
                } else {
                    dispatch(moveNue({ x: sukuna.x - 200, y: sukuna.y - 200 }));
                }
                if (nue.isAttacking) return;
                setTimeout(() => {
                    dispatch(updateRivalHealth(-nueDamage))
                    setTimeout(() => {
                        dispatch(nueAttacking(false));
                        dispatch(setCanMove(true)); // cancel stun sukuna
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

            if (keysPressed.current.j && nue.isAttacking === false && !sukuna.domainAttack) {
                if (nue.isActive === true && sukuna.health.currentHealth > 0) {
                    nueAttack();
                }
            }
            if (keysPressed.current.k) {
                if (nue.isActive === false && megumi.cursedEnergy >= callNueCost + shikigamiDrainingCost * 2) {
                    dispatch(changeCursedEnergy(-callNueCost));
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
    }, [dispatch, nue.isAttacking, nue, megumi.cursedEnergy]);

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
