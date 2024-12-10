import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import megunaSlice, { toggleCleaveCD, toggleDismantleCD, toggleDomainCD, toggleSimpleDomainCD } from '../../redux/character-slices/MegunaSlice';
import megumiSlice, { changeCursedEnergy } from '../../redux/character-slices/MegumiSlice';
import useCooldown from '../../hooks/useCoolDown';
import { AppDispatch, RootState } from '../../redux/GlobalStore';
import "../../Meguna.css";
import { divineDogsAttacking } from '../../redux/DivineDogsSlice';
import { setAnimationBlocker } from '../../redux/NueSlice';
import gojoSlice from '../../redux/character-slices/GojoSlice';
import gameSettingsSlice from '../../redux/GameSettingsSlice';
import tutorialSlice from '../../redux/TutorialSlice';

const punch_combo_duration = 1500;
const punch_combo_frames = 17;
const punch_combo_animation = {
    stage_count: 4,
    stages: [
        {
            step_count: 3,
            duration: 250,
            action_frame_number: 2,
            action: "damage",
            animation_name: "meguna-punch-1"
        },
        {
            step_count: 3,
            duration: 250,
            action_frame_number: 2,
            action: "damage",
            animation_name: "meguna-punch-2"
        },
        {
            step_count: 5,
            duration: 250,
            action_frame_number: 2,
            action: "damage",
            animation_name: "meguna-punch-3"
        },
        {
            step_count: 3,
            duration: 500,
            action_frame_number: 2,
            action: "dismantle",
            animation_name: "meguna-punch-4"
        },
    ]
}

interface MegunaProps {
    xDistance: number;
    rivalState: any;  // You can replace 'any' with the actual type if you know it
    rivalSlice: any;  // Same as above, replace 'any' with the correct type
}

const Meguna: React.FC<MegunaProps> = memo(({ xDistance, rivalState, rivalSlice }) => {

    const dispatch = useDispatch();
    const tutorialState = useSelector((state: any) => state.TutorialState);
    const meguna = useSelector((state: any) => state.MegunaState);
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const nue = useSelector((state: any) => state.NueState);
    const divineDogs = useSelector((state: any) => state.DivineDogsState);

    const gameAreaHeight = 600;
    const cleaveCost = -10;
    const dismantleCost = -50;
    const [electricityEffect, setElectricityEffect] = React.useState(false);
    // const [rapidAttackCounter, megunaSlice.actions.megunaSlice.actions.setRapidAttackCounter] = React.useState(5);
    const attackInterval = React.useRef(null);
    const backflipInterval = React.useRef(null);

    const megunaSoundEffectRef = React.useRef(null);
    const domainSoundEffectRef = React.useRef(null);
    const smashSoundEffectRef = React.useRef(null);
    const fugaSoundEffectRef = React.useRef(null);
    const punchSoundEffectRef = React.useRef(null);
    const slashSoundEffectRef = React.useRef(null);

    const keysPressed = useRef({
        a: false, s: false, d: false, w: false,
        j: false, k: false, l: false, e: false, r: false, f: false, g: false, h: false, shift: false,
        z: false, x: false, c: false, o: false
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



    // Meguna auto attack starter
    useEffect(() => {
        if (meguna.health.currentHealth > 0 && rivalState.health.currentHealth > 0 && meguna.canMove
            && gameSettings.selectedCharacter !== "meguna") {

            if (meguna.cursedEnergy.currentCursedEnergy >= 0 && !meguna.animationBlocker && !meguna.hardStun && !meguna.devStun) {
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

    }, [meguna.hardStun, meguna.devStun, meguna.closeRange, meguna.canMove, meguna.rapidAttackCounter >= 10,
    meguna.health.currentHealth <= 0, meguna.cleaveCD.isReady, meguna.dismantleCD.isReady, meguna.domainCD.isReady,
    rivalState.health.currentHealth <= 0, meguna.animationBlocker, xDistance > 0,
    meguna.direction, Math.abs(meguna.x - rivalState.x) > 150, rivalState.infinity]
    );


    // Handle side effects of Satoru Gojo's domain expansion
    useEffect(() => {

        if (meguna.domainStatus.isActive && rivalState.domainStatus.isActive) {
            dispatch(megunaSlice.actions.setDomainState(
                { ...meguna.domainStatus, sureHitStatus: false, domainClash: true }
            ));
            // dispatch(rivalSlice.actions.setDomainState(
            //     { ...rivalState.domainStatus, sureHitStatus: false, domainClash: true }
            // ));
        }
        if (meguna.domainStatus.isActive && !rivalState.domainStatus.isActive) {
            dispatch(megunaSlice.actions.setDomainState(
                { ...meguna.domainStatus, sureHitStatus: true, domainClash: false }
            ));
        }


        let domainDamageInterval = null;
        let soundInterval = null
        if (meguna.domainStatus.isActive && meguna.domainStatus.sureHitStatus) {
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
                dispatch(megunaSlice.actions.increaseFugaCounter(1))

            }, 100)
        }
        return () => {
            clearInterval(domainDamageInterval)
            clearInterval(soundInterval)
            if (domainSoundEffectRef.current !== null)
                domainSoundEffectRef.current.pause()
        }
    }, [meguna.domainStatus, rivalState.domainStatus, meguna.domainStatus.isActive === false]);

    // Domain expansion main 
    const malevolentShrineRef = useRef(null);
    const megunaDomainExpansion = () => {
        setDomainBugFixer(false);
        if (meguna.animationBlocker) return;
        // dispatch(megunaSlice.actions.setGravity(0)) // 5
        // dispatch(moveCharacterTo({ x: 690, y: 400 })); // 560
        megunaSoundEffectRef.current.play()
        const rivalDirectionForAttack = rivalState.x < 690 ? "right" : "left";
        // const stepDistance = rivalDirectionForAttack === "left" ? +10 : -10;
        dispatch(rivalSlice.actions.setDirection(rivalDirectionForAttack));

        dispatch(rivalSlice.actions.setCanMove(false)) // rival stun
        dispatch(megunaSlice.actions.setCanMove(false))
        dispatch(megunaSlice.actions.changeCursedEnergy(-200));
        dispatch(megunaSlice.actions.setAnimationState({ animation: "domain-pose", animationPriority: 20, finishAnimation: false }));

        // show panel
        if (!gameSettings.domainClash)
            domainPanel()

        setTimeout(() => {
            setTimeout(() => {
                // meguna 835, 255 / gojo 250 560
                if (gameSettings.domainClash) {
                    dispatch(megunaSlice.actions.setGravity(0))
                    dispatch(megunaSlice.actions.moveCharacterTo({ x: 835, y: 255 }));
                    dispatch(megunaSlice.actions.setDirection("left"));
                }
                dispatch(megunaSlice.actions.setDomainState(
                    { ...meguna.domainStatus, isActive: true }
                ));
                malevolentShrineRef.current.style.display = "block";
                const position = meguna.direction === "left" ? meguna.x + 20 : meguna.x - 50
                malevolentShrineRef.current.style.left = position + "px";
                setTimeout(() => { // meguna can move again in his domain
                    dispatch(megunaSlice.actions.setGravity(5)) // 5
                    dispatch(rivalSlice.actions.setCanMove(true))

                    dispatch(megunaSlice.actions.setCanMove(true))
                    dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 20, finishAnimation: true }));
                    dispatch(megunaSlice.actions.setRivalDomainExpansion(true));
                }, 1000);
                setTimeout(() => { // domain finish
                    dispatch(megunaSlice.actions.setDomainState(
                        { ...meguna.domainStatus, isActive: false, isInitiated: false, forceExpand: false }
                    ));
                    malevolentShrineRef.current.style.display = "none";
                    console.log("meguna domain close")
                    setDomainAttackStyle("none");
                    dispatch(megunaSlice.actions.setRivalDomainExpansion(false));
                }, meguna.domainStatus.duration * 1000); // was 10000 duration
                // old codes
            }, 1000);
        }, 6000);
    }
    const { remainingTime, startCooldown } = useCooldown(5)

    const localRapidAttack = () => {
        if (meguna.animationBlocker) return;
        rapidSlashSoundEffectRef.current.volume = 0.1;
        const attackDirection = meguna.x - rivalState.x >= 0 ? "left" : "right";
        const stepDistance = attackDirection === "left" ? -10 : 10;
        dispatch(megunaSlice.actions.setDirection(attackDirection));
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));
        // dispatch(rivalSlice.actions.setCanMove(false)); // no stun to enemy

        dispatch(megunaSlice.actions.changeCursedEnergy(-20));
        dispatch(megunaSlice.actions.setRapidAttackCounter(0));
        // dispatch(megunaSlice.actions.setAnimationState("rapid-attack"))
        dispatch(megunaSlice.actions.setAnimationState({ animation: "rapid-attack", animationPriority: 5, finishAnimation: false }));
        dispatch(megunaSlice.actions.setCanMove(false))
        dispatch(megunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            dispatch(megunaSlice.actions.setRapidAttack(true));
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
                dispatch(megunaSlice.actions.setCanMove(true))
                dispatch(megunaSlice.actions.setAnimationBlocker(false))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
                dispatch(megunaSlice.actions.setRapidAttack(false));
                rapidSlashSoundEffectRef.current.pause()
                // dispatch(rivalSlice.actions.setAnimationState("takeDamage"))
                dispatch(rivalSlice.actions.setAnimationState({ animation: "takeDamage", animationPriority: 5, finishAnimation: false }));

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
            if (!meguna.closeRange || meguna.animationBlocker) return;
        slashSoundEffectRef.current.volume = 0.1;
        let attackDirection = "";
        attackDirection = meguna.x < rivalState.x ? "right" : "left";
        let infinity = rivalState.characterName === "gojo" && rivalState.infinity ? true : false;

        if (!infinity && !tutorialState.tutorialMode) {
            // dispatch(rivalSlice.actions.setCanMove(false))
            dispatch(rivalSlice.actions.setHardStun(true))
        }
        // dispatch(rivalSlice.actions.setAnimationState("stance"))
        dispatch(rivalSlice.actions.setAnimationState({ animation: "stance", animationPriority: 6, finishAnimation: false }));
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))


        dispatch(megunaSlice.actions.setDirection(attackDirection))
        dispatch(megunaSlice.actions.setHardStun(true))
        dispatch(megunaSlice.actions.setCanMove(false))
        // dispatch(megunaSlice.actions.setAnimationState("cleave"))
        dispatch(megunaSlice.actions.setAnimationState({ animation: "cleave", animationPriority: 5, finishAnimation: false }));
        // dispatch(megunaSlice.actions.setAnimationBlocker(true))
        setTimeout(() => {
            slashSoundEffectRef.current.currentTime = 0;
            slashSoundEffectRef.current.play()
        }, 300);
        setTimeout(() => {
            dispatch(megunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 50 : rivalState.x + 70, y: meguna.y }));
        }, 200);
        setTimeout(() => {
            dispatch(megunaSlice.actions.setAnimationBlocker(false))
            dispatch(megunaSlice.actions.setCanMove(true))
            // dispatch(megunaSlice.actions.setAnimationState("stance"))
            dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
        }, 1000);
        dispatch(megunaSlice.actions.changeCursedEnergy(dismantleCost));

        dispatch(megunaSlice.actions.rivalDismantleAttack(true));
        setTimeout(() => {

            dispatch(rivalSlice.actions.setTakeDamage({
                isTakingDamage: true, damage: 100,
                takeDamageAnimationCheck: infinity ? false : true, knockback: infinity ? 0 : stepDistance, timeout: 500, animation: ""
            }));
            setTimeout(() => {
                dispatch(rivalSlice.actions.setHardStun(false)) // ****
                dispatch(megunaSlice.actions.setHardStun(false)) // ****
                dispatch(rivalSlice.actions.setCanMove(true))
            }, 1000);
            setTimeout(() => {
                dispatch(megunaSlice.actions.rivalDismantleAttack(false));
            }, 1000);
        }, 700);
    }

    const localDismantleAttack = useCallback((animation: boolean, knockback: number) => {
        slashSoundEffectRef.current.volume = 0.1;
        let attackDirection = "";
        attackDirection = meguna.x < rivalState.x ? "right" : "left";
        dispatch(megunaSlice.actions.setDirection(attackDirection))
        dispatch(megunaSlice.actions.changeCursedEnergy(cleaveCost));
        if (animation)
            dispatch(megunaSlice.actions.setAnimationState({ animation: "dismantle", animationPriority: 5, finishAnimation: false }));
        dispatch(megunaSlice.actions.setCanMove(false))
        setTimeout(() => {
            slashSoundEffectRef.current.currentTime = 0;
            slashSoundEffectRef.current.play()
            setDismantleStyle("block");
        }, 400);
        setTimeout(() => {
            dispatch(megunaSlice.actions.setCanMove(true))
            setDismantleStyle("none");
        }, 800);
        setCleaveReady({ ready: false, coolDown: 5 });
        console.log("1 kb: ", knockback)
        setTimeout(() => {
            console.log("2 kb: ", knockback)
            dispatch(megunaSlice.actions.rivalCleaveAttack(true));
            console.log("kb: ", knockback)
            dispatch(rivalSlice.actions.setTakeDamage({
                isTakingDamage: true, damage: tutorialState.tutorialMode ? 1000 : 100, takeDamageAnimationCheck: false, knockback: knockback, timeout: 300, animation: ""
            }))
            console.log("end kb: ", knockback)
            setTimeout(() => { // cooldown
                setCleaveReady({ ready: true, coolDown: 5 });
            }, cleaveReady.coolDown * 1000);
            setTimeout(() => { // attack finish
                dispatch(megunaSlice.actions.rivalCleaveAttack(false));
            }, 1000)

        }, 500);
    }, [meguna.x < rivalState.x, rivalState.infinity]); // multi character bug

    // Meguna attack interval - auto attack configuration
    const startAttackInterval = () => {
        const interval = 500; // 3-10 saniye arasında rastgele bir değer
        if (rivalState.infinity) {
            dispatch(megunaSlice.actions.setDomainAmplification({ isActive: true }));
            dispatch(megunaSlice.actions.setIsBlocking(true));
        }
        else {
            dispatch(megunaSlice.actions.setDomainAmplification({ isActive: false }));
            dispatch(megunaSlice.actions.setIsBlocking(false));
        }
        attackInterval.current = setInterval(() => {
            if (rivalState.health.currentHealth > 0 && meguna.health.currentHealth > 0
                && meguna.canMove && meguna.animationBlocker === false
            ) {
                console.log("rival desicion: ")
                // if (meguna.cursedEnergy.currentCursedEnergy >= 200 && meguna.domainCD.isReady) {
                //     console.log("domain attack")
                //     // handleDomainAttack()
                //     setDomainBugFixer(true);
                //     dispatch(megunaSlice.actions.setDomainState({ ...meguna.domainStatus, isInitiated: true }))
                // }
                // else
                if (meguna.fugaCounter.currentCount >= meguna.fugaCounter.maxCount && !rivalState.infinity) {
                    handleFugaAttack()
                }

                else if (meguna.closeRange && meguna.dismantleCD.isReady && !rivalState.infinity) {
                    console.log("cleave attack")
                    handleCleaveAttack()
                }

                else if (meguna.rapidAttackCounter.currentCount >= meguna.rapidAttackCounter.maxCount && !rivalState.infinity) {
                    console.log("rapid attack")
                    localRapidAttack();
                }
                else if (meguna.cleaveCD.isReady && !rivalState.infinity) {
                    console.log("dismanlte attack")
                    handleDismantleAttack(true, 0)
                } else if (Math.abs(meguna.x - rivalState.x) <= 150) {
                    handlePunchingCombo();
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
        if (meguna.health.currentHealth <= 0 && gameSettings.selectedCharacter !== "meguna")
            stopAttackInterval();
    }, [meguna.health.currentHealth <= 0]);

    useEffect(() => { // when meguna gets stun, cancel backflip 
        if (meguna.canMove === false) {
            clearInterval(backflipInterval.current);
            backflipInterval.current = null;
        }
    }, [meguna.canMove === false]);

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

    const [isPunchingComboInitiated, setIsPunchingComboInitiated] = useState(false);

    // Meguna keyboard control
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = true;
            if (gameSettings.selectedCharacter === "meguna") {

                if (key === "s" && backflipInterval.current === null && meguna.isJumping === false &&
                    meguna.animationState !== "backflip" && !meguna.animationBlocker && meguna.canMove) {
                    // dispatch(megunaSlice.actions.setAnimationState("backflip"));
                    dispatch(megunaSlice.actions.setAnimationState({ animation: "move", animationPriority: 4, finishAnimation: false }));
                    dispatch(megunaSlice.actions.setAnimationBlocker(true));
                    backflipInterval.current = setInterval(() => {
                        dispatch(megunaSlice.actions.moveCharacterWD({ x: meguna.direction === "right" ? -5 : 5, y: 0 }));
                    }, 50)
                }
                if (key === " " && meguna.animationState !== "dash") {
                    // dispatch(megunaSlice.actions.setAnimationState("dash"));
                    dispatch(megunaSlice.actions.setAnimationState({ animation: "dash", animationPriority: 1, finishAnimation: false }));
                    dispatch(megunaSlice.actions.setAnimationBlocker(true));
                }
                if (key === "j" || key === "e") {
                    addToInputBuffer(key);
                }
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = false;
            if (gameSettings.selectedCharacter === "meguna" && meguna.canMove) {

                if (key === "s") {
                    dispatch(megunaSlice.actions.setAnimationBlocker(false));
                    // dispatch(megunaSlice.actions.setAnimationState("stance"));
                    dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 4, finishAnimation: true }));
                    clearInterval(backflipInterval.current);
                    backflipInterval.current = null;
                }
                if (key === " ") {
                    dispatch(megunaSlice.actions.setAnimationBlocker(false));
                    // dispatch(megunaSlice.actions.setAnimationState("stance"));
                    dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 1, finishAnimation: true }));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const intervalId = setInterval(() => {
            if (gameSettings.selectedCharacter !== "meguna") return;
            if (rivalState.health.currentHealth > 0 && !meguna.isJumping && meguna.canMove && !meguna.animationBlocker) {
                // !meguna.cleaveAttack && cleaveReady.ready &&
                if (keysPressed.current.e && meguna.canMove && !meguna.domainAmplification.isActive) {
                    if (meguna.rapidAttackCounter.currentCount >= meguna.rapidAttackCounter.maxCount)
                        localRapidAttack();
                    else {
                        if (meguna.cleaveCD.isReady) {
                            handleDismantleAttack(true, 0)
                        }
                    }
                }
                if (keysPressed.current.r && !meguna.domainAmplification.isActive) {
                    const attackDirection = meguna.x - rivalState.x >= 0 ? "left" : "right";
                    const stepDistance = attackDirection === "left" ? -100 : 100;
                    if (meguna.closeRange && meguna.dismantleCD.isReady) {
                        handleCleaveAttack()
                    }
                }
                if (keysPressed.current.l && !meguna.domainAmplification.isActive) {
                    if (meguna.cursedEnergy.currentCursedEnergy >= 200 && meguna.domainCD.isReady) {
                        dispatch(megunaSlice.actions.setDomainState({ ...meguna.domainStatus, isInitiated: true }))
                        setDomainBugFixer(true);

                    }
                }
                if (keysPressed.current.o) {
                    dispatch(megunaSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 0, timeout: 500, animation: "", animationPriority: 5
                    }));
                }
                if (keysPressed.current.j) {
                    setIsPunchingComboInitiated(true);
                }
                if (keysPressed.current.k) {
                    handleBamAttack()
                }
                if (keysPressed.current.f && !meguna.domainAmplifi1cation.isActive) {
                    handleFugaAttack()
                }
                if (keysPressed.current.g) {
                    // dispatch(megunaSlice.actions.setTakeDamage({
                    //     isTakingDamage: true, damage: 10, takeDamageAnimationCheck: true, knockback: 250, timeout: 300
                    // }));
                    dispatch(rivalSlice.actions.setInfinity(false))
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
                    if (meguna.simpleDomain.isActive) {
                        dispatch(megunaSlice.actions.setSimpleDomain({ ...meguna.simpleDomain, isActive: false }))
                    }
                    else {
                        dispatch(megunaSlice.actions.setSimpleDomain({ ...meguna.simpleDomain, isActive: true }))
                        setTimeout(() => {
                            dispatch2(toggleSimpleDomainCD());
                        }, meguna.simpleDomain.duration * 1000);
                    }
                }
            }

        }, 100);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [dispatch, nue, meguna.cleaveCD.isReady, meguna.dismantleCD.isReady, meguna.closeRange,
        meguna.domainCD.isReady, meguna.cursedEnergy, meguna.isJumping, meguna.direction,
        meguna.animationState, meguna.canMove, meguna.animationBlocker,
        RCT, rctCD, meguna.rct.rctActive, meguna.domainAmplification]);

    useEffect(() => {
        console.log(rctCD)
        setTimeout(() => {
            setRctCD(false);
        }, 500);
    }, [rctCD]);

    // COMBOMOMBO
    const [inputBuffer, setInputBuffer] = useState([]);
    const comboTimeout = useRef(null);

    const addToInputBuffer = (key) => {
        setInputBuffer((prev) => [...prev, key]);
        clearTimeout(comboTimeout.current);
        comboTimeout.current = setTimeout(() => {
            setInputBuffer([]);
            setIsPunchingComboInitiated(false);
            setPunchingComboStage(0);
        }, 500); // Clear buffer after 500ms of inactivity
    };
    const [punchingComboStage, setPunchingComboStage] = useState(0);

    useEffect(() => { // after pressing j
        if (isPunchingComboInitiated) {
            console.log("punch: start");
            handlePunchingCombo1();
        }
    }, [isPunchingComboInitiated])

    useEffect(() => { // first stage completed
        if (punchingComboStage === 1 && inputBuffer.length > 1 && inputBuffer[1] === 'j') {
            console.log("combo inputbuffer", inputBuffer)
            handlePunchingCombo2();
        }
        else if (punchingComboStage === 2 && inputBuffer.length > 2 && inputBuffer[2] === 'j') {
            console.log("combo inputbuffer", inputBuffer)
            handlePunchingCombo3();
        }
        else if (punchingComboStage === 3 && inputBuffer.length > 3 && inputBuffer[3] === 'j') {
            console.log("combo inputbuffer", inputBuffer)
            handlePunchingCombo4();
        }
        else {
            setIsPunchingComboInitiated(false);
            setPunchingComboStage(0);
        }
    }, [punchingComboStage])

    useEffect(() => {
        let int = null;
        let bodyHealCost = -7;
        let bodyHealAmount = 10;
        let ctHealCost = -1;
        if (RCT.rctActive) {
            int = setInterval(() => {
                if (RCT.rctMode === "body") {
                    dispatch(megunaSlice.actions.setRCT({
                        rctActive: true, rctMode: "body"
                    }))
                    if (meguna.health.currentHealth < meguna.health.maxHealth && meguna.cursedEnergy.currentCursedEnergy >= -bodyHealCost) {

                        dispatch(megunaSlice.actions.updateHealth(bodyHealAmount))
                        dispatch(megunaSlice.actions.changeCursedEnergy(bodyHealCost))
                    }
                }
                if (RCT.rctMode === "ct") {
                    if (!meguna.dismantleCD.isReady || !meguna.cleaveCD.isReady || !meguna.domainCD.isReady) {
                        if (meguna.cursedEnergy.currentCursedEnergy >= -ctHealCost) {
                            dispatch(megunaSlice.actions.setRCT({
                                rctActive: true, rctMode: "ct"
                            }))
                            dispatch(megunaSlice.actions.changeCursedEnergy(ctHealCost))
                        }
                        else {
                            dispatch(megunaSlice.actions.setRCT({
                                rctActive: false, rctMode: "ct"
                            }))
                        }
                    }
                }
            }, 100)
        } else {
            dispatch(megunaSlice.actions.setRCT({
                rctActive: false, rctMode: "body"
            }))

        }
        return () => {
            clearInterval(int)
        }
    }, [RCT, meguna.cursedEnergy.currentCursedEnergy < 7, meguna.health.currentHealth < meguna.health.maxHealth,
        meguna.dismantleCD.isReady, meguna.cleaveCD.isReady, meguna.domainCD.isReady
    ])

    const [domainBugFixer, setDomainBugFixer] = useState(false);
    const [domainClashCDref, setDomainClashCDref] = useState(false);

    // *** ULTRA DOMAIN HANDLER
    useEffect(() => {

        if (gameSettings.domainClash && meguna.domainCD.isReady && meguna.cursedEnergy.currentCursedEnergy >= 200) {
            handleDomainAttack();
            dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
            dispatch(gameSettingsSlice.actions.setDomainClash(false));
        }
        else if (meguna.domainStatus.isInitiated === true) { // user pressed domain expansion key or bot initiated domain

            dispatch(megunaSlice.actions.setCanMove(false));
            dispatch(megunaSlice.actions.setDomainState({ ...meguna.domainStatus, isInitiated: false }))
            if (gameSettings.domainClashReady) { // rival already initiated domain
                dispatch(gameSettingsSlice.actions.setDomainClash(true));
                if (tutorialState.tutorialMode) {
                    dispatch(tutorialSlice.actions.completeOneTaskInTutorial({
                        tutorialIndex: tutorialState.currentTaskIndex, taskIndex: 0, character: gameSettings.selectedCharacter
                    }));
                }
            }
            else {
                dispatch(gameSettingsSlice.actions.setDomainClashReady(true));
                setTimeout(() => {
                    setDomainClashCDref(true);
                    dispatch(gameSettingsSlice.actions.setDomainClashReady(false));
                }, 2000);
            }
        }
        else if (meguna.domainStatus.forceExpand) {
            handleDomainAttack();
        }
        else {
            if (domainBugFixer && domainClashCDref === true && meguna.domainCD.isReady && meguna.cursedEnergy.currentCursedEnergy >= 200) {
                handleDomainAttack();
            }
        }
    }, [meguna.domainStatus.isInitiated, meguna.domainStatus.forceExpand, gameSettings.domainClashReady, gameSettings.domainClash,
        domainClashCDref, meguna.domainCD.isReady, domainBugFixer])

    // useEffect(() => {
    //     console.log("aa", domainClashCDref)
    //     if (meguna.domainStatus.isInitiated === true) {
    //         console.log("bb")


    //     }

    // }, [domainClashCDref, meguna.domainStatus.isInitiated === true, gameSettings.domainClash])

    const dispatch2 = useDispatch<AppDispatch>();
    const [fugaSceneStyle, setFugaSceneStyle] = useState({
        animation: "", display: "none", top: 0, left: 0
    });
    const [fireArrowStyle, setFireArrowStyle] = useState({
        animation: "", opacity: 0, left: meguna.x
    });
    const [fugaExplosionStyle, setFugaExplosionStyle] = useState({
        animation: "", display: "none"
    })
    const handleFugaAttack = () => {
        if (meguna.fugaCounter.currentCount < meguna.fugaCounter.maxCount) return;
        dispatch(megunaSlice.actions.setCanMove(false))
        dispatch(megunaSlice.actions.setHardStun(true))
        dispatch(rivalSlice.actions.setCanMove(false))
        dispatch(rivalSlice.actions.setHardStun(true))
        console.log("FUGA")
        fugaSoundEffectRef.current.volume = 0.5
        fugaSoundEffectRef.current.play();
        let attackDirection = "";
        attackDirection = meguna.x < rivalState.x ? "right" : "left";
        dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"));
        dispatch(megunaSlice.actions.setDirection(attackDirection))
        // dispatch(megunaSlice.actions.setAnimationState("fugaBefore")) // first animation
        dispatch(megunaSlice.actions.setAnimationState({ animation: "fugaBefore", animationPriority: 8, finishAnimation: false }));
        // dispatch(megunaSlice.actions.setAnimationBlocker(true))

        setTimeout(() => { // play fuga scene
            setFugaSceneStyle({ animation: "fuga-scene 4s steps(1)", display: "block", top: meguna.y - 250, left: meguna.x - 200 })
            setTimeout(() => {
                setFugaSceneStyle({ animation: "", display: "none", top: meguna.y - 100, left: meguna.x })
            }, 4000);
        }, 1000);
        setTimeout(() => {
            // dispatch(megunaSlice.actions.setAnimationBlocker(false))
            // dispatch(megunaSlice.actions.setAnimationState("fugaAfter")) // second animation
            dispatch(megunaSlice.actions.setAnimationState({ animation: "fugaAfter", animationPriority: 8, finishAnimation: false }));
            // dispatch(megunaSlice.actions.setAnimationBlocker(true))
            setTimeout(() => {
                setFireArrowStyle({ animation: "fire-arrow .5s steps(1)", opacity: 1, left: attackDirection === "left" ? meguna.x - 400 : meguna.x - 50 })
            }, 1700);
            setTimeout(() => {
                // dispatch(megunaSlice.actions.setAnimationBlocker(false))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 8, finishAnimation: true }));

                setTimeout(() => {
                    setFireArrowStyle({ animation: "", opacity: 0, left: meguna.x })

                    setFugaExplosionStyle({ animation: "fuga-explosion 1s steps(1)", display: "block" })
                    // dispatch(rivalSlice.actions.updateHealth(-500))
                    dispatch(rivalSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 500, takeDamageAnimationCheck: true, knockback: 50, timeout: 300, animation: ""
                    })) // check later
                    setTimeout(() => {
                        setFugaExplosionStyle({ animation: "", display: "none" })
                        dispatch(megunaSlice.actions.setFugaCounter(0))
                        dispatch(megunaSlice.actions.setCanMove(true))
                        dispatch(megunaSlice.actions.setHardStun(false))
                        dispatch(rivalSlice.actions.setHardStun(false))
                        dispatch(rivalSlice.actions.setCanMove(true))
                    }, 1000);
                }, 200);
            }, 2000);
        }, 4000);

    }
    const handleBamAttack = useCallback(() => {
        let attackDirection = "";
        attackDirection = meguna.x < rivalState.x ? "right" : "left";
        smashSoundEffectRef.current.volume = 0.1;
        dispatch(megunaSlice.actions.setDirection(attackDirection))
        // dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        // dispatch(megunaSlice.actions.setAnimationState("bam-attack"))
        // dispatch(megunaSlice.actions.setAnimationBlocker(true))
        dispatch(megunaSlice.actions.setAnimationState({ animation: "bam-attack", animationPriority: 5, finishAnimation: false }));

        let landingPosition = rivalState.x;
        // updateRivalDirection(attackDirection === "left" ? "right" : "left");

        setTimeout(() => { // style updates of bam effect and hitbox change, timeout for animation 1400
            dispatch(megunaSlice.actions.setBamLandingPositionX(
                attackDirection === "left" ? landingPosition - 20 : landingPosition - 50))
            setBamStyle({
                display: "block", animation: "meguna-bam-effect steps(1) .5s",
                left: attackDirection === "left" ? landingPosition - 20 : landingPosition - 50
            })
            dispatch(megunaSlice.actions.changeCursedEnergy(10))
            dispatch(megunaSlice.actions.setBamAttackMoment(true))
            setTimeout(() => {
                setBamStyle({ display: "none", animation: "", left: rivalState.x - 100, })
                dispatch(megunaSlice.actions.setBamAttackMoment(false))
            }, 500);
        }, 1400);

        dispatch(megunaSlice.actions.setCanMove(false))
        setTimeout(() => {
            dispatch(megunaSlice.actions.setCanMove(true))
            // dispatch(megunaSlice.actions.setAnimationBlocker(false))
            // dispatch(megunaSlice.actions.setAnimationState("stance"))
            dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
        }, 1500);

        const distanceX = attackDirection === "right" ? rivalState.x - meguna.x - 50 :
            rivalState.x - meguna.x + 100;
        dispatch(megunaSlice.actions.setGravity(4))
        setTimeout(() => {
            dispatch(megunaSlice.actions.jumpWS(40));
        }, 200);
        for (let i = 0; i < 10; i++) { // 
            setTimeout(() => { // random slashes delay
                if (i < 2) { } // 0 1  empty
                else if (i < 4) { // 2 x 10% = 0.2
                    dispatch(megunaSlice.actions.moveCharacter({ x: distanceX / 10, y: 0 }));
                }
                else if (i < 7) { // 3 4 5 -> 3x0.25 = 0.75
                    dispatch(megunaSlice.actions.moveCharacter({ x: distanceX / 4, y: 0 }));
                }
                else if (i < 8) { // 5 6 7 x 30%
                    dispatch(megunaSlice.actions.moveCharacter({ x: distanceX / 20, y: 0 }));
                }
                // else if (i < 10) { //  3 4 5 6 7 8 9 x  20%
                //     dispatch(megunaSlice.actions.moveCharacter({ x: distanceX / 10, y: 0 }));
                // }
                if (i === 7) dispatch(megunaSlice.actions.setGravity(40))
                if (i === 9) dispatch(megunaSlice.actions.setGravity(5))
                if (i === 6) smashSoundEffectRef.current.play();
                // else { // 5 x 1/10
                //     dispatch(megunaSlice.actions.moveCharacter({ x: distanceX / 50, y: 0 }));
                // }
            }, i * 100);
        }
    }, [meguna.x, rivalState.x])
    const [chaseForCloseCombat, setChaseForCloseCombat] = useState(false);

    const preComboAdjustments = () => {
        if (Math.abs(xDistance) > 150) throw new Error("too far");
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = meguna.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(megunaSlice.actions.setDirection(attackDirection))
        dispatch(megunaSlice.actions.setAnimationState({ animation: "meguna-punch-1", animationPriority: 3, finishAnimation: false }));
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        }
        dispatch(megunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 50 : rivalState.x + 50, y: meguna.y }))
    }
    const handlePunchingCombo1 = () => {
        try {
            preComboAdjustments()
            let punchCount = 0;
            const int = setInterval(() => {
                if (punchCount === punch_combo_animation.stages[0].action_frame_number) {
                    setChaseForCloseCombat(true)
                    dispatch(rivalSlice.actions.setTakeDamage({
                        isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 3
                    }))
                    punchSoundEffectRef.current.play();
                    setTimeout(() => {
                        punchSoundEffectRef.current.pause();
                        punchSoundEffectRef.current.currentTime = 0;
                    }, 80);
                }
                else if (punchCount === punch_combo_animation.stage_count) {
                    clearInterval(int)
                    setPunchingComboStage(1); // prepare for checking next stage
                }
                punchCount++;
            }, punch_combo_animation.stages[0].duration / punch_combo_animation.stages[0].step_count);
        } catch (error) {
            console.log("Error in combo 1: ", error)
        }
    }
    const handlePunchingCombo2 = () => {

        dispatch(megunaSlice.actions.setAnimationState({ animation: "meguna-punch-2", animationPriority: 4, finishAnimation: false }));
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === punch_combo_animation.stages[1].action_frame_number) {
                setChaseForCloseCombat(true)
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 3
                }))
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 80);
            }
            else if (punchCount === punch_combo_animation.stages[1].step_count) {
                clearInterval(int)
                setPunchingComboStage(2); // prepare for checking next stage
            }
            punchCount++;
        }, punch_combo_animation.stages[1].duration / punch_combo_animation.stages[1].step_count);
    }

    const handlePunchingCombo3 = () => {

        dispatch(megunaSlice.actions.setAnimationState({ animation: "meguna-punch-3", animationPriority: 5, finishAnimation: false }));
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 2) {
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 300, timeout: 200, animation: "", animationPriority: 7
                }))
                dispatch(rivalSlice.actions.jumpWS(30))
                punchSoundEffectRef.current.play();
                // increase ce
                dispatch(megunaSlice.actions.changeCursedEnergy(20))
            }
            else if (punchCount === 4) {
                clearInterval(int)
                setPunchingComboStage(3); // prepare for checking next stage
            }
            punchCount++;
        }, 200 / 4);
    }
    const handlePunchingCombo4 = () => {

        dispatch(megunaSlice.actions.setAnimationState({ animation: "meguna-punch-4", animationPriority: 6, finishAnimation: false }));
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 2) {
                localDismantleAttack(false, 100);
            }
            else if (punchCount === 3) {
                clearInterval(int)
                setPunchingComboStage(3); // prepare for checking next stage
            }
            punchCount++;
        }, 200 / 3);
    }

    const handlePunchingCombo = useCallback(() => {
        if (Math.abs(xDistance) > 150) return;
        punchSoundEffectRef.current.volume = 0.5;
        const attackDirection = meguna.x - rivalState.x >= 0 ? "left" : "right";
        dispatch(megunaSlice.actions.setDirection(attackDirection))
        dispatch(megunaSlice.actions.setAnimationState({ animation: "meguna-punch-combination", animationPriority: 3, finishAnimation: false }));
        dispatch(megunaSlice.actions.setCanMove(false));
        if (!rivalState.isBlocking) {
            dispatch(rivalSlice.actions.setDirection(attackDirection === "left" ? "right" : "left"))
        }
        dispatch(megunaSlice.actions.moveCharacterTo({ x: attackDirection === "right" ? rivalState.x - 50 : rivalState.x + 50, y: meguna.y }))
        let punchCount = 0;
        const int = setInterval(() => {
            if (punchCount === 1 || punchCount === 4) {
                setChaseForCloseCombat(true)
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 10, takeDamageAnimationCheck: false, knockback: 0, timeout: 50, animation: "", animationPriority: 3
                }))
                punchSoundEffectRef.current.play();
                setTimeout(() => {
                    punchSoundEffectRef.current.pause();
                    punchSoundEffectRef.current.currentTime = 0;
                }, 80);
            }

            else if (punchCount === 7) { // last hit
                dispatch(rivalSlice.actions.setTakeDamage({
                    isTakingDamage: true, damage: 20, takeDamageAnimationCheck: true, knockback: 300, timeout: 200, animation: "", animationPriority: 7
                }))
                dispatch(rivalSlice.actions.jumpWS(30))
                punchSoundEffectRef.current.play();
                // increase ce
                dispatch(megunaSlice.actions.changeCursedEnergy(20))
            }
            else if (punchCount === 10) {
                localDismantleAttack(false, 100);
            }
            else if (punchCount === punch_combo_frames) {
                clearInterval(int)
            }
            punchCount++;
        }, punch_combo_duration / punch_combo_frames)
        setTimeout(() => { // after animation
            dispatch(megunaSlice.actions.setCanMove(true));
        }, punch_combo_duration);
    }, [meguna.x, rivalState.x, meguna.domainAmplification.isActive, rivalState.domainAmplification.isActive])

    const handleTakeDamage = useCallback((takeDamageAnimationCheck, timeout, damage, knockback, animation, animationPriority) => {
        dispatch(megunaSlice.actions.updateHealth(-damage));
        console.log("takedamge: ", damage, knockback)
        if (knockback && knockback > 0)
            dispatch(megunaSlice.actions.moveCharacterWD({ x: meguna.direction === "left" ? knockback : -knockback, y: 0 }))
        if (takeDamageAnimationCheck && !meguna.animationBlocker) {
            dispatch(megunaSlice.actions.setHardStun(true));
            if (animation !== "")
                // dispatch(megunaSlice.actions.setAnimationState(animation));
                dispatch(megunaSlice.actions.setAnimationState({ animation: animation, animationPriority: animationPriority, finishAnimation: false }));
            else
                // dispatch(megunaSlice.actions.setAnimationState("take-damage"));
                dispatch(megunaSlice.actions.setAnimationState({ animation: "take-damage", animationPriority: animationPriority, finishAnimation: false }));
            dispatch(megunaSlice.actions.setTransition("all .2s ease, transform 0s, left .8s ease-in-out"));
            dispatch(megunaSlice.actions.setAnimationBlocker(true));
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationBlocker(false));
                dispatch(megunaSlice.actions.setHardStun(false)); // ****
                console.log("***finish", animationPriority)
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: animationPriority, finishAnimation: true }));
                dispatch(megunaSlice.actions.setTransition("all .2s ease, transform 0s"));
                dispatch(megunaSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 0, animation: "", animationPriority: 0 }));
            }, animation !== "" ? 500 : 300 + timeout);
        }
        else {
            setTimeout(() => {
                dispatch(megunaSlice.actions.setTakeDamage({ isTakingDamage: false, damage: 0, takeDamageAnimationCheck: false, knockback: 0, timeout: 0, animation: "", animationPriority: 0 }));
            }, timeout);
        }
    }, [meguna.direction]);
    useEffect(() => {
        const obj = meguna.takeDamage;
        if (obj.isTakingDamage) {
            handleTakeDamage(obj.takeDamageAnimationCheck, obj.timeout, obj.damage, obj.knockback, obj.animation, obj.animationPriority);
        }
    }, [meguna.takeDamage.isTakingDamage === true])
    const handleDismantleAttack = (animation: boolean, knockback: number) => {
        dispatch2(toggleCleaveCD()); // cooldown control
        localDismantleAttack(animation, knockback); // attack
        dispatch(megunaSlice.actions.setRapidAttackCounter(meguna.rapidAttackCounter.currentCount + 1));
        dispatch(megunaSlice.actions.increaseFugaCounter(1))
    };
    const handleCleaveAttack = () => {
        dispatch2(toggleDismantleCD()); // cooldown control
        localCleaveAttack(100); // attack
        dispatch(megunaSlice.actions.setRapidAttackCounter(meguna.rapidAttackCounter.currentCount + 3));
        dispatch(megunaSlice.actions.increaseFugaCounter(2))
    };

    const handleDomainAttack = () => {
        dispatch2(toggleDomainCD()); // cooldown control
        megunaDomainExpansion(); // attack
    };

    const [megunaStyle, setMegunaStyle] = React.useState({
        animation: "stance-meguna steps(1) 1s infinite",
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
        if (meguna.animationState === "stance") { // #AC
            // if (meguna.direction === "left") {
            //     console.log("meguna dir: ", meguna.direction)
            //     dispatch(megunaSlice.actions.setPositioningSide("right"))
            // }
            // dispatch(megunaSlice.actions.setPositioningSide("left"))
            setMegunaStyle({
                animation: "meguna-stance 1s steps(4) infinite",
                // animation: "meguna-domain-pose 1s steps(7) infinite",
            })
        }
        else if (meguna.animationState === "first-pose") {
            if (meguna.direction === "right")
                dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-first-pose 1s steps(1) infinite",
            })
            setTimeout(() => {
                if (meguna.direction === "right") dispatch(megunaSlice.actions.setPositioningSide("left"))

            }, 3000);
        }
        else if (meguna.animationState === "move") {
            setMegunaStyle({
                animation: "meguna-walk 1.3s steps(8) infinite",
            })
        }
        else if (meguna.animationState === "entry") { // requires reverse positioning
            setMegunaStyle({
                // animation: "meguna-entry 1s steps(1)",
                animation: "meguna-dismantle-pose .3s steps(4) forwards",

            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 31, finishAnimation: true }));
            }, 1000);
        }
        else if (meguna.animationState === "jump") {
            setMegunaStyle({
                animation: "meguna-jump 1.5s steps(5)",
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 2, finishAnimation: true }));
            }, 1500);
        }
        else if (meguna.animationState === "meguna-punch-combination") { // requires reverse positioning
            setMegunaStyle({
                animation: `meguna-punch-combination ${punch_combo_duration}ms steps(${punch_combo_frames})`,
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 3, finishAnimation: true }));
            }, punch_combo_duration);
        }
        else if (meguna.animationState === "meguna-punch-1") { // requires reverse positioning
            setMegunaStyle({
                animation: `meguna-punch-1 ${punch_combo_animation.stages[0].duration}ms 
                    steps(${punch_combo_animation.stages[0].step_count}) forwards`
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 3, finishAnimation: true }));
            }, punch_combo_animation.stages[0].duration);
        }
        else if (meguna.animationState === "meguna-punch-2") { // requires reverse positioning
            setMegunaStyle({
                animation: `meguna-punch-2 ${punch_combo_animation.stages[1].duration}ms 
                    steps(${punch_combo_animation.stages[1].step_count}) forwards`,
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 4, finishAnimation: true }));
            }, 200);
        }
        else if (meguna.animationState === "meguna-punch-3") { // requires reverse positioning
            setMegunaStyle({
                animation: `meguna-punch-3 200ms steps(5) forwards`,
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 200);
        }
        else if (meguna.animationState === "meguna-punch-4") { // requires reverse positioning
            setMegunaStyle({
                animation: `meguna-punch-4 500ms steps(3) forwards`,
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 6, finishAnimation: true }));
            }, 500);
        }
        else if (meguna.animationState === "meguna-blackflash-combination") { // requires reverse positioning
            if (meguna.direction === "left")
                dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-blackflash-combination 1.5s steps(1)",
            })
            setTimeout(() => {
                if (meguna.direction === "left")
                    dispatch(megunaSlice.actions.setPositioningSide("left"))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 4, finishAnimation: true }));
            }, 1500);
        }
        else if (meguna.animationState === "meguna-kick-combo") { // requires reverse positioning
            if (meguna.direction === "left")
                dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-kick-combo 3s steps(1)",
            })
            setTimeout(() => {
                if (meguna.direction === "left")
                    dispatch(megunaSlice.actions.setPositioningSide("left"))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 3, finishAnimation: true }));
            }, 3000);
        }
        else if (meguna.animationState === "dismantle") { // requires reverse positioning
            setMegunaStyle({
                animation: "meguna-dismantle-pose .3s steps(4) forwards",
            })
            setTimeout(() => {
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 1000);
        }
        else if (meguna.animationState === "meguna-red-horizontal") { // requires reverse positioning
            if (meguna.direction === "left")
                dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-red-horizontal 3s steps(1)",
            })
            setTimeout(() => {
                if (meguna.direction === "left")
                    dispatch(megunaSlice.actions.setPositioningSide("left"))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 3000);
        }
        else if (meguna.animationState === "meguna-red-vertical") { // requires reverse positioning
            if (meguna.direction === "left")
                dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-red-vertical 3s steps(1)",
            })
            setTimeout(() => {
                if (meguna.direction === "left")
                    dispatch(megunaSlice.actions.setPositioningSide("left"))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 5, finishAnimation: true }));
            }, 3000);
        }
        else if (meguna.animationState === "meguna-makingPurple") { // requires reverse positioning
            if (meguna.direction === "left") {
                dispatch(megunaSlice.actions.setPositioningSide("right"))
                setMegunaStyle({
                    animation: "meguna-makingPurple-left 3s steps(1)",
                })
            }
            else {
                setMegunaStyle({
                    animation: "meguna-makingPurple 3s steps(1)",
                })
            }

            setTimeout(() => {
                if (meguna.direction === "left")
                    dispatch(megunaSlice.actions.setPositioningSide("left"))
                // dispatch(megunaSlice.actions.setAnimationState("stance"))
                dispatch(megunaSlice.actions.setAnimationState({ animation: "stance", animationPriority: 10, finishAnimation: true }));
            }, 3000);
        }
        else if (meguna.animationState === "domain-pose") {
            setMegunaStyle({
                animation: "meguna-domain-pose 1s steps(5) forwards",
            })
            // setTimeout(() => {
            //     if (meguna.direction === "left")
            //         dispatch(megunaSlice.actions.setPositioningSide("left"))
            //     dispatch(megunaSlice.actions.setAnimationState("stance"))
            // }, 1000);
        }
        else if (meguna.animationState === "take-damage") { // requires reverse positioning
            // if (meguna.direction === "left")
            //     dispatch(megunaSlice.actions.setPositioningSide("right"))
            setMegunaStyle({
                animation: "meguna-take-damage .5s steps(2) forwards",
            })
        }
        else {
            console.log("Unknown animation: ", meguna.animationState)
            setMegunaStyle({
                animation: "meguna-stance 1s steps(1) infinite",
            })
        }
    }, [meguna.animationState]);

    useEffect(() => {
        if (meguna.devStun)
            console.log("meguna stunned!")
        else
            console.log("meguna is not stunned anymore")
    }, [meguna.devStun])

    // RAPID ATTACK
    const rapidSlashSoundEffectRef = React.useRef(null);
    const actionTriggered = React.useRef(false);


    // Tutorial Effect
    useEffect(() => {
        if (gameSettings.selectedCharacter === "meguna") return;
        console.log("rivalaction1")
        if (tutorialState.tutorialMode && !actionTriggered.current) {
            console.log("rivalaction2", tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalAction)
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "domain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(megunaSlice.actions.setDomainState({ ...meguna.domainStatus, isInitiated: true }))
                    setDomainBugFixer(true);
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
            if (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.action === "forceDomain") {
                actionTriggered.current = true;
                setTimeout(() => {
                    dispatch(megunaSlice.actions.setDomainState({ ...meguna.domainStatus, forceExpand: true }))
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
                    localDismantleAttack(true, 50)
                    actionTriggered.current = false;
                }, (tutorialState.characters[gameSettings.selectedCharacter][tutorialState.currentTaskIndex].rivalTaskAction.timeout) * 1000);
            }
        }
    }, [tutorialState.currentTaskIndex])

    return (
        <div>
            <audio src={require("../../Assets/audios/sukuna.mp3")} ref={megunaSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash-3.mp3")} ref={rapidSlashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/rapid-slash.mp3")} ref={domainSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/smash.mp3")} ref={smashSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/fuga-sound-effect.mp3")} ref={fugaSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/punch.mp3")} ref={punchSoundEffectRef}></audio>
            <audio src={require("../../Assets/audios/slash.mp3")} ref={slashSoundEffectRef}></audio>
            {/* <div className='dotot' style={{
                width: "10px", height: "100px", backgroundColor: "black",
                position: "absolute", bottom: gameAreaHeight - meguna.y, left: meguna.x, zIndex: 99, transition: ".2s all"
            }}></div> */}
            <div className='malevolent-shrine' ref={malevolentShrineRef}
                style={{
                    display: "none"
                }}
            ></div>
            <div className="animation-container" style={{
                top: "50%",
                left: gameSettings.selectedCharacter === "meguna" ? "25%" : "75%",
            }}
                ref={panelRef}>
                <div className="line"></div>
                <div className="panel">
                    <img src={require("../../Assets/sukunapanel.png")} alt="Manga Panel" />
                </div>
            </div>

            <div className="rct-body"
                style={{
                    left: meguna.x, top: RCT.rctMode === "body" ? meguna.y + 15 : meguna.y,
                    translate: meguna.direction === "right" ? "-27px -100%" : "-28px -100%",
                    display: RCT.rctActive ? "block" : "none",
                    animation: RCT.rctMode === "body" ? "rct-heal 1s steps(17) infinite" : "rct-ct 1s steps(19) infinite"
                }}
            // animation: rct-heal 1s steps(17) infinite;
            // animation: rct-ct 1s steps(19) infinite;
            ></div>

            {/* {meguna.animationBlocker ? "true" : "false"} */}
            <div className="fuga-scene" style={{
                animation: fugaSceneStyle.animation, display: fugaSceneStyle.display,
                top: fugaSceneStyle.top, left: fugaSceneStyle.left,
                transform: meguna.direction === "right" ? "scaleX(-1)" : "none",

            }}></div>
            <div className="fire-arrow" style={{
                ...fireArrowStyle, top: meguna.y - 50,
                left: fireArrowStyle.opacity === 0 ? meguna.x : rivalState.x,
                transform: meguna.direction === "left" ? "scaleX(-1)" : "none",

            }}></div>
            <div className="fuga-explosion" style={{ left: rivalState.x, ...fugaExplosionStyle }}></div>
            <div className="meguna-bam-effect" style={{
                top: 470, ...bamStyle
            }}>
            </div>
            <div className='megunaCC' style={{
                bottom: gameAreaHeight - meguna.y,
                left: meguna.positioningSide === "left" ? meguna.x : undefined,
                right: meguna.positioningSide === "right" ? 1400 - meguna.x - 40 : undefined,
                transform: meguna.direction === "left" ? "scaleX(-1)" : "none",
                animation: megunaStyle.animation,
                display: meguna.health.currentHealth > 0 ? "block" : "none",
                transition: meguna.transition,
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
                    meguna.domainStatus.isActive && meguna.domainStatus.sureHitStatus ? "block" : "none",
                // rotate: slashRotation.rotate
            }}></div>

            <div className="meguna-container"
                style={{
                    bottom: gameAreaHeight - meguna.y, left: meguna.x,
                    display: meguna.health.currentHealth > 0 ? "block" : "none",
                }}>

                {/* </div> */}
                {/* Rakip karakterinin görseli veya animasyonu burada yer alacak */}
                {/* <img src={megunaImage.src} alt="" style={{ transition: "transform 1s", height: characterHeight, transform: "scale(" + megunaImage.scale + ")" }} /> */}
                <img src={require('../../Assets/electricity.png')} alt="" style={{ position: "absolute", top: "-55px", left: "-20px", display: electricityEffect ? "block" : "none", height: "60px", width: "50px", opacity: 0.8, scale: "1.2", zIndex: 999 }} />
                <img src={require('../../Assets/claw-mark.png')} alt="" style={{ position: "absolute", top: "-75px", left: "-20px", display: divineDogs.isAttacking ? "block" : "none", height: "80px", width: "70px", opacity: 0.8, scale: "1.2" }} />

                <div className="meguna-domain-amplification" style={{
                    display: meguna.isBlocking ? "block" : "none",
                    position: "absolute", top: -110, left: 0,
                    transform: meguna.direction === "left" ? "scaleX(-1)" : "none",
                    translate: meguna.direction === "left" ? "-50% 0" : "-50% 0"
                }} />
            </div>
        </div>
    );
});

export default Meguna;
