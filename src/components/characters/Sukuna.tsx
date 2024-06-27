import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import sukunaSlice, {
    moveCharacter, moveCharacterTo, rivalCleaveAttack, rivalDismantleAttack, setRapidAttack,
    setCanMove, setCursedEnergy, setDirection, setRivalDomainExpansion,
    toggleCleaveCD, toggleDismantleCD, toggleDomainCD, setRapidAttackCounter
} from '../../store/character-slices/SukunaSlice';
import megumiSlice, { changeCursedEnergy } from '../../store/character-slices/MegumiSlice';
import { Howl, Howler } from 'howler';
import ReactHowler from 'react-howler';
import useCooldown from '../../hooks/useCoolDown';
import { AppDispatch, RootState } from '../../store/GlobalStore';

const Sukuna = ({ xDistance, rivalSlice, rivalState }) => {

    const dispatch = useDispatch();
    const sukuna = useSelector((state: any) => state.SukunaState);
    const megumi = useSelector((state: any) => state.MegumiState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const characterWidth = 130;
    const characterHeight = 150;
    const cleaveCost = -10;
    const dismantleCost = -50;
    const cleaveAttackDamage = -10; // Saldırı hasarı
    const dismantleAttackDamage = -100; // Saldırı hasarı
    const [electricityEffect, setElectricityEffect] = React.useState(false);
    // const [rapidAttackCounter, setRapidAttackCounter] = React.useState(5);
    const attackInterval = React.useRef(null);
    const sukunaSoundEffectRef = React.useRef(null);
    const keysPressed = useRef({ j: false, k: false, l: false });


    // Cooldowns
    const [cleaveReady, setCleaveReady] = useState({ ready: true, coolDown: 0 });
    const [dismantleReady, setDismantleReady] = React.useState({ ready: true, coolDown: 0 });
    const [domainReady, setDomainReady] = React.useState({ ready: true, coolDown: 0 });
    const [sukunaImage, setSukunaImage] = React.useState({ src: require('../../Assets/sukuna.png'), scale: 1 });



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
        if (sukuna.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && sukuna.canMove && gameSettings.selectedCharacter !== "sukuna") {
            console.log("attack interval before 1")

            if (sukuna.cursedEnergy.currentCursedEnergy >= 0) {
                console.log("attack interval before 2")
                startAttackInterval();
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [dispatch, sukuna.closeRange, sukuna.direction, sukuna.canMove, sukuna.rapidAttackCounter,
        sukuna.health.currentHealth, sukuna.cleaveCD.isReady, sukuna.dismantleCD.isReady, sukuna.domainCD.isReady, rivalState.health.currentHealth]);

    // Domain expansion Action
    const rivalDomainExpansion = () => {
        console.log("RIYOIKI TENKAI ")
        dispatch(moveCharacterTo({ x: 650, y: 150 }));
        sukunaSoundEffectRef.current.play()
        setSukunaImage({ src: require('../../Assets/domainpose.png'), scale: 3 });
        setTimeout(() => {
            setSukunaImage({ src: require('../../Assets/domainpose.png'), scale: 5 });
        }, 100);
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(setCanMove(false))
        dispatch(sukunaSlice.actions.changeCursedEnergy(-200));
        setTimeout(() => {
            dispatch(setRivalDomainExpansion(true));
        }, 6000);
        setTimeout(() => {
            setSukunaImage({ src: require('../../Assets/domainpose.png'), scale: 2 });
            setTimeout(() => {
                setSukunaImage({ src: require('../../Assets/sukuna.png'), scale: 1 });
            }, 100);
            dispatch(setRivalDomainExpansion(false));
            dispatch(rivalSlice.actions.setCanMove(true))
            dispatch(setCanMove(true));
        }, 12000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        dispatch(sukunaSlice.actions.changeCursedEnergy(-20));
        dispatch(setRapidAttackCounter(0));
        dispatch(setRapidAttack(true));
        setTimeout(() => {
            dispatch(setRapidAttack(false));
        }, 1000);
    }
    const localDismantleAttack = (stepDistance) => {
        if (!sukuna.closeRange) return;
        dispatch(rivalSlice.actions.updateHealth(dismantleAttackDamage)); // Megumi'ın canını azalt
        dispatch(setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 3));
        dispatch(sukunaSlice.actions.changeCursedEnergy(dismantleCost));
        dispatch(rivalDismantleAttack(true));
        dispatch(rivalSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
        // slashRef.current.play();
        // slashSoundEffect(slashAudio);
        setTimeout(() => {
            dispatch(rivalDismantleAttack(false));
        }, 1000);
    }

    const localCleaveAttack = () => {
        dispatch(setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 1));
        dispatch(sukunaSlice.actions.changeCursedEnergy(cleaveCost));

        setCleaveReady({ ready: false, coolDown: 5 });
        dispatch(rivalCleaveAttack(true));
        dispatch(rivalSlice.actions.updateHealth(cleaveAttackDamage)); // Megumi'ın canını azalt
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
        const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -100 : 100;
        const randomInterval = 1500; // 3-10 saniye arasında rastgele bir değer
        // const randomInterval = Math.floor(Math.random() * 8000) + 3000; // 3-10 saniye arasında rastgele bir değer
        console.log("attack interval before")
        attackInterval.current = setInterval(() => {
            console.log("attack interval")
            // if (megumi.health.currentHealth > 0 && sukuna.health.currentHealth > 0) {
            if (rivalState.health.currentHealth > 0 && sukuna.health.currentHealth > 0 && sukuna.canMove) {
                const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
                // const stepDistance = attackDirection === "left" ? -100 : 100;
                console.log(sukuna.cursedEnergy.currentCursedEnergy)
                if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady)
                    handleDomainAttack()

                if (sukuna.closeRange && sukuna.dismantleCD.isReady)
                    handleDismantleAttack()

                if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount)
                    localRapidAttack();
                else {
                    if (sukuna.cleaveCD.isReady) {
                        handleCleaveAttack()
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
            if (rivalState.health.currentHealth > 0) {
                // !sukuna.cleaveAttack && cleaveReady.ready &&
                if (keysPressed.current.j && sukuna.canMove) {
                    if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount)
                        localRapidAttack();
                    else {
                        if (sukuna.cleaveCD.isReady) {
                            handleCleaveAttack()
                        }
                    }
                }
                if (keysPressed.current.k) {
                    const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
                    const stepDistance = attackDirection === "left" ? -100 : 100;
                    if (sukuna.closeRange && sukuna.dismantleCD.isReady)
                        handleDismantleAttack()
                }
                if (keysPressed.current.l) {
                    if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady) {
                        handleDomainAttack()
                    }
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, sukuna.cleaveCD, sukuna.dismantleCD, sukuna.closeRange, sukuna.domainCD, sukuna.cursedEnergy]);

    const dispatch2 = useDispatch<AppDispatch>();
    const handleCleaveAttack = () => {
        dispatch2(toggleCleaveCD()); // cooldown control
        localCleaveAttack(); // attack
    };
    const handleDismantleAttack = () => {
        dispatch2(toggleDismantleCD()); // cooldown control
        localDismantleAttack(-100); // attack
    };

    const handleDomainAttack = () => {
        dispatch2(toggleDomainCD()); // cooldown control
        rivalDomainExpansion(); // attack
    };
    return (
        <div>
            <audio src={require("../../Assets/audios/sukuna.mp3")} ref={sukunaSoundEffectRef}></audio>
            <div className="sukuna"
                style={{
                    top: sukuna.y, left: sukuna.x, width: characterWidth, height: characterHeight,
                    display: sukuna.health.currentHealth > 0 ? "block" : "none",
                }}>
                {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
                <img src={sukunaImage.src} alt="" style={{ transition: "transform 1s", height: characterHeight, transform: "scale(" + sukunaImage.scale + ")" }} />
                <img src={require('../../Assets/electricity.png')} alt="" style={{ display: electricityEffect ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ display: divineDogs.isAttacking ? "block" : "none", height: characterHeight, width: "120px", opacity: 0.8, scale: "1.2" }} />
                <p style={{ marginTop: gameSettings.selectedCharacter !== "sukuna" ? -80 : -30, width: 250, marginLeft: -60, color: "black", fontSize: "20px" }}>Ryomen Sukuna</p>
                {gameSettings.selectedCharacter !== "sukuna" && (
                    <>
                        <div className="megumi-health" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                            <div style={{ position: "absolute", width: sukuna.health.currentHealth * 150 / sukuna.health.maxHealth, maxWidth: "150px", height: "20px", top: "-120%", backgroundColor: "red" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -250%)", fontSize: "15px" }}>{sukuna.health.currentHealth}</p>
                        </div>
                        <div className="megumi-cursed-energy" style={{ position: "absolute", width: "150px", height: "20px", top: "-15%" }}>
                            <div style={{ position: "absolute", width: sukuna.cursedEnergy.currentCursedEnergy * 150 / sukuna.cursedEnergy.maxCursedEnergy, maxWidth: "150px", height: "20px", top: "-2%", backgroundColor: "purple" }}>
                            </div>
                            <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -130%)", fontSize: "15px" }}>{sukuna.cursedEnergy.currentCursedEnergy}</p>
                        </div>
                    </>
                )}
                {/* <p style={{ position: "absolute", top: "50%", left: "-50%", transform: "translate(-50%, -50%)", fontSize: "15px" }}>
                Sukuna Direction: {sukuna.direction} <br /> Range: {sukuna.closeRange ? "Close Range" : "Far Range"} <br /> Distance: {xDistance}
            </p> */}
            </div>
        </div>
    );
};

export default Sukuna;
