import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import sukunaSlice, {
    moveCharacter, moveCharacterTo, rivalCleaveAttack, rivalDismantleAttack, setRapidAttack,
    setCanMove, setCursedEnergy, setDirection, setRivalDomainExpansion,
    toggleCleaveCD, toggleDismantleCD, toggleDomainCD, setRapidAttackCounter
} from '../../redux/character-slices/SukunaSlice';
import megumiSlice, { changeCursedEnergy } from '../../redux/character-slices/MegumiSlice';
import { Howl, Howler } from 'howler';
import ReactHowler from 'react-howler';
import useCooldown from '../../hooks/useCoolDown';
import { AppDispatch, RootState } from '../../redux/GlobalStore';
import "../../Sukuna.css";
import { divineDogsAttacking } from '../../redux/DivineDogsSlice';

const Sukuna = ({ xDistance, rivalSlice, rivalState }) => {

    const dispatch = useDispatch();
    const sukuna = useSelector((state: any) => state.SukunaState);
    const megumi = useSelector((state: any) => state.MegumiState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const gameAreaHeight = 600;
    const characterWidth = 70;
    const characterHeight = 90;
    const cleaveCost = -10;
    const dismantleCost = -50;
    const cleaveAttackDamage = -10; // Saldırı hasarı
    const dismantleAttackDamage = -100; // Saldırı hasarı
    const [electricityEffect, setElectricityEffect] = React.useState(false);
    // const [rapidAttackCounter, setRapidAttackCounter] = React.useState(5);
    const attackInterval = React.useRef(null);
    const backflipInterval = React.useRef(null);

    const sukunaSoundEffectRef = React.useRef(null);
    const keysPressed = useRef({ j: false, k: false, l: false, e: false, r: false, t: false });


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
        dispatch(moveCharacterTo({ x: 700, y: 560 }));
        sukunaSoundEffectRef.current.play()
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(setCanMove(false))
        dispatch(sukunaSlice.actions.changeCursedEnergy(-200));
        setTimeout(() => {
            dispatch(setRivalDomainExpansion(true));
        }, 6000);
        setTimeout(() => {
            setSukunaImage({ src: require('../../Assets/domainpose.png'), scale: 2 });
            dispatch(setRivalDomainExpansion(false));
            dispatch(rivalSlice.actions.setCanMove(true))
            dispatch(setCanMove(true));
        }, 12000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        dispatch(sukunaSlice.actions.changeCursedEnergy(-20));
        dispatch(setRapidAttackCounter(0));
        dispatch(sukunaSlice.actions.setAnimationState("rapid-attack"))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(setRapidAttack(true));
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setCanMove(true))
                dispatch(sukunaSlice.actions.setAnimationBlocker(false))
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
                dispatch(setRapidAttack(false));
            }, 3300);
        }, 500);
    }
    const localDismantleAttack = (stepDistance) => {
        if (!sukuna.closeRange) return;
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setAnimationState("cleave"))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1000);
        dispatch(setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 3));
        dispatch(sukunaSlice.actions.changeCursedEnergy(-1));
        dispatch(rivalDismantleAttack(true));
        setTimeout(() => {
            dispatch(rivalSlice.actions.updateHealth(dismantleAttackDamage)); // Megumi'ın canını azalt
            dispatch(rivalSlice.actions.moveCharacter({ x: attackDirection === "right" ? -stepDistance : stepDistance, y: 0 }));
            // slashRef.current.play();
            // slashSoundEffect(slashAudio);
            setTimeout(() => {
                dispatch(rivalDismantleAttack(false));
            }, 1000);
        }, 1000);
    }

    const localCleaveAttack = () => {
        dispatch(setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 1));
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.changeCursedEnergy(cleaveCost));
        dispatch(sukunaSlice.actions.setAnimationState("dismantle"))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1000);
        setCleaveReady({ ready: false, coolDown: 5 });
        setTimeout(() => {
            dispatch(rivalCleaveAttack(true));
            dispatch(rivalSlice.actions.updateHealth(cleaveAttackDamage)); // Megumi'ın canını azalt
            setTimeout(() => { // cooldown
                setCleaveReady({ ready: true, coolDown: 5 });
            }, cleaveReady.coolDown * 1000);
            setTimeout(() => { // attack finish
                dispatch(rivalCleaveAttack(false));
            }, 1000)

        }, 500);
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
            if (gameSettings.selectedCharacter === "sukuna") {


                if (key === "e" && backflipInterval.current === null && sukuna.isJumping === false &&
                    sukuna.animationState !== "backflip" && !sukuna.animationBlocker) {
                    console.log("e pressed")
                    dispatch(sukunaSlice.actions.setAnimationState("backflip"));
                    dispatch(sukunaSlice.actions.setAnimationBlocker(true));
                    backflipInterval.current = setInterval(() => {
                        dispatch(sukunaSlice.actions.moveCharacterWD({ x: sukuna.direction === "right" ? -12 : 12, y: 0 }));
                    }, 50)
                }
                if (key === " " && sukuna.animationState !== "dash") {
                    dispatch(sukunaSlice.actions.setAnimationState("dash"));
                    dispatch(sukunaSlice.actions.setAnimationBlocker(true));
                }
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = false;
            if (gameSettings.selectedCharacter === "sukuna") {

                if (key === "e") {
                    dispatch(sukunaSlice.actions.setAnimationBlocker(false));
                    dispatch(sukunaSlice.actions.setAnimationState("stance"));
                    clearInterval(backflipInterval.current);
                    backflipInterval.current = null;
                }
                if (key === " ") {
                    dispatch(sukunaSlice.actions.setAnimationBlocker(false));
                    dispatch(sukunaSlice.actions.setAnimationState("stance"));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const intervalId = setInterval(() => {
            if (gameSettings.selectedCharacter !== "sukuna") return;
            if (rivalState.health.currentHealth > 0 && !sukuna.isJumping) {
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
                if (keysPressed.current.r) {
                    handleBamAttack()
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, sukuna.cleaveCD, sukuna.dismantleCD, sukuna.closeRange,
        sukuna.domainCD, sukuna.cursedEnergy, sukuna.isJumping, sukuna.direction, sukuna.animationState]);

    const dispatch2 = useDispatch<AppDispatch>();

    const handleBamAttack = () => {
        dispatch(sukunaSlice.actions.setAnimationState("bam-attack"))
        const distanceX = rivalState.x - sukuna.x;
        dispatch(sukunaSlice.actions.setGravity(4))
        dispatch(sukunaSlice.actions.jumpWS(40));
        for (let i = 0; i < 17; i++) { // 
            setTimeout(() => { // random slashes delay
                if (i < 4) { // 4 x 10%
                    dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 40, y: 0 }));
                }
                else if (i < 13) { // 10 x  80%
                    dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 11, y: 0 }));
                }
                if (i === 10) dispatch(sukunaSlice.actions.setGravity(40))
                if (i === 14) dispatch(sukunaSlice.actions.setGravity(5))
                // else { // 5 x 1/10
                //     dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 50, y: 0 }));
                // }
            }, i * 100);
        }
    }

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

    const [sukunaStyle, setSukunaStyle] = React.useState({
        animation: "stance-sukuna steps(1) 1s infinite",
    });
    const [bamStyle, setBamStyle] = React.useState({
        animation: "", display: "none", left: 0,
    });
    const [cleaveAnimation, setCleaveAnimation] = React.useState(
        "none"
    )

    useEffect(() => {
        if (sukuna.animationState === "stance") {
            setSukunaStyle({
                animation: "stance-sukuna 1s steps(1) infinite",
            })
        }
        else if (sukuna.animationState === "move") {
            setSukunaStyle({
                animation: "walk-sukuna 1s steps(1) infinite",
            })
        }
        else if (sukuna.animationState === "cleave") {
            setSukunaStyle({
                animation: sukuna.x > rivalState.x ? "sukuna-cleave-left 1s steps(1)" : "sukuna-cleave-right 1s steps(1)",
            })
            setTimeout(() => {
                setCleaveAnimation("cleave steps(1) .5s")
                setTimeout(() => {
                    setCleaveAnimation("")
                }, 500);
            }, 500);
        }
        else if (sukuna.animationState === "dismantle") {
            setSukunaStyle({
                animation: sukuna.x > rivalState.x ? "sukuna-dismantle-left 1s steps(1)" : "sukuna-dismantle-right 1s steps(1)",
            })
        }
        else if (sukuna.animationState === "rapid-attack") {
            setSukunaStyle({
                animation: sukuna.x > rivalState.x ? "sukuna-rapid-left 3.8s steps(1)" : "sukuna-rapid-right 3.8s steps(1)",
            })
        }
        else if (sukuna.animationState === "jump") {
            setSukunaStyle({
                animation: "jump-sukuna 1.5s steps(1)",
            })
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 1500);
        }
        else if (sukuna.animationState === "backflip") {
            setSukunaStyle({
                animation: "backflip-sukuna .8s steps(1) infinite",
            })
            // setTimeout(() => {
            //     dispatch(sukunaSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (sukuna.animationState === "dash") {
            setSukunaStyle({
                animation: "dash-sukuna .5s steps(1) infinite",
            })
            // setTimeout(() => {
            //     dispatch(sukunaSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (sukuna.animationState === "bam-attack") {
            let landingPosition = rivalState.x;
            let attackDirection = "";
            attackDirection = sukuna.x < rivalState.x ? "right" : "left";

            setSukunaStyle({
                animation: "sukuna-bam 1.5s steps(1)",
            })
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 1500);
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));
            setTimeout(() => {
                setBamStyle({ display: "block", animation: "sukuna-bam-effect steps(1) .5s", left: landingPosition - 100 })
                console.log("bamnow? ", sukuna.bamAttackMoment)
                dispatch(sukunaSlice.actions.setBamAttackMoment(true))
                setTimeout(() => {
                    setBamStyle({ display: "none", animation: "", left: rivalState.x - 100, })
                    dispatch(sukunaSlice.actions.setBamAttackMoment(false))
                }, 500);
            }, 1400);

        }

    }, [sukuna.animationState]);

    return (
        <div>
            <audio src={require("../../Assets/audios/sukuna.mp3")} ref={sukunaSoundEffectRef}></audio>
            <div className="sukuna-bam-effect" style={{
                top: 470, ...bamStyle
            }}>

            </div>
            <div className='sukunaCC' style={{
                bottom: gameAreaHeight - sukuna.y, left: sukuna.x,
                transform: sukuna.direction === "left" ? "scaleX(-1)" : "none",
                animation: sukunaStyle.animation,
                display: sukuna.health.currentHealth > 0 ? "block" : "none",

            }}>
            </div>

            <div className="sukuna-container"
                style={{
                    bottom: gameAreaHeight - sukuna.y, left: sukuna.x,
                    display: sukuna.health.currentHealth > 0 ? "block" : "none",
                }}>

                <div className='cleave' style={{ top: -20, left: rivalState.x - sukuna.x, animation: cleaveAnimation }}></div>
                {/* </div> */}
                {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
                {/* <img src={sukunaImage.src} alt="" style={{ transition: "transform 1s", height: characterHeight, transform: "scale(" + sukunaImage.scale + ")" }} /> */}
                <img src={require('../../Assets/electricity.png')} alt="" style={{ position: "absolute", top: "-55px", left: "-20px", display: electricityEffect ? "block" : "none", height: "60px", width: "50px", opacity: 0.8, scale: "1.2", zIndex: 999 }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ position: "absolute", top: "-75px", left: "-20px", display: divineDogs.isAttacking ? "block" : "none", height: "80px", width: "70px", opacity: 0.8, scale: "1.2" }} />
                <img src={require(`../../Assets/guard.png`)} alt="" style={{
                    display: sukuna.isBlocking ? "block" : "none",
                    position: "absolute", top: -65, left: -15,
                    height: 75, width: 75, opacity: 0.8, scale: "1",
                    transform: "translate(-10%,0)"
                }} />
            </div>
        </div>
    );
};

export default Sukuna;
