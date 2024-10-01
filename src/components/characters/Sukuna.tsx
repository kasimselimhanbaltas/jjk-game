import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import sukunaSlice, {
    moveCharacter, moveCharacterTo, rivalCleaveAttack, rivalDismantleAttack, setRapidAttack,
    setCanMove, setCursedEnergy, setDirection, setRivalDomainExpansion,
    toggleCleaveCD, toggleDismantleCD, toggleDomainCD, setRapidAttackCounter,
    toggleSimpleDomainCD
} from '../../redux/character-slices/SukunaSlice';
import megumiSlice, { changeCursedEnergy } from '../../redux/character-slices/MegumiSlice';
import { Howl, Howler } from 'howler';
import ReactHowler from 'react-howler';
import useCooldown from '../../hooks/useCoolDown';
import { AppDispatch, RootState } from '../../redux/GlobalStore';
import "../../Sukuna.css";
import { divineDogsAttacking } from '../../redux/DivineDogsSlice';
import { setAnimationBlocker } from '../../redux/NueSlice';
import gojoSlice from '../../redux/character-slices/GojoSlice';
import gameSettingsSlice from '../../redux/GameSettingsSlice';
import tutorialSlice from '../../redux/TutorialSlice';

const Sukuna = ({ xDistance, rivalSlice, rivalState }) => {

    const dispatch = useDispatch();
    const tutorialState = useSelector((state: any) => state.TutorialState);
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
    const fugaSoundEffectRef = React.useRef(null);
    const punchSoundEffectRef = React.useRef(null);
    const slashSoundEffectRef = React.useRef(null);

    const keysPressed = useRef({
        a: false, s: false, d: false, w: false,
        j: false, k: false, l: false, e: false, r: false, f: false, g: false, h: false, shift: false,
        z: false, x: false, c: false
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

            if (sukuna.cursedEnergy.currentCursedEnergy >= 0 && !sukuna.animationBlocker && !sukuna.hardStun && !sukuna.devStun) {
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

    }, [sukuna.hardStun, sukuna.devStun, sukuna.closeRange, sukuna.canMove, sukuna.rapidAttackCounter >= 10,
    sukuna.health.currentHealth <= 0, sukuna.cleaveCD.isReady, sukuna.dismantleCD.isReady, sukuna.domainCD.isReady,
    rivalState.health.currentHealth <= 0, sukuna.animationBlocker, xDistance > 0,
    sukuna.direction, Math.abs(sukuna.x - rivalState.x) > 150, rivalState.infinity]
    );


    // Handle side effects of Satoru Gojo's domain expansion
    useEffect(() => {

        if (sukuna.domainStatus.isActive && rivalState.domainStatus.isActive) {
            dispatch(sukunaSlice.actions.setDomainState(
                { ...sukuna.domainStatus, sureHitStatus: false, domainClash: true }
            ));
            // dispatch(rivalSlice.actions.setDomainState(
            //     { ...rivalState.domainStatus, sureHitStatus: false, domainClash: true }
            // ));
        }
        if (sukuna.domainStatus.isActive && !rivalState.domainStatus.isActive) {
            dispatch(sukunaSlice.actions.setDomainState(
                { ...sukuna.domainStatus, sureHitStatus: true, domainClash: false }
            ));
        }


        let domainDamageInterval = null;
        let soundInterval = null
        if (sukuna.domainStatus.isActive && sukuna.domainStatus.sureHitStatus) {
            domainSoundEffectRef.current.volume = 0.1;
            let slashDamage = -25;
            soundInterval = setInterval(() => {
                domainSoundEffectRef.current.currentTime = 0;
            }, 4000);
            domainSoundEffectRef.current.play()
            dispatch(rivalSlice.actions.setCanMove(true)) // rival stun

            domainDamageInterval = setInterval(() => {
                // dispatch(rivalSlice.actions.updateHealth(slashDamage)); // domain slash damage
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: -slashDamage, takeDamageAnimationCheck: false,
                    knockback: 0, timeout: 0, animation: ""
                }))
                dispatch(sukunaSlice.actions.increaseFugaCounter(1))

            }, 100)
        }
        return () => {
            clearInterval(domainDamageInterval)
            clearInterval(soundInterval)
            if (domainSoundEffectRef.current !== null)
                domainSoundEffectRef.current.pause()
        }
    }, [sukuna.domainStatus, rivalState.domainStatus, sukuna.domainStatus.isActive === false]);

    // Domain expansion main function
    const sukunaDomainExpansion = () => {
        setDomainBugFixer(false);
        if (sukuna.animationBlocker) return;
        // dispatch(sukunaSlice.actions.setGravity(0)) // 5
        // dispatch(moveCharacterTo({ x: 690, y: 400 })); // 560
        sukunaSoundEffectRef.current.play()
        const rivalDirectionForAttack = rivalState.x < 690 ? "right" : "left";
        // const stepDistance = rivalDirectionForAttack === "left" ? +10 : -10;
        dispatch(rivalSlice.actions.setDirection(rivalDirectionForAttack));

        dispatch(rivalSlice.actions.setCanMove(false)) // rival stun
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.changeCursedEnergy(-200));
        dispatch(sukunaSlice.actions.setAnimationState("domain-pose"));
        dispatch(sukunaSlice.actions.setAnimationBlocker(true));

        // show panel
        if (!gameSettings.domainClash)
            domainPanel()

        setTimeout(() => {
            setTimeout(() => {
                // sukuna 835, 255 / gojo 250 560
                if (gameSettings.domainClash) {
                    dispatch(sukunaSlice.actions.setGravity(0))
                    dispatch(sukunaSlice.actions.moveCharacterTo({ x: 835, y: 255 }));
                    dispatch(sukunaSlice.actions.setDirection("left"));
                }
                dispatch(sukunaSlice.actions.setDomainState(
                    { ...sukuna.domainStatus, isActive: true }
                ));
                setTimeout(() => { // sukuna can move again in his domain
                    dispatch(sukunaSlice.actions.setGravity(5)) // 5
                    dispatch(rivalSlice.actions.setCanMove(true))

                    dispatch(sukunaSlice.actions.setCanMove(true))
                    dispatch(sukunaSlice.actions.setAnimationBlocker(false));
                    dispatch(sukunaSlice.actions.setAnimationState("stance"));
                    dispatch(setRivalDomainExpansion(true));
                }, 1000);
                setTimeout(() => { // domain finish
                    dispatch(sukunaSlice.actions.setDomainState(
                        { ...sukuna.domainStatus, isActive: false, isInitiated: false, forceExpand: false }
                    ));
                    console.log("sukuna domain close")
                    setDomainAttackStyle("none");
                    dispatch(setRivalDomainExpansion(false));
                }, sukuna.domainStatus.duration * 1000); // was 10000 duration
                // old codes
            }, 1000);
        }, 6000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        if (sukuna.animationBlocker) return;
        rapidSlashSoundEffectRef.current.volume = 0.1;
        const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        dispatch(sukunaSlice.actions.setDirection(attackDirection));
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));
        // dispatch(rivalSlice.actions.setCanMove(false)); // no stun to enemy

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
                    // dispatch(rivalSlice.actions.updateHealth(-10));
                    // dispatch(rivalSlice.actions.moveCharacterWD({ x: stepDistance, y: 0 }));
                    // dmgtmp
                    dispatch(rivalSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: attackDirection === "left" ? -10 : 10, timeout: 300, animation: ""
                    }))
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
                // setTimeout(() => {
                //     dispatch(rivalSlice.actions.setAnimationState("stance"))
                //     dispatch(rivalSlice.actions.setCanMove(true));
                // }, 1000);
            }, 1500);
        }, 500);
    }
    const localCleaveAttack = (stepDistance) => {
        if (!tutorialState.tutorialMode)
            if (!sukuna.closeRange || sukuna.animationBlocker) return;
        slashSoundEffectRef.current.volume = 0.1;
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        let infinity = rivalState.characterName === "gojo" && rivalState.infinity ? true : false;

        if (!infinity && !tutorialState.tutorialMode) {
            // dispatch(rivalSlice.actions.setCanMove(false))
            dispatch(rivalSlice.actions.setHardStun(true))
        }
        dispatch(rivalSlice.actions.setAnimationState("stance"))
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))


        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setHardStun(true))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationState("cleave"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            slashSoundEffectRef.current.currentTime = 0;
            slashSoundEffectRef.current.play()
        }, 300);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 50 : rivalState.x + 70, y: sukuna.y }));
        }, 200);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1000);
        dispatch(sukunaSlice.actions.changeCursedEnergy(dismantleCost));

        dispatch(rivalDismantleAttack(true));
        setTimeout(() => {

            dispatch(gojoSlice.actions.setTakeDamage({
                isTakingDamage: true, damage: 100,
                takeDamageAnimationCheck: infinity ? false : true, knockback: infinity ? 0 : stepDistance, timeout: 500, animation: ""
            }));
            setTimeout(() => {
                dispatch(rivalSlice.actions.setHardStun(false)) // ****
                dispatch(sukunaSlice.actions.setHardStun(false)) // ****
                dispatch(rivalSlice.actions.setCanMove(true))
            }, 1000);
            setTimeout(() => {
                dispatch(rivalDismantleAttack(false));
            }, 1000);
        }, 700);
    }

    const localDismantleAttack = useCallback(() => {
        slashSoundEffectRef.current.volume = 0.1;
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.changeCursedEnergy(cleaveCost));
        dispatch(sukunaSlice.actions.setAnimationState("dismantle"))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            slashSoundEffectRef.current.currentTime = 0;
            slashSoundEffectRef.current.play()
        }, 200);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationState("stance"))
        }, 1000);
        setCleaveReady({ ready: false, coolDown: 5 });
        setTimeout(() => {
            dispatch(rivalCleaveAttack(true));
            // dispatch(rivalSlice.actions.updateHealth(cleaveAttackDamage));
            dispatch(rivalSlice.actions.setTakeDamage({
                isTakingDamage: true, damage: tutorialState.tutorialMode ? 1000 : -cleaveAttackDamage, takeDamageAnimationCheck: false, knockback: 0, timeout: 300, animation: ""
            }))
            setTimeout(() => { // cooldown
                setCleaveReady({ ready: true, coolDown: 5 });
            }, cleaveReady.coolDown * 1000);
            setTimeout(() => { // attack finish
                dispatch(rivalCleaveAttack(false));
            }, 1000)

        }, 500);
    }, [sukuna.x < rivalState.x, rivalState.infinity]); // multi character bug

    // Sukuna attack interval - auto attack configuration
    const startAttackInterval = () => {
        const interval = 500; // 3-10 saniye arasında rastgele bir değer
        if (rivalState.infinity) {
            dispatch(sukunaSlice.actions.setDomainAmplification({ isActive: true }));
            dispatch(sukunaSlice.actions.setIsBlocking(true));
        }
        else {
            dispatch(sukunaSlice.actions.setDomainAmplification({ isActive: false }));
            dispatch(sukunaSlice.actions.setIsBlocking(false));
        }
        attackInterval.current = setInterval(() => {
            if (rivalState.health.currentHealth > 0 && sukuna.health.currentHealth > 0
                && sukuna.canMove && sukuna.animationBlocker === false
            ) {
                console.log("rival desicion: ")
                if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady && false) {
                    console.log("domain attack")
                    // handleDomainAttack()
                    setDomainBugFixer(true);
                    dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, isInitiated: true }))
                }
                else if (sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount && !rivalState.infinity) {
                    handleFugaAttack()
                }

                else if (sukuna.closeRange && sukuna.dismantleCD.isReady && !rivalState.infinity) {
                    console.log("cleave attack")
                    handleCleaveAttack()
                }

                else if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount && !rivalState.infinity) {
                    console.log("rapid attack")
                    localRapidAttack();
                }
                else if (sukuna.cleaveCD.isReady && !rivalState.infinity) {
                    console.log("dismanlte attack")
                    handleDismantleAttack()
                } else if (Math.abs(sukuna.x - rivalState.x) <= 150) {
                    handleKickAttack();
                }
                else {
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
    }, [sukuna.health.currentHealth <= 0]);

    useEffect(() => { // when sukuna gets stun, cancel backflip 
        if (sukuna.canMove === false) {
            clearInterval(backflipInterval.current);
            backflipInterval.current = null;
        }
    }, [sukuna.canMove === false]);

    const [RCT, setRCT] = useState(
        {
            rctActive: false,
            rctMode: "body"
        }
    );
    const [rctCD, setRctCD] = useState(false);

    const panelRef = useRef(null);
    const domainPanel = () => {
        if (panelRef.current) {
            setTimeout(() => {
                if (panelRef.current) {
                    panelRef.current.style.display = "block"
                    setTimeout(() => {
                        panelRef.current.style.height = "550px"
                        panelRef.current.style.width = "350px"
                    }, 100);
                    setTimeout(() => {
                        panelRef.current.style.height = "1px"
                        panelRef.current.style.width = "350px"
                        setTimeout(() => {
                            panelRef.current.style.display = "none";
                        }, 800);
                    }, 3000);
                }
            }, 4000);
        }
    }

    // Sukuna keyboard control
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = true;
            if (gameSettings.selectedCharacter === "sukuna") {

                if (key === "s" && backflipInterval.current === null && sukuna.isJumping === false &&
                    sukuna.animationState !== "backflip" && !sukuna.animationBlocker && sukuna.canMove) {
                    dispatch(sukunaSlice.actions.setAnimationState("backflip"));
                    dispatch(sukunaSlice.actions.setAnimationBlocker(true));
                    backflipInterval.current = setInterval(() => {
                        dispatch(sukunaSlice.actions.moveCharacterWD({ x: sukuna.direction === "right" ? -15 : 15, y: 0 }));
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
                if (keysPressed.current.e && sukuna.canMove && !sukuna.domainAmplification.isActive) {
                    if (sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount)
                        localRapidAttack();
                    else {
                        if (sukuna.cleaveCD.isReady) {
                            handleDismantleAttack()
                        }
                    }
                }
                if (keysPressed.current.r && !sukuna.domainAmplification.isActive) {
                    const attackDirection = sukuna.x - rivalState.x >= 0 ? "left" : "right";
                    const stepDistance = attackDirection === "left" ? -100 : 100;
                    if (sukuna.closeRange && sukuna.dismantleCD.isReady) {
                        handleCleaveAttack()
                    }
                }
                if (keysPressed.current.l && !sukuna.domainAmplification.isActive) {
                    if (sukuna.cursedEnergy.currentCursedEnergy >= 200 && sukuna.domainCD.isReady) {
                        dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, isInitiated: true }))
                        setDomainBugFixer(true);

                    }
                }
                if (keysPressed.current.j) {
                    if (keysPressed.current.shift)
                        handleKickDismantleCombo()
                    else
                        handleKickAttack()
                }
                if (keysPressed.current.k) {
                    handleBamAttack()
                }
                if (keysPressed.current.f && !sukuna.domainAmplification.isActive) {
                    handleFugaAttack()
                }
                if (keysPressed.current.g) {
                    // dispatch(sukunaSlice.actions.setTakeDamage({
                    //     isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 250, timeout: 300
                    // }));
                    dispatch(sukunaSlice.actions.setAnimationState("entry"));
                }
                if (keysPressed.current.z && !rctCD) {
                    // body, if rct is already on and body, turn off
                    setRctCD(true);

                    if (RCT.rctActive && RCT.rctMode === "body")
                        setRCT(prevState => ({
                            ...prevState, rctMode: "body", rctActive: false
                        }))
                    else
                        setRCT(prevState => ({
                            ...prevState, rctMode: "body", rctActive: true
                        }))
                }
                if (keysPressed.current.x && !rctCD) {
                    setRctCD(true);

                    if (RCT.rctActive && RCT.rctMode === "ct") {
                        setRCT(prevState => ({
                            ...prevState, rctMode: "ct", rctActive: false,
                        }))
                    }
                    else {
                        setRCT(prevState => ({
                            ...prevState, rctMode: "ct", rctActive: true,
                        }))
                    }
                }
                if (keysPressed.current.c) {
                    // if DA already active, end it 
                    if (sukuna.simpleDomain.isActive) {
                        dispatch(sukunaSlice.actions.setSimpleDomain({ ...sukuna.simpleDomain, isActive: false }))
                    }
                    else {
                        dispatch(sukunaSlice.actions.setSimpleDomain({ ...sukuna.simpleDomain, isActive: true }))
                        setTimeout(() => {
                            dispatch2(toggleSimpleDomainCD());
                        }, sukuna.simpleDomain.duration * 1000);
                    }
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, sukuna.cleaveCD.isReady, sukuna.dismantleCD.isReady, sukuna.closeRange,
        sukuna.domainCD.isReady, sukuna.cursedEnergy, sukuna.isJumping, sukuna.direction,
        sukuna.animationState, sukuna.canMove, sukuna.animationBlocker,
        RCT, rctCD, sukuna.rct.rctActive, sukuna.domainAmplification]);

    useEffect(() => {
        console.log(rctCD)
        setTimeout(() => {
            setRctCD(false);
        }, 500);
    }, [rctCD]);

    useEffect(() => {
        let int = null;
        let bodyHealCost = -7;
        let bodyHealAmount = 10;
        let ctHealCost = -1;
        if (RCT.rctActive) {
            int = setInterval(() => {
                if (RCT.rctMode === "body") {
                    dispatch(sukunaSlice.actions.setRCT({
                        rctActive: true, rctMode: "body"
                    }))
                    if (sukuna.health.currentHealth < sukuna.health.maxHealth && sukuna.cursedEnergy.currentCursedEnergy >= -bodyHealCost) {

                        dispatch(sukunaSlice.actions.updateHealth(bodyHealAmount))
                        dispatch(sukunaSlice.actions.changeCursedEnergy(bodyHealCost))
                    }
                }
                if (RCT.rctMode === "ct") {
                    if (!sukuna.dismantleCD.isReady || !sukuna.cleaveCD.isReady || !sukuna.domainCD.isReady) {
                        if (sukuna.cursedEnergy.currentCursedEnergy >= -ctHealCost) {
                            dispatch(sukunaSlice.actions.setRCT({
                                rctActive: true, rctMode: "ct"
                            }))
                            dispatch(sukunaSlice.actions.changeCursedEnergy(ctHealCost))
                        }
                        else {
                            dispatch(sukunaSlice.actions.setRCT({
                                rctActive: false, rctMode: "ct"
                            }))
                        }
                    }
                }
            }, 100)
        } else {
            dispatch(sukunaSlice.actions.setRCT({
                rctActive: false, rctMode: "body"
            }))

        }
        return () => {
            clearInterval(int)
        }
    }, [RCT, sukuna.cursedEnergy.currentCursedEnergy < 7, sukuna.health.currentHealth < sukuna.health.maxHealth,
        sukuna.dismantleCD.isReady, sukuna.cleaveCD.isReady, sukuna.domainCD.isReady
    ])

    const [domainBugFixer, setDomainBugFixer] = useState(false);
    const [domainClashCDref, setDomainClashCDref] = useState(false);

    // *** ULTRA DOMAIN HANDLER
    useEffect(() => {

        if (gameSettings.domainClash && sukuna.domainCD.isReady && sukuna.cursedEnergy.currentCursedEnergy >= 200) {
            console.log("udh:sukuna 1")
            handleDomainAttack();
            dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
            dispatch(gameSettingsSlice.actions.setDomainClash(false));
        }
        else if (sukuna.domainStatus.isInitiated === true) { // user pressed domain expansion key or bot initiated domain
            console.log("udh: sukuna 2")

            dispatch(sukunaSlice.actions.setCanMove(false));
            dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, isInitiated: false }))
            if (gameSettings.domainClashReady) { // rival already initiated domain
                console.log("udh: sukuna 2-3, domain clash is setting to ready")
                dispatch(gameSettingsSlice.actions.setDomainClash(true));
                if (tutorialState.tutorialMode) {
                    dispatch(tutorialSlice.actions.completeOneTaskInTutorial({
                        tutorialIndex: tutorialState.currentTaskIndex, taskIndex: 0, character: gameSettings.selectedCharacter
                    }));
                }
            }
            else {
                console.log("udh: sukuna 2-3, domain clash ready is setting to ready")
                dispatch(gameSettingsSlice.actions.setDomainClashReady(true));
                setTimeout(() => {
                    setDomainClashCDref(true);
                    dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
                }, 2000);
            }
        }
        else if (sukuna.domainStatus.forceExpand) {
            console.log("udh: sukuna 3")
            handleDomainAttack();
        }
        else {
            console.log("udh: sukuna 4")
            if (domainBugFixer && domainClashCDref === true && sukuna.domainCD.isReady && sukuna.cursedEnergy.currentCursedEnergy >= 200) {
                console.log("udh: sukuna 5")
                handleDomainAttack();
            }
        }
    }, [sukuna.domainStatus.isInitiated, sukuna.domainStatus.forceExpand, gameSettings.domainClashReady, gameSettings.domainClash,
        domainClashCDref, sukuna.domainCD.isReady, domainBugFixer])

    // useEffect(() => {
    //     console.log("aa", domainClashCDref)
    //     if (sukuna.domainStatus.isInitiated === true) {
    //         console.log("bb")


    //     }

    // }, [domainClashCDref, sukuna.domainStatus.isInitiated === true, gameSettings.domainClash])


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
        if (sukuna.fugaCounter.currentCount < sukuna.fugaCounter.maxCount) return;
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(sukunaSlice.actions.setHardStun(true))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))
        console.log("FUGA")
        fugaSoundEffectRef.current.volume = 0.5
        fugaSoundEffectRef.current.play();
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(sukunaSlice.actions.setAnimationState("fugaBefore")) // first animation
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))

        setTimeout(() => { // play fuga scene
            setFugaSceneStyle({ animation: "fuga-scene 4s steps(1)", display: "block", top: sukuna.y - 250, left: sukuna.x - 200 })
            setTimeout(() => {
                setFugaSceneStyle({ animation: "", display: "none", top: sukuna.y - 100, left: sukuna.x })
            }, 4000);
        }, 1000);
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            dispatch(sukunaSlice.actions.setAnimationState("fugaAfter")) // second animation
            dispatch(sukunaSlice.actions.setAnimationBlocker(true))
            setTimeout(() => {
                setFireArrowStyle({ animation: "fire-arrow .5s steps(1)", opacity: 1, left: attackDirection === "left" ? sukuna.x - 400 : sukuna.x - 50 })
            }, 1700);
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationBlocker(false))
                dispatch(sukunaSlice.actions.setAnimationState("stance"))

                setTimeout(() => {
                    setFireArrowStyle({ animation: "", opacity: 0, left: sukuna.x })

                    setFugaExplosionStyle({ animation: "fuga-explosion 1s steps(1)", display: "block" })
                    // dispatch(rivalSlice.actions.updateHealth(-500))
                    dispatch(rivalSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 500, takeDamageAnimationCheck: true, knockback: 50, timeout: 300, animation: ""
                    })) // check later
                    setTimeout(() => {
                        setFugaExplosionStyle({ animation: "", display: "none" })
                        dispatch(sukunaSlice.actions.setFugaCounter(0))
                        dispatch(sukunaSlice.actions.setCanMove(true))
                        dispatch(sukunaSlice.actions.setHardStun(false))
                        dispatch(rivalSlice.actions.setHardStun(false))
                        dispatch(rivalSlice.actions.setCanMove(true))
                    }, 1000);
                }, 200);
            }, 2000);
        }, 4000);

    }
    const handleBamAttack = useCallback(() => {
        let attackDirection = "";
        attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        smashSoundEffectRef.current.volume = 0.1;
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        // dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        dispatch(sukunaSlice.actions.setAnimationState("bam-attack"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))

        let landingPosition = rivalState.x;
        // updateRivalDirection(attackDirection === "left" ? "right" : "left");

        setTimeout(() => { // style updates of bam effect and hitbox change, timeout for animation 1400
            dispatch(sukunaSlice.actions.setBamLandingPositionX(
                attackDirection === "left" ? landingPosition - 20 : landingPosition - 50))
            setBamStyle({
                display: "block", animation: "sukuna-bam-effect steps(1) .5s",
                left: attackDirection === "left" ? landingPosition - 20 : landingPosition - 50
            })
            dispatch(sukunaSlice.actions.changeCursedEnergy(10))
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
    }, [sukuna.x, rivalState.x])

    const handleKickDismantleCombo = useCallback(() => {
        dispatch(sukunaSlice.actions.setAnimationState("sukuna-launch-knee"))
        // if (Math.abs(sukuna.x - rivalState.x) > 150)
        return;
        punchSoundEffectRef.current.volume = 0.1;
        let attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        dispatch(sukunaSlice.actions.setAnimationState("sukuna-kick"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))

        let airPosition = rivalState.x;
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));


        dispatch(sukunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 30 : rivalState.x + 50, y: sukuna.y }))

        setTimeout(() => {
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            // dispatch(sukunaSlice.actions.setAnimationState("stance"))
            dispatch(sukunaSlice.actions.setAnimationState("land-sukuna"))
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 700);

        }, 1500);

        let distanceX =
            attackDirection === "right" ? 400 : -400;
        if (rivalState.x + distanceX <= 0) distanceX = -rivalState.x + 50;
        else if (rivalState.x + distanceX >= 1400) distanceX = 1300 - rivalState.x - 50;
        dispatch(sukunaSlice.actions.setGravity(0))
        dispatch(rivalSlice.actions.setGravity(0))
        dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s, bottom 1s ease-in-out, left 1s ease-in-out"))
        dispatch(sukunaSlice.actions.setTransition("all .5s ease, transform, 0s, bottom .2s"))
        dispatch(rivalSlice.actions.moveCharacterWD({ x: distanceX, y: - 200 }));
        punchSoundEffectRef.current.play();
        let i = 0;
        const int = setInterval(() => { // random slashes delay
            if (i === 0) { // launch 
                // dispatch(rivalSlice.actions.updateHealth(-20))
                dispatch(gojoSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 0, timeout: 300, animation: ""
                }));
            }
            if (i === 5) { // sukuna jump
                dispatch(sukunaSlice.actions.moveCharacterWD({ x: 0, y: -150 }))
            }
            if (i === 6) {
                dispatch(sukunaSlice.actions.setTransition("all 0s ease"))
                dispatch(sukunaSlice.actions.setDirection(attackDirection === "right" ? "left" : "right"))
                dispatch(sukunaSlice.actions.moveCharacterTo({
                    x: attackDirection === "left" ? rivalState.x + distanceX - 20 : rivalState.x + distanceX + 50, y: rivalState.y - 220
                }))
            }
            if (i === 8) { // sukuna teleport to rival in mid-air
                dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s"))
            }
            if (i === 9) { // sukuna hits the rival in mid-air
                setTimeout(() => {
                    punchSoundEffectRef.current.play();
                    dispatch(rivalSlice.actions.setDirection(attackDirection))
                    dispatch(rivalSlice.actions.setGravity(100))
                    dispatch(gojoSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 30, takeDamageAnimationCheck: true, knockback: 0, timeout: 300, animation: ""
                    }));
                }, 100);
            }
            if (i === 10) {
                dispatch(rivalSlice.actions.moveCharacterWD({ x: -distanceX / 2, y: 200 }))
            }
            if (i === 12) { // end
                dispatch(sukunaSlice.actions.setTransition("all .2s ease, transform 0s"))
                dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s"))
                clearInterval(int);
                setTimeout(() => {
                    dispatch(sukunaSlice.actions.changeCursedEnergy(20))
                    dispatch(rivalSlice.actions.setGravity(5))
                    dispatch(sukunaSlice.actions.setGravity(30))
                    // dispatch(sukunaSlice.actions.setAnimationState("land-sukuna"))
                    dispatch(rivalSlice.actions.setHardStun(false)) // ***
                    setTimeout(() => {
                        dispatch(sukunaSlice.actions.setGravity(5))
                    }, 500);
                }, 300);
            }
            i++;
        }, 1000 / 12);
    }, [sukuna.x, rivalState.x])

    const handleKickAttack = useCallback(() => {
        if (Math.abs(sukuna.x - rivalState.x) > 150) return;
        punchSoundEffectRef.current.volume = 0.1;
        let attackDirection = sukuna.x < rivalState.x ? "right" : "left";
        dispatch(sukunaSlice.actions.setDirection(attackDirection))
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))


        let airPosition = rivalState.x;
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));


        dispatch(sukunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 30 : rivalState.x + 50, y: sukuna.y }))
        if (rivalState.infinity && !sukuna.domainAmplification.isActive) {
            dispatch(sukunaSlice.actions.setAnimationState("sukuna-failed-kick"))
            return;
        }
        dispatch(sukunaSlice.actions.setAnimationState("sukuna-kick"))
        dispatch(sukunaSlice.actions.setAnimationBlocker(true))
        dispatch(sukunaSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))
        setTimeout(() => {
            dispatch(sukunaSlice.actions.setCanMove(true))
            dispatch(sukunaSlice.actions.setAnimationBlocker(false))
            // dispatch(sukunaSlice.actions.setAnimationState("stance"))
            dispatch(sukunaSlice.actions.setAnimationState("land-sukuna"))
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 700);

        }, 1500);

        let distanceX =
            attackDirection === "right" ? 400 : -400;
        if (rivalState.x + distanceX <= 0) distanceX = -rivalState.x + 50;
        else if (rivalState.x + distanceX >= 1400) distanceX = 1300 - rivalState.x - 50;
        dispatch(sukunaSlice.actions.setGravity(0))
        dispatch(rivalSlice.actions.setGravity(0))
        dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s, bottom 1s ease-in-out, left 1s ease-in-out"))
        dispatch(sukunaSlice.actions.setTransition("all .5s ease, transform, 0s, bottom .2s"))
        dispatch(rivalSlice.actions.moveCharacterWD({ x: distanceX, y: - 200 }));
        punchSoundEffectRef.current.play();
        let i = 0;
        const int = setInterval(() => { // random slashes delay
            if (i === 0) { // launch
                // dispatch(rivalSlice.actions.updateHealth(-20))
                // dispatch(rivalSlice.actions.setTransition("all .5s ease, transform 0s"))
                dispatch(gojoSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 0, timeout: 300, animation: ""
                }));
            }
            if (i === 5) { // sukuna jump
                dispatch(sukunaSlice.actions.moveCharacterWD({ x: 0, y: -150 }))
            }
            if (i === 6) {
                dispatch(sukunaSlice.actions.setTransition("all 0s ease"))
                dispatch(sukunaSlice.actions.setDirection(attackDirection === "right" ? "left" : "right"))
                dispatch(sukunaSlice.actions.moveCharacterTo({
                    x: attackDirection === "left" ? rivalState.x + distanceX - 20 : rivalState.x + distanceX + 50, y: rivalState.y - 220
                }))
            }
            if (i === 8) { // sukuna teleport to rival in mid-air
                dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s"))
            }
            if (i === 9) { // sukuna hits the rival in mid-air
                setTimeout(() => {
                    punchSoundEffectRef.current.play();
                    dispatch(rivalSlice.actions.setDirection(attackDirection))
                    dispatch(rivalSlice.actions.setGravity(100))
                    dispatch(gojoSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 30, takeDamageAnimationCheck: true, knockback: 0, timeout: 300, animation: ""
                    }));
                }, 100);
            }
            if (i === 10) {
                dispatch(rivalSlice.actions.moveCharacterWD({ x: -distanceX / 2, y: 200 }))
            }
            if (i === 12) { // end
                dispatch(sukunaSlice.actions.setTransition("all .2s ease, transform 0s"))
                dispatch(rivalSlice.actions.setTransition("all .2s ease, transform 0s"))
                clearInterval(int);
                setTimeout(() => {
                    dispatch(sukunaSlice.actions.changeCursedEnergy(20))
                    dispatch(rivalSlice.actions.setGravity(5))
                    dispatch(sukunaSlice.actions.setGravity(30))
                    // dispatch(sukunaSlice.actions.setAnimationState("land-sukuna"))
                    dispatch(rivalSlice.actions.setHardStun(false)) // ***
                    dispatch(rivalSlice.actions.setCanMove(true))

                    setTimeout(() => {
                        dispatch(sukunaSlice.actions.setGravity(5))
                    }, 500);
                }, 300);
            }
            i++;
        }, 1000 / 12);
    }, [sukuna.x, rivalState.x, sukuna.domainAmplification.isActive])

    const handleTakeDamage = useCallback((takeDamageAnimationCheck, timeout, damage, knockback, animation) => {
        dispatch(sukunaSlice.actions.updateHealth(-damage));
        console.log("takedamge: ", damage, knockback)
        if (knockback && knockback > 0)
            dispatch(sukunaSlice.actions.moveCharacterWD({ x: sukuna.direction === "left" ? knockback : -knockback, y: 0 }))
        if (takeDamageAnimationCheck) {
            dispatch(sukunaSlice.actions.setHardStun(true));
            if (animation !== "") dispatch(sukunaSlice.actions.setAnimationState(animation));
            else dispatch(sukunaSlice.actions.setAnimationState("take-damage"));
            dispatch(sukunaSlice.actions.setTransition("all .2s ease, transform 0s, left .8s ease-in-out"));
            dispatch(sukunaSlice.actions.setAnimationBlocker(true));
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationBlocker(false));
                dispatch(sukunaSlice.actions.setHardStun(false)); // ****
                dispatch(sukunaSlice.actions.setAnimationState("stance"));
                dispatch(sukunaSlice.actions.setTransition("all .2s ease, transform 0s"));
                dispatch(sukunaSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 0, animation: "" }));
            }, animation !== "" ? 500 : 300 + timeout);
        }
        else {
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 0, animation: "" }));
            }, timeout);
        }
    }, [sukuna.direction]);
    useEffect(() => {
        const obj = sukuna.takeDamage;
        if (obj.isTakingDamage) {
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback, obj.animation);
        }
    }, [sukuna.takeDamage.isTakingDamage === true])
    const handleDismantleAttack = () => {
        if (sukuna.animationBlocker) return;
        dispatch2(toggleCleaveCD()); // cooldown control
        localDismantleAttack(); // attack
        dispatch(sukunaSlice.actions.setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 1));
        dispatch(sukunaSlice.actions.increaseFugaCounter(1))
    };
    const handleCleaveAttack = () => {
        dispatch2(toggleDismantleCD()); // cooldown control
        localCleaveAttack(100); // attack
        dispatch(sukunaSlice.actions.setRapidAttackCounter(sukuna.rapidAttackCounter.currentCount + 3));
        dispatch(sukunaSlice.actions.increaseFugaCounter(2))
    };

    const handleDomainAttack = () => {
        dispatch2(toggleDomainCD()); // cooldown control
        sukunaDomainExpansion(); // attack
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
                animation: "stance-sukuna 2s steps(1) infinite",
            })
        }
        else if (sukuna.animationState === "entry") {

            setSukunaStyle({
                animation: "entry-sukuna 1s steps(1)",
            })
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 900);
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
            // if (sukuna.direction === "right") {
            //     dispatch(sukunaSlice.actions.setPositioningSide("right"))
            // }
            setSukunaStyle({
                animation: xDistance >= 0 ? "sukuna-rapid-left 3.8s steps(1)" : "sukuna-rapid-right 3.8s steps(1)",
            })
            // setTimeout(() => {
            //     if (sukuna.direction === "right") {
            //         dispatch(sukunaSlice.actions.setPositioningSide("left"))
            //     }
            // }, 3.8 * 1000);
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
        else if (sukuna.animationState === "sukuna-kick") {
            setSukunaStyle({
                animation: "sukuna-kick 1s steps(1) forwards",
            })
        }
        else if (sukuna.animationState === "sukuna-failed-kick") {
            setSukunaStyle({
                animation: "sukuna-failed-kick .4s steps(1)",
            })
            setTimeout(() => {
                dispatch(sukunaSlice.actions.setAnimationState("stance"))
            }, 400);
        }
        else if (sukuna.animationState === "sukuna-launch-knee") {
            setSukunaStyle({
                animation: "sukuna-launch-knee 3s steps(1) infinite",
            })
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
        else if (sukuna.animationState === "take-damage") {
            setSukunaStyle({
                animation: "sukuna-take-damage .5s steps(1) forwards"
            })
        }
        else if (sukuna.animationState === "take-damage-short") {
            setSukunaStyle({
                animation: "sukuna-take-damage-short .3s steps(1) forwards"
            })
        }
        else if (sukuna.animationState === "land-sukuna") {
            setSukunaStyle({ animation: "land-sukuna .5s steps(1) forwards" })
        }


    }, [sukuna.animationState, xDistance > 0, sukuna.direction]);
    useEffect(() => {
        if (sukuna.devStun)
            console.log("sukuna stunned!")
        else
            console.log("sukuna is not stunned anymore")
    }, [sukuna.devStun])

    // RAPID ATTACK
    const rapidSlashSoundEffectRef = React.useRef(null);
    const actionTriggered = React.useRef(false);


    // Tutorial Effect
    useEffect(() => {
        if (gameSettings.selectedCharacter === "sukuna") return;
        console.log("rivalaction1")
        if (tutorialState.tutorialMode && !actionTriggered.current) {
            console.log("rivalaction2", tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalAction)
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "domain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, isInitiated: true }))
                    setDomainBugFixer(true);
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "forceDomain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(sukunaSlice.actions.setDomainState({ ...sukuna.domainStatus, forceExpand: true }))
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "useCleave") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(gojoSlice.actions.setInfinity(false))
                    setTimeout(() => {
                        dispatch(gojoSlice.actions.setInfinity(true))
                    }, 1000);
                    localDismantleAttack()
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
        }
    }, [tutorialState.currentTaskIndex])

    return (
        <div>
            <audio src={require("../../Assets/audios/sukuna.mp3")} ref={sukunaSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/smash.mp3")} ref={smashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/fuga-sound-effect.mp3")} ref={fugaSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/punch.mp3")} ref={punchSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>

            <div className="animation-container" style={{
                top: "50%",
                left: gameSettings.selectedCharacter === "sukuna" ? "25%" : "75%",
            }}
                ref={panelRef}>
                <div className="line"></div>
                <div className="panel">
                    <img src={require("../../Assets/sukunapanel.png")} alt="Manga Panel" />
                </div>
            </div>

            <div className="rct-body"
                style={{
                    left: sukuna.x, top: RCT.rctMode === "body" ? sukuna.y + 15 : sukuna.y,
                    translate: sukuna.direction === "right" ? "-27px -100%" : "-28px -100%",
                    display: RCT.rctActive ? "block" : "none",
                    animation: RCT.rctMode === "body" ? "rct-heal 1s steps(17) infinite" : "rct-ct 1s steps(19) infinite"
                }}
            // animation: rct-heal 1s steps(17) infinite;
            // animation: rct-ct 1s steps(19) infinite;
            ></div>

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
                transition: sukuna.transition,
            }}>

            </div>
            <div className='dismantle' style={{
                position: "absolute", top: rivalState.y - 40,
                left: rivalState.x + 20, display: dismantleStyle,
            }}></div>
            <div className='cleave' style={{ top: rivalState.y - 20, left: rivalState.x, animation: cleaveAnimation }}></div>
            <div className='rapid' style={{ top: rivalState.y - 20, left: rivalState.x + 40, display: rapidStyle }}></div>
            <div className='domain-slash' style={{
                top: rivalState.y - 20, left: rivalState.x + 40, display:
                    sukuna.domainStatus.isActive && sukuna.domainStatus.sureHitStatus ? "block" : "none",
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

                <div className="sukuna-domain-amplification" style={{
                    display: sukuna.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: -13,
                    transform: sukuna.direction === "left" ? "scaleX(-1)" : "none",
                    translate: sukuna.direction === "left" ? "-24% 0" : "-22% 0"
                }} />
            </div>
        </div>
    );
};

export default Sukuna;
