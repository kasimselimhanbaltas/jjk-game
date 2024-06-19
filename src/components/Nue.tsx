import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveNue, nueActivity, nueAttacking, setNueDirection } from "../store/NueSlice";
import { setRivalCanMove, updateRivalHealth } from "../store/RivalSlice";
import { changeCursedEnergy } from "../store/PlayerSlice";
import { playSoundEffect } from "../App";


const gameAreaWidth = 1400;
const gameAreaHeight = 600;
const characterWidth = 50;
const characterHeight = 120;
const callNueCost = 1;
const nueAttackCost = 10;
const nueDamage = 1;
const shikigamiDrainingCost = 1;
const defaultNueTransform = "all .4s ease";


const Nue = () => {

    const player = useSelector((state: any) => state.PlayerState);
    const rival = useSelector((state: any) => state.RivalState);
    const nue = useSelector((state: any) => state.NueState);
    const dispatch = useDispatch();
    const keysPressed = useRef({ j: false, k: false });
    const [imageSrc, setImageSrc] = useState(require('../Assets/nue-side.png'));
    const [imageStyle, setImageStyle] = useState({
        transition: "all .2s ease, transform 0s",
        transform: "",
    });
    const [nueStyle, setNueStyle] = useState({ transition: defaultNueTransform });

    const nueSound = new Audio(require("../Assets/audios/nue.mp3"))


    const nueIntervalRef = useRef(null);

    const startNueInterval = () => {
        // Interval zaten çalışıyorsa başlatma
        if (nueIntervalRef.current !== null) return;

        nueIntervalRef.current = setInterval(() => {
            if (player.cursedEnergy >= 5) dispatch(changeCursedEnergy(-shikigamiDrainingCost));
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
        if (player.cursedEnergy === 0) {
            stopInterval(nueIntervalRef);
            dispatch(nueActivity(false));
        }
    }, [player.cursedEnergy]);

    function nueAttack() {
        if (player.cursedEnergy < nueAttackCost) return;

        let attackDirection = "";
        attackDirection = player.x < rival.x ? "right" : "left";
        console.log("nue direction: ", nue.direction, "attackDirection: ", attackDirection,)
        // nue updates

        dispatch(nueAttacking(true));
        dispatch(changeCursedEnergy(-nueAttackCost));
        setNueStyle({ ...nueStyle, transition: "all .5s ease" });
        dispatch(setNueDirection(attackDirection));
        // setImageStyle({ ...imageStyle, transform: `scaleX(${attackDirection === "right" ? -1 : 1})` });
        dispatch(moveNue({ x: rival.x, y: rival.y - 100 })); //move to rival

        setTimeout(() => {
            dispatch(setRivalCanMove(false)); // stun rival
            setImageSrc(require('../Assets/nue.png')); // nue arrives to rival

            setTimeout(() => { // electric attack
                setImageSrc(require('../Assets/nue-side.png')); // nue move after electric attack
                if (rival.x > player.x) {
                    dispatch(moveNue({ x: rival.x + 200, y: rival.y - 200 }));
                } else {
                    dispatch(moveNue({ x: rival.x - 200, y: rival.y - 200 }));
                }
                if (nue.isAttacking) return;
                setTimeout(() => {
                    dispatch(updateRivalHealth(-nueDamage))
                    setTimeout(() => {
                        dispatch(nueAttacking(false));
                        dispatch(setRivalCanMove(true)); // cancel stun rival
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

            if (keysPressed.current.j && nue.isAttacking === false) {
                if (nue.isActive === true && rival.health > 0) {
                    nueAttack();
                }
            }
            if (keysPressed.current.k) {
                if (nue.isActive === false && player.cursedEnergy >= 20) {
                    dispatch(changeCursedEnergy(-callNueCost));
                    startNueInterval();
                    playSoundEffect(nueSound);
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
    }, [dispatch, nue.isAttacking, nue, player.cursedEnergy]);

    return (
        <div
            className="nue"
            style={{
                opacity: nue.isActive ? "1" : "0",
                top: nue.isAttacking ? nue.y : player.y - 100,
                left: nue.isAttacking ? nue.x : player.direction === "left" ? player.x + 100 : player.x - 100,
                width: characterWidth,
                height: characterHeight,
                ...nueStyle,
            }}>

            <img src={imageSrc} alt="" style={{
                ...imageStyle, transform: nue.direction === "left" ? "scaleX(-1)" : "scaleX(1)", height: characterHeight // Direction'a göre resmi ters çevir
            }} />

        </div>
    );
};

export default Nue;
