import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { moveCharacter, moveCharacterTo, rivalCleaveAttack, rivalDismantleAttack, setRapidAttack, setCanMove, setCursedEnergy, setDirection, setRivalDomainExpansion, toggleCleaveCD } from '../store/SukunaSlice';
import megumiSlice from '../store/MegumiSlice';
import { Howl, Howler } from 'howler';
import ReactHowler from 'react-howler';
import useCooldown from '../hooks/useCoolDown';
import { AppDispatch, RootState } from '../store/GlobalStore';

const Sukuna = ({ xDistance }) => {

    const dispatch = useDispatch();
    const sukuna = useSelector((state: any) => state.SukunaState);
    const megumi = useSelector((state: any) => state.MegumiState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const characterWidth = 50;
    const characterHeight = 150;
    const attackDamage = sukuna.closeRange ? -100 : -10; // Saldırı hasarı
    const [electricityEffect, setElectricityEffect] = React.useState(false);
    const [rapidAttackCounter, setRapidAttackCounter] = React.useState(5);
    const attackInterval = React.useRef(null);
    const sukunaSoundEffectRef = React.useRef(null);
    const keysPressed = useRef({ j: false, k: false, l: false });


    // Cooldowns
    const [cleaveReady, setCleaveReady] = useState({ ready: true, coolDown: 0 });
    const [dismantleReady, setDismantleReady] = React.useState({ ready: true, coolDown: 0 });
    const [domainReady, setDomainReady] = React.useState({ ready: true, coolDown: 0 });



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

    // Sukuna auto attack starter
    useEffect(() => {
        if (sukuna.health.currentHealth > 0 && megumi.health.currentHealth > 0 && sukuna.canMove && gameSettings.selectedCharacter === "megumi") {
            if (sukuna.cursedEnergy >= 200) {
                rivalDomainExpansion()
            }
            else {
                if (sukuna.cursedEnergy >= 0) {
                    startAttackInterval();
                }
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, attackDamage, sukuna.direction, sukuna.canMove, rapidAttackCounter, sukuna.health.currentHealth]);

    // Domain expansion Action
    const rivalDomainExpansion = () => {
        console.log("RIYOIKI TENKAI ")
        dispatch(moveCharacterTo({ x: 635, y: 240 }));
        sukunaSoundEffectRef.current.play()
        dispatch(megumiSlice.actions.setCanMove(false))
        dispatch(setCanMove(false))
        dispatch(setCursedEnergy(0));
        setTimeout(() => {
            dispatch(setRivalDomainExpansion(true));
        }, 6000);
        setTimeout(() => {
            dispatch(setRivalDomainExpansion(false));
            dispatch(megumiSlice.actions.setCanMove(true))
            dispatch(setCanMove(true));
        }, 12000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        console.log("local")
        setRapidAttackCounter(5);
        dispatch(setRapidAttack(true));
        setTimeout(() => {
            dispatch(setRapidAttack(false));
        }, 1000);
    }
    const localDismantleAttack = (stepDistance) => {
        if (!sukuna.closeRange) return;
        dispatch(megumiSlice.actions.healthReducer(attackDamage)); // Megumi'ın canını azalt
        setRapidAttackCounter(rapidAttackCounter - 3);
        dispatch(rivalDismantleAttack(true));
        dispatch(megumiSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
        // slashRef.current.play();
        // slashSoundEffect(slashAudio);
        setTimeout(() => {
            dispatch(rivalDismantleAttack(false));
        }, 1000);
    }

    const localCleaveAttack = () => {
        console.log(cleaveReady.ready, cleaveReady.coolDown)
        setRapidAttackCounter(rapidAttackCounter - 1);
        setCleaveReady({ ready: false, coolDown: 5 });
        console.log(cleaveReady.ready, cleaveReady.coolDown)
        dispatch(rivalCleaveAttack(true));
        dispatch(megumiSlice.actions.healthReducer(attackDamage)); // Megumi'ın canını azalt
        setTimeout(() => { // cooldown
            setCleaveReady({ ready: true, coolDown: 5 });
        }, cleaveReady.coolDown * 1000);
        setTimeout(() => { // attack finish
            dispatch(rivalCleaveAttack(false));
        }, 1000)
    }

    // Sukuna attack interval - auto attack configuration
    const startAttackInterval = () => {
        // if (gameSettings.selectedCharacter === "sukuna") return;
        const attackDirection = sukuna.x - megumi.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        const randomInterval = 1500; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            console.log("attack interval")
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0 && sukuna.canMove) {
                if (rapidAttackCounter <= 0) {
                    localRapidAttack();
                } else {
                    if (sukuna.closeRange) { // dismantle
                        localDismantleAttack(stepDistance)
                    } else { // cleave
                        localCleaveAttack();
                    }
                    dispatch(megumiSlice.actions.healthReducer(attackDamage)); // Megumi'ın canını azalt
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
    }, [sukuna.health.currentHealth]);



    // Sukuna keyboard control
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
            if (gameSettings.selectedCharacter !== "sukuna") return;
            if (megumi.health.currentHealth > 0) {
                // !sukuna.cleaveAttack && cleaveReady.ready &&
                if (keysPressed.current.j && sukuna.canMove) {
                    console.log("j", sukuna.cleaveCD.isReady)
                    handleCleaveAttack()
                    if (rapidAttackCounter <= 0)
                        localRapidAttack();
                    else {
                        if (!sukuna.cleaveCD.isReady) {
                            localCleaveAttack();
                        }
                    }
                }
                if (keysPressed.current.k) {
                    const attackDirection = sukuna.x - megumi.x >= 0 ? "left" : "right";
                    const stepDistance = attackDirection === "left" ? -100 : 100;
                    if (sukuna.closeRange)
                        localDismantleAttack(-100);
                }
                if (keysPressed.current.l) {
                    if (sukuna.cursedEnergy >= 200) {
                        rivalDomainExpansion()
                    }
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, sukuna.cleaveCD]);

    const dispatch2 = useDispatch<AppDispatch>();
    const handleCleaveAttack = () => {
        dispatch2(toggleCleaveCD());
    };
    return (
        <div>
            <audio src={require("../Assets/audios/sukuna.mp3")} ref={sukunaSoundEffectRef}></audio>
            <div className="sukuna"
                style={{
                    top: sukuna.y, left: sukuna.x, width: characterWidth, height: characterHeight,
                    display: sukuna.health.currentHealth > 0 ? "block" : "none",
                }}>
                {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
                <img src={require('../Assets/sukuna.png')} alt="" style={{ height: characterHeight }} />
                <img src={require('../Assets/electricity.png')} alt="" style={{ display: electricityEffect ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />
                <img src={require('../Assets/claw-mark.png')} alt="" style={{ display: divineDogs.isAttacking ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />
                <p style={{ marginTop: -80, width: 250, marginLeft: -50, color: "black", fontSize: "20px" }}>Ryomen Sukuna</p>
                {/* <div className="megumi-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                    <div style={{ position: "absolute", width: sukuna.health.currentHealth * 150 / 100, maxWidth: "150px", height: "20px", top: "-120%", backgroundColor: "red" }}>
                    </div>
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -250%)", fontSize: "15px" }}>{sukuna.health.currentHealth}</p>
                </div>
                <div className="megumi-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                    <div style={{ position: "absolute", width: sukuna.cursedEnergy * 150 / 200, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                    </div>
                    <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{sukuna.cursedEnergy}</p>
                </div> */}
                {/* <p style={{ position: "absolute", top: "50%", left: "-50%", transform: "translate(-50%, -50%)", fontSize: "15px" }}>
                Sukuna Direction: {sukuna.direction} <br /> Range: {sukuna.closeRange ? "Close Range" : "Far Range"} <br /> Distance: {xDistance}
            </p> */}
            </div>
        </div>
    );
};

export default Sukuna;
