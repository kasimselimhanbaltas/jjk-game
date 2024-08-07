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
    const domainSoundEffectRef = React.useRef(null);
    const smashSoundEffectRef = React.useRef(null);

    const keysPressed = useRef({
        a: false, s: false, d: false, w: false,
        j: false, k: false, l: false, e: false, r: false, f: false, g: false, h: false
    });


    // Cooldowns
    const [cleaveReady, setCleaveReady] = useState({ ready: true, coolDown: 0 });



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
        if (sukuna.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && sukuna.canMove
            && gameSettings.selectedCharacter !== "sukuna") {

            if (sukuna.cursedEnergy.currentCursedEnergy >= 0 && !sukuna.animationBlocker) {
                startAttackInterval();
            } else {
                console.log("animation blocked!!!!")
            }
        } else {
            stopAttackInterval();
        }
        return () => {
            stopAttackInterval(); // Bileşen unmount olduğunda interval'ı temizle
        };

    }, [sukuna.closeRange, sukuna.canMove, sukuna.rapidAttackCounter >= 10,
    sukuna.health.currentHealth <= 0, sukuna.cleaveCD.isReady, sukuna.dismantleCD.isReady, sukuna.domainCD.isReady,
    rivalState.health.currentHealth <= 0, sukuna.animationBlocker, xDistance > 0]);

    function updateRivalDirection(direction) {
        if (gameSettings.selectedCharacter === "sukuna") {
            rivalSlice.actions.setDirection(direction);
        }
    }
    // Domain expansion Action
    const rivalDomainExpansion = () => {
        if (sukuna.animationBlocker) return;
        console.log("RIYOIKI TENKAI ")
        dispatch(sukunaSlice.actions.setGravity(0)) // 5
        dispatch(moveCharacterTo({ x: 690, y: 400 })); // 560
        sukunaSoundEffectRef.current.play()
        const rivalDirectionForAttack = rivalState.x < 690 ? "right" : "left";
        const stepDistance = rivalDirectionForAttack === "left" ? +10 : -10;
        updateRivalDirection(rivalDirectionForAttack);
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.changeCursedEnergy(-200));
        dispatch(sukunaSlice.actions.setAnimationState("domain-pose"));
        setTimeout(() => {
            dispatch(setRivalDomainExpansion(true));
            setTimeout(() => {
                setDomainAttackStyle("block");
                let slashDamage = -25;
                let maxSlashCount = (rivalState.health.currentHealth / Math.abs(slashDamage)) >= 50 ? 50 : (rivalState.health.currentHealth / Math.abs(slashDamage));
                const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
                domainSoundEffectRef.current.volume = 0.3
                domainSoundEffectRef.current.play()
                for (let i = 0; i < 50; i++) { // 50 random slashes -> rotate slash images, push megumi back and reduce health
                    setTimeout(() => { // random slashes delay
                        dispatch(rivalSlice.actions.moveCharacterWD({ x: stepDistance, y: 0 }));
                        dispatch(rivalSlice.actions.updateHealth(slashDamage));

                        // setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });

                        if (i >= maxSlashCount - 1) {
                            domainSoundEffectRef.current.pause()
                            domainSoundEffectRef.current.currentTime = 0; // İsterseniz başa sarabilirsiniz
                        }

                    }, i * 100);
                }
            }, 1000);
        }, 6000);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setGravity(5)) // 5
            setDomainAttackStyle("none");
            dispatch(setRivalDomainExpansion(false));
            dispatch(rivalSlice.actions.setCanMove(true))
            dispatch(setCanMove(true));
            dispatch(sukunaSlice.actions.setAnimationState("stance"));
        }, 12000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        if (sukuna.animationBlocker) return;
        rapidSlashSoundEffectRef.current.volume = 0.1;
        const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        dispatch(sukunaSlice.actions.setDirection(attackDirection));
        updateRivalDirection(attackDirection === "left" ? "right" : "left");
        dispatch(rivalSlice.actions.setCanMove(false));

        dispatch(sukunaSlice.actions.changeCursedEnergy(-20));
        dispatch(setRapidAttackCounter(0));
        dispatch(sukunaSlice.actions.setAnimationState("rapid-attack"))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(setRapidAttack(true));
            setRapidStyle("block")
            rapidSlashSoundEffectRef.current.play()
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    dispatch(rivalSlice.actions.updateHealth(-10));
                    dispatch(rivalSlice.actions.moveCharacterWD({ x: stepDistance, y: 0 }));
                }, i * 100);
            }
            setTimeout(() => {
                setRapidStyle("none")
                dispatch(sukunaSlice.actions.setCanMove(true))
                dispatch(sukunaSlice.actions.setAnimationBlocker(false))
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
                dispatch(setRapidAttack(false));
                rapidSlashSoundEffectRef.current.pause()
                dispatch(rivalSlice.actions.setAnimationState("takeDamage"))
                dispatch(megumiSlice.actions.moveCharacterWD({ x: attackDirection === "right" ? 50 : -50, y: 0 }));
                setTimeout(() => {
                    dispatch(rivalSlice.actions.setAnimationState("stance"))
                    dispatch(rivalSlice.actions.setCanMove(true));
                }, 1000);
            }, 1500);
        }, 500);
    }
    const localCleaveAttack = (stepDistance) => {
        if (!sukuna.closeRange || sukuna.animationBlocker) return;
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";

        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setAnimationState("stance"))
        updateRivalDirection(attackDirection === "left" ? "right" : "left");


        updateRivalDirection(attackDirection === "right" ? "left" : "right");
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationState("cleave"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 50 : rivalState.x + 70, y: sukuna.y }));
        }, 200);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1000);
        dispatch(setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 3)); //3
        dispatch(sukunaSlice.actions.changeCursedEnergy(dismantleCost));
        dispatch(rivalDismantleAttack(true));
        setTimeout(() => {
            dispatch(rivalSlice.actions.updateHealth(dismantleAttackDamage)); // Megumi'ın canını azalt
            dispatch(rivalSlice.actions.moveCharacterWD({ x: attackDirection === "right" ? -stepDistance : stepDistance, y: 0 }));
            dispatch(rivalSlice.actions.setAnimationState("takeDamage"))
            setTimeout(() => {
                dispatch(rivalSlice.actions.setAnimationState("stance"))
                dispatch(rivalSlice.actions.setCanMove(true))
            }, 1000);
            // slashRef.current.play();
            // slashSoundEffect(slashAudio);
            setTimeout(() => {
                dispatch(rivalDismantleAttack(false));
            }, 1000);
        }, 700);
    }

    const localDismantleAttack = () => {
        if (sukuna.animationBlocker) return;
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
        const interval = 500; // 3-10 saniye arasında rastgele bir değer
        attackInterval.current = setInterval(() => {
            if (rivalState.health.currentHealth > 0 && sukuna.health.currentHealth > 0
                && sukuna.canMove && sukuna.animationBlocker === false
            ) {
                console.log("rival desicion: ")
                if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady) {
                    console.log("domain attack")
                    handleDomainAttack()
                }

                else if (sukuna.closeRange && sukuna.dismantleCD.isReady) {
                    console.log("cleave attack")
                    handleCleaveAttack()
                }

                else if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount) {
                    console.log("rapid attack")
                    localRapidAttack();
                }
                else if (sukuna.cleaveCD.isReady) {
                    console.log("dismanlte attack")
                    handleDismantleAttack()
                } else {
                    console.log("bam attack")
                    handleBamAttack();
                }


            } else {
                stopAttackInterval(); // Megumi ölünce saldırıyı durdur
            }
        }, interval);
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

                if (key === "s" && backflipInterval.current === null && sukuna.isJumping === false &&
                    sukuna.animationState !== "backflip" && !sukuna.animationBlocker) {
                    dispatch(sukunaSlice.actions.setAnimationState("backflip"));
                    dispatch(sukunaSlice.actions.setAnimationBlocker(true));
                    backflipInterval.current = setInterval(() => {
                        dispatch(sukunaSlice.actions.moveCharacterWD({ x: sukuna.direction === "right" ? -25 : 25, y: 0 }));
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
            if (gameSettings.selectedCharacter === "sukuna" && sukuna.canMove) {

                if (key === "s") {
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
            if (rivalState.health.currentHealth > 0 && !sukuna.isJumping && sukuna.canMove && !sukuna.animationBlocker) {
                // !sukuna.cleaveAttack && cleaveReady.ready &&
                if (keysPressed.current.e && sukuna.canMove) {
                    if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount)
                        localRapidAttack();
                    else {
                        if (sukuna.cleaveCD.isReady) {
                            handleDismantleAttack()
                        }
                    }
                }
                if (keysPressed.current.r) {
                    const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
                    const stepDistance = attackDirection === "left" ? -100 : 100;
                    if (sukuna.closeRange && sukuna.dismantleCD.isReady) {
                        handleCleaveAttack()
                    }
                }
                if (keysPressed.current.l) {
                    if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady) {
                        handleDomainAttack()
                    }
                }
                if (keysPressed.current.k) {
                    handleBamAttack()
                }
                if (keysPressed.current.f) {
                    handleFugaAttack()
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, sukuna.cleaveCD, sukuna.dismantleCD, sukuna.closeRange,
        sukuna.domainCD, sukuna.cursedEnergy, sukuna.isJumping, sukuna.direction,
        sukuna.animationState, sukuna.canMove, sukuna.animationBlocker]);

    const dispatch2 = useDispatch<AppDispatch>();
    const [fugaSceneStyle, setFugaSceneStyle] = useState({
        animation: "", display: "none", top: 0, left: 0
    });
    const [fireArrowStyle, setFireArrowStyle] = useState({
        animation: "", opacity: 0, left: sukuna.x
    });
    const [fugaExplosionStyle, setFugaExplosionStyle] = useState({
        animation: "", display: "none"
    })
    const handleFugaAttack = () => {
        // dispatch(sukunaSlice.actions.setAnimationState("fugaAttack"))
        console.log("FUGA")
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        updateRivalDirection(attackDirection === "left" ? "right" : "left");
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setAnimationState("fugaBefore")) // first animation
        setTimeout(() => { // play fuga scene
            setFugaSceneStyle({ animation: "fuga-scene 4s steps(1)", display: "block", top: sukuna.y - 250, left: sukuna.x - 200 })
            setTimeout(() => {
                setFugaSceneStyle({ animation: "", display: "none", top: sukuna.y - 100, left: sukuna.x })
            }, 4000);
        }, 1000);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationState("fugaAfter")) // second animation
            setTimeout(() => {
                setFireArrowStyle({ animation: "fire-arrow .5s steps(1)", opacity: 1, left: sukuna.x - 50 })
            }, 1700);
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))

                setTimeout(() => {
                    setFireArrowStyle({ animation: "", opacity: 0, left: sukuna.x })

                    setFugaExplosionStyle({ animation: "fuga-explosion 1s steps(1)", display: "block" })
                    setTimeout(() => {
                        setFugaExplosionStyle({ animation: "", display: "none" })
                    }, 1000);
                }, 200);
            }, 2000);
        }, 4000);

    }
    const handleBamAttack = () => {
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        smashSoundEffectRef.current.volume = 0.1;
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setAnimationState("bam-attack"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))

        let landingPosition = rivalState.x;
        updateRivalDirection(attackDirection === "left" ? "right" : "left");

        setTimeout(() => { // style updates of bam effect and hitbox change, timeout for animation 1400
            dispatch(sukunaSlice.actions.setBamLandingPositionX(
                attackDirection === "left" ? landingPosition - 20 : landingPosition - 50))
            setBamStyle({
                display: "block", animation: "sukuna-bam-effect steps(1) .5s",
                left: attackDirection === "left" ? landingPosition - 20 : landingPosition - 50
            })
            dispatch(sukunaSlice.actions.setBamAttackMoment(true))
            setTimeout(() => {
                setBamStyle({ display: "none", animation: "", left: rivalState.x - 100, })
                dispatch(sukunaSlice.actions.setBamAttackMoment(false))
            }, 500);
        }, 1400);

        dispatch(sukunaSlice.actions.setCanMove(false))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1500);

        const distanceX = attackDirection === "right" ? rivalState.x - sukuna.x - 50 :
            rivalState.x - sukuna.x + 100;
        dispatch(sukunaSlice.actions.setGravity(4))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.jumpWS(40));
        }, 200);
        for (let i = 0; i < 10; i++) { // 
            setTimeout(() => { // random slashes delay
                if (i < 2) { } // 0 1  empty
                else if (i < 4) { // 2 x 10% = 0.2
                    dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 10, y: 0 }));
                }
                else if (i < 7) { // 3 4 5 -> 3x0.25 = 0.75
                    dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 4, y: 0 }));
                }
                else if (i < 8) { // 5 6 7 x 30%
                    dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 20, y: 0 }));
                }
                // else if (i < 10) { //  3 4 5 6 7 8 9 x  20%
                //     dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 10, y: 0 }));
                // }
                if (i === 7) dispatch(sukunaSlice.actions.setGravity(40))
                if (i === 9) dispatch(sukunaSlice.actions.setGravity(5))
                if (i === 6) smashSoundEffectRef.current.play();
                // else { // 5 x 1/10
                //     dispatch(sukunaSlice.actions.moveCharacter({ x: distanceX / 50, y: 0 }));
                // }
            }, i * 100);
        }
    }

    const handleDismantleAttack = () => {
        dispatch2(toggleCleaveCD()); // cooldown control
        localDismantleAttack(); // attack
    };
    const handleCleaveAttack = () => {
        dispatch2(toggleDismantleCD()); // cooldown control
        localCleaveAttack(-100); // attack
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
    const [rapidStyle, setRapidStyle] = React.useState(
        "none"
    )
    const [dismantleStyle, setDismantleStyle] = React.useState(
        "none"
    )
    const [domainAttackStyle, setDomainAttackStyle] = React.useState(
        "none"
    )


    useEffect(() => {
        if (sukuna.animationState === "stance") {
            setSukunaStyle({
                animation: "stance-sukuna 3s steps(1) infinite",
            })
        }
        else if (sukuna.animationState === "move") {
            setSukunaStyle({
                animation: sukuna.direction === "right" ? "sukuna-walk 1.5s steps(1) infinite" : "sukuna-walk-left 1.5s steps(1) infinite",
            })
        }
        else if (sukuna.animationState === "cleave") {
            console.log(sukuna.x, rivalState.x)

            setSukunaStyle({
                animation: sukuna.x > rivalState.x ? "sukuna-cleave-left 1s steps(1)" : "sukuna-cleave-right 1s steps(1)",
            })
            // setTimeout(() => {
            //     setCleaveAnimation("cleave steps(1) .5s")
            //     setTimeout(() => {
            //         setCleaveAnimation("")
            //     }, 500);
            // }, 500);
        }
        else if (sukuna.animationState === "dismantle") {
            // if (sukuna.direction === "left") {
            //     console.log("left")
            //     dispatch(sukunaSlice.actions.setPositioningSide("right"))
            // }
            setSukunaStyle({
                animation: sukuna.x > rivalState.x ? "sukuna-dismantle-left 1s steps(1)" : "sukuna-dismantle-right 1s steps(1)",
                // animation: "sukuna-dismantle-left 1s steps(1)",
            })
            setTimeout(() => {
                setDismantleStyle("block")
                setTimeout(() => {
                    // if (sukuna.direction === "left")
                    //     dispatch(sukunaSlice.actions.setPositioningSide("left"))
                    setDismantleStyle("none")
                }, 500);
            }, 500);
        }
        else if (sukuna.animationState === "rapid-attack") {
            if (sukuna.direction === "right") {
                dispatch(sukunaSlice.actions.setPositioningSide("right"))
            }
            setSukunaStyle({
                animation: xDistance >= 0 ? "sukuna-rapid-left 3.8s steps(1)" : "sukuna-rapid-right 3.8s steps(1)",
            })
            setTimeout(() => {
                if (sukuna.direction === "right") {
                    dispatch(sukunaSlice.actions.setPositioningSide("left"))
                }
            }, 3.8 * 1000);
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

            setSukunaStyle({
                animation: "sukuna-bam 1.5s steps(1)",
            })
            // setTimeout(() => {
            //     dispatch(sukunaSlice.actions.setCanMove(true))
            //     dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            //     dispatch(sukunaSlice.actions.setAnimationState("stance"))
            // }, 1500);

        }
        else if (sukuna.animationState === "fugaBefore") {
            if (sukuna.direction === "left") {
                setSukunaStyle({
                    animation: "sukuna-fuga-before-scene-left 4s steps(1)",
                })
            } else
                setSukunaStyle({
                    animation: "sukuna-fuga-before-scene 4s steps(1)",
                })
        }
        else if (sukuna.animationState === "fugaAfter") {
            if (sukuna.direction === "left") {
                setSukunaStyle({
                    animation: "sukuna-fuga-after-scene-left 2s steps(1)",
                })
            } else
                setSukunaStyle({
                    animation: "sukuna-fuga-after-scene 2s steps(1)",
                })
        }
        else if (sukuna.animationState === "domain-pose") {
            setSukunaStyle({
                animation: "sukuna-domain-pose 1s steps(1) forwards"
            })
        }

    }, [sukuna.animationState, xDistance > 0, sukuna.direction]);

    // RAPID ATTACK
    const rapidSlashSoundEffectRef = React.useRef(null);
    const [slashRotation, setSlashRotation] = React.useState({ rotate: "0deg" });

    // rapid attack and cleave attack is gonna be updated
    const rapidAttack = () => {
        // rapidSlashSoundEffectRef.current.volume = 0.1;

        // rapidSlashSoundEffectRef.current.play()
        // const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
        // const stepDistance = attackDirection === "left" ? -10 : 10;
        // for (let i = 0; i < 20; i++) {
        //     setTimeout(() => {
        //         dispatch(rivalSlice.actions.updateHealth(-10));
        //         dispatch(rivalSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
        //         if (i === 19) rapidSlashSoundEffectRef.current.pause()
        //     }, i * 100);
        // }
        // const degrees = [90, 270, 30, 120, 300, 240, 210, 180, 60, 150];
        // for (let i = 0; i < degrees.length * 3; i++) {
        //     setTimeout(() => {
        //         setSlashRotation({ rotate: degrees[Math.floor(Math.random() * (degrees.length))] + "deg" });
        //         dispatch(rivalSlice.actions.updateHealth(-10));
        //         dispatch(rivalSlice.actions.moveCharacter({ x: stepDistance, y: 0 }));
        //     }, i * 100);
        // }
        // setTimeout(() => {
        //     setSlashRotation({ rotate: "0deg" });
        // }, degrees.length * 3 * 100);
    };

    return (
        <div>
            <audio src={require("../../Assets/audios/sukuna.mp3")} ref={sukunaSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/smash.mp3")} ref={smashSoundEffectRef}></audio>

            {/* {sukuna.animationBlocker ? "true" : "false"} */}
            <div className="fuga-scene" style={{
                animation: fugaSceneStyle.animation, display: fugaSceneStyle.display,
                top: fugaSceneStyle.top, left: fugaSceneStyle.left,
                transform: sukuna.direction === "right" ? "scaleX(-1)" : "none",

            }}></div>
            <div className="fire-arrow" style={{
                ...fireArrowStyle, top: sukuna.y - 50,
                left: fireArrowStyle.opacity === 0 ? sukuna.x : rivalState.x,
                transform: sukuna.direction === "left" ? "scaleX(-1)" : "none",

            }}></div>
            <div className="fuga-explosion" style={{ left: rivalState.x, ...fugaExplosionStyle }}></div>
            <div className="sukuna-bam-effect" style={{
                top: 470, ...bamStyle
            }}>
            </div>

            <div className='sukunaCC' style={{
                bottom: gameAreaHeight - sukuna.y,
                left: sukuna.positioningSide === "left" ? sukuna.x : undefined,
                right: sukuna.positioningSide === "right" ? 1400 - sukuna.x - 40 : undefined,
                transform: sukuna.direction === "left" ? "scaleX(-1)" : "none",
                animation: sukunaStyle.animation,
                display: sukuna.health.currentHealth > 0 ? "block" : "none",
            }}>
            </div>
            <div className='dismantle' style={{
                position: "absolute", top: rivalState.y - 40,
                left: rivalState.x + 20, display: dismantleStyle,
            }}></div>
            <div className='cleave' style={{ top: rivalState.y - 20, left: rivalState.x, animation: cleaveAnimation }}></div>
            <div className='rapid' style={{ top: rivalState.y - 20, left: rivalState.x + 40, display: rapidStyle }}></div>
            <div className='domain-slash' style={{
                top: rivalState.y - 20, left: rivalState.x + 40, display: domainAttackStyle,
                // rotate: slashRotation.rotate
            }}></div>

            <div className="sukuna-container"
                style={{
                    bottom: gameAreaHeight - sukuna.y, left: sukuna.x,
                    display: sukuna.health.currentHealth > 0 ? "block" : "none",
                }}>

                {/* </div> */}
                {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
                {/* <img src={sukunaImage.src} alt="" style={{ transition: "transform 1s", height: characterHeight, transform: "scale(" + sukunaImage.scale + ")" }} /> */}
                <img src={require('../../Assets/electricity.png')} alt="" style={{ position: "absolute", top: "-55px", left: "-20px", display: electricityEffect ? "block" : "none", height: "60px", width: "50px", opacity: 0.8, scale: "1.2", zIndex: 999 }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ position: "absolute", top: "-75px", left: "-20px", display: divineDogs.isAttacking ? "block" : "none", height: "80px", width: "70px", opacity: 0.8, scale: "1.2" }} />
                <img src={require(`../../Assets/guard.png`)} alt="" style={{
                    display: sukuna.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -15,
                    height: 120, width: 120, opacity: 0.8, scale: "1",
                    transform: "translate(-30%,0)"
                }} />
            </div>
        </div>
    );
};

export default Sukuna;
