import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CircularProgressBar from "./CircularProgressBar";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import sukunaSlice from "../redux/character-slices/SukunaSlice";
import gojoSlice from "../redux/character-slices/GojoSlice";

const Tooltip = ({ skill }) => {
    return (
        <div className="tooltip" style={{ top: "480px", left: 100 + skill.index * 43 }}>
            <p style={{ color: "white", whiteSpace: "pre-wrap" }}>
                {skill.text}
            </p>
        </div>
    );
};


function CharacterInterface({ playerCharacter, rivalCharacter }) {

    const dispatch = useDispatch();
    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const megumi = useSelector((state: any) => state.MegumiState);
    const gojo = useSelector((state: any) => state.GojoState);
    const nue = useSelector((state: any) => state.NueState);
    const characterHeight = "80px";
    const [render, setRender] = React.useState(0);
    const keysPressed = React.useRef({ shift: false });

    const purpleCost = -150;

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = true;
            if (key === "shift") {
                console.log("rerender")
                setRender(render + 1)
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            keysPressed.current[key] = false;
            if (key === "shift") {
                setRender(render + 1)
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

    }, []);
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const skillDescriptions = {
        blue: "Cursed Technique Lapse: Blue \n Use infinity's gravitional power to damage and pull your enemies.",
        red: "Cursed Technique Reversal: Red\n Use infinity's explosive power to damage and knock back your enemies. ",
        purple: "Hollow Technique: Purple\n Collide the Lapse and Reversal of the Limitless, resulting in an imaginary mass that is launched at the target to deal destructive damage.",
        domain: "Domain Expansion: Unlimited Void\n Expand your domain to deal massive damage and stun all enemies.",
        dismantle: "Sukuna's default ranged slashing attack that can be used against cursed spirits and sorcerers to great effectiveness.",
        cleave: "A slashing attack that adjusts itself depending on the target's toughness and cursed energy level to cut them down in one fell swoop.",
        shrine: "Everything within the domain is relentlessly slashed with either Dismantle or Cleave, depending on its cursed energy level. ",
        rapidSlash: "Sukuna makes a rapid slashing attack to single target",
        fuga: "Sukuna can create and manipulate fire for long-range attack by chanting (Fūga) and forming an arrow. "

        // Diğer skill açıklamaları buraya eklenebilir
    };

    const handleMouseEnter = (skill, event) => {
        setHoveredSkill(skill);
        console.log(skillDescriptions[skill])
        // setTooltipPosition({
        //     top: rect.top - 40, // Tooltip'in yukarıda görünmesi için ayarlama
        //     left: rect.left + rect.width / 2 - 50, // Tooltip'i ortalamak için ayarlama
        // });
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null); // Hover bittiğinde skill bilgisini sıfırla
    };
    return (
        <div>
            <div className="top-interface">
                <div className="top-interface-inner">
                    <div>
                        <div className="player-image-container">
                            <img src={require(`../Assets/profiles/${playerCharacter.characterName}-profile.png`)} alt="" />
                        </div>
                        <div className="health-bar">
                            <div className="player-health-progress" style={{
                                display: playerCharacter.health.currentHealth >= 0 ? "block" : "none",
                                position: "absolute", width: playerCharacter.health.currentHealth * 500 / playerCharacter.health.maxHealth,
                                maxWidth: "500px", height: "25px",
                                backgroundColor: "red",
                                transition: "width .2s ease-out",
                            }}></div>
                        </div>
                        <div className="cursed-energy-bar">
                            <div style={{
                                display: playerCharacter.cursedEnergy.currentCursedEnergy >= 0 ? "block" : "none",
                                position: "absolute", width: playerCharacter.cursedEnergy.currentCursedEnergy * 350 / playerCharacter.cursedEnergy.maxCursedEnergy,
                                maxWidth: "350px", height: "25px", backgroundColor: "#068F98",
                                transition: "width .2s ease-out",

                            }}>
                                <img src={require(`../Assets/ce-bar.png`)} style={{
                                    display: playerCharacter.cursedEnergy.currentCursedEnergy >= playerCharacter.cursedEnergy.maxCursedEnergy
                                        ?
                                        playerCharacter.rct.rctActive ? "none" : "block"
                                        : "none",
                                    width: 400, position: "absolute", top: -75, left: -30, translate: "-50%, -50%",
                                    backgroundSize: "cover",
                                }} />
                            </div>
                        </div>
                    </div>
                    <div>

                        <div className="rival-image-container">
                            <img src={require(`../Assets/profiles/${rivalCharacter.characterName}-profile.png`)} alt="" />
                        </div>
                        <div className="health-bar" style={{
                            left: "58.4%",
                        }}>
                            <div className="rival-health-progress" style={{
                                display: rivalCharacter.health.currentHealth >= 0 ? "block" : "none",
                                position: "absolute", width: rivalCharacter.health.currentHealth * 500 / rivalCharacter.health.maxHealth,
                                maxWidth: "500px", height: "25px", backgroundColor: "red",
                                marginLeft: 500 - (rivalCharacter.health.currentHealth * 500 / rivalCharacter.health.maxHealth),
                                // transition: "width .5s ease-out",
                            }}></div>
                        </div>
                        <div className="cursed-energy-bar" style={{
                            left: "69%",
                        }}>
                            <div style={{
                                display: rivalCharacter.cursedEnergy.currentCursedEnergy >= 0 ? "block" : "none",
                                position: "absolute", width: rivalCharacter.cursedEnergy.currentCursedEnergy * 350 / rivalCharacter.cursedEnergy.maxCursedEnergy,
                                maxWidth: "350px", height: "25px", backgroundColor: "#068F98",
                                marginLeft: 350 - (rivalCharacter.cursedEnergy.currentCursedEnergy * 350 / rivalCharacter.cursedEnergy.maxCursedEnergy),
                                // transition: "width .2s ease-out",
                            }}>
                                <img src={require(`../Assets/ce-bar.png`)} style={{
                                    display: rivalCharacter.cursedEnergy.currentCursedEnergy >= rivalCharacter.cursedEnergy.maxCursedEnergy
                                        ? "block" : "none",
                                    width: 400, position: "absolute", top: -75, left: -30, translate: "-50%, -50%",
                                    backgroundSize: "cover",
                                }} />
                            </div>
                        </div>
                        {/* <img src={require("../Assets/sukuna-logo.png")} className="sukuna-logo" /> */}
                    </div>
                </div>
            </div>

            <div>
                {/* Eğer hover edilen bir skill varsa Tooltip göster */}
                {hoveredSkill && (
                    <Tooltip
                        skill={skillDescriptions[hoveredSkill]}
                    // position={{ top: "200px", left: "300px" }}
                    />
                )}
                {/* PLAYER INTERFACE COMPONENT FOR SUKUNA */}
                {playerCharacter.characterName === "sukuna" && (

                    <div className="player-interface">

                        <div className="skills-container">

                            {/* Dismantle Attack */}
                            <div className="skill stylecontrolleft" data-tooltip={skillDescriptions.dismantle}>
                                {/* <CircularProgressBar skillCD={sukuna.cleaveCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.cleaveCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-dismantle" style={{
                                        position: "absolute",
                                        top: "-22px", left: "-17px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.cleaveCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.cleaveCD.isReady ? "" : sukuna.cleaveCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Dismantle:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {sukuna.cleaveCD.isReady ? "Ready - J" :
                                        (sukuna.cleaveCD.remainingTime + "sec")}</p> */}
                            </div>

                            {/* Cleave Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.cleave}>
                                {/* <CircularProgressBar skillCD={sukuna.dismantleCD} /> */}

                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.dismantleCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-cleave" style={{
                                        position: "absolute",
                                        top: "-25px", left: "-25px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.dismantleCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.dismantleCD.isReady ? "" : sukuna.dismantleCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Cleave:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {sukuna.dismantleCD.isReady ?
                                        (sukuna.closeRange ? "Ready - K" : "Get Closer") :
                                        (sukuna.dismantleCD.remainingTime + "sec")}</p> */}
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.shrine}
                                style={{ cursor: "pointer" }} onClick={() => dispatch(sukunaSlice.actions.setDomainState(
                                    { ...sukuna.domainStatus, forceExpand: true }))}>
                                {/* <CircularProgressBar skillCD={rivalCharacter.domainCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.domainCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/malevolent_shrine.png")} alt="" style={{}} />

                                    <div className="cooldown-fade" style={{ display: sukuna.domainCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.domainCD.isReady ? "" : sukuna.domainCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Domain:</p> */}
                                {/* <p style={{ marginTop: "-10px" }}>{rivalCharacter.domainCD.isReady ?
                                    (rivalCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                    (rivalCharacter.domainCD.remainingTime + "sec")}</p> */}
                            </div>
                            {/* Rapid Slash */}
                            <div className="skill" data-tooltip={skillDescriptions.rapidSlash}>
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-rapid" style={{
                                        position: "absolute",
                                        top: "-25px", left: "-25px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "none" : "block" }}></div>
                                    {/* <div className="cd-timer" style={{ zIndex: 999, color: "lightblue" }}>{sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "" :
                                        sukuna.rapidAttackCounter.currentCount + "/" + sukuna.rapidAttackCounter.maxCount}
                                    </div> */}
                                </div>

                                {/* <CircularProgressbar
                                    value={sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100}
                                    text={`${sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100}%`}
                                    className="circular-skill-progress-bar"
                                    styles={buildStyles({
                                        // Text size
                                        textSize: '16px',
                                        // Colors
                                        pathColor: (sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100) >= 100 ? "green" : `rgba(62, 152, 199)`,
                                        textColor: 'transparent',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#3e98c7',
                                    })}
                                /> */}
                                <p style={{ marginTop: "5px", lineBreak: "loose" }}>Rapid attack:</p>
                                <p style={{ marginTop: "-10px" }}> {sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "Ready - J" : sukuna.rapidAttackCounter.currentCount + "/" + sukuna.rapidAttackCounter.maxCount} </p>
                            </div>
                            {/* FURNITURE */}
                            <div className="skill" data-tooltip={skillDescriptions.fuga}>
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-fuga" style={{
                                        position: "absolute",
                                        top: "-142px", left: "-114px", zIndex: 9,
                                        width: "277px", height: "333px",
                                        scale: ".10"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "none" : "block" }}></div>
                                </div>

                                {/* <CircularProgressbar
                                    value={sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100}
                                    text={`${sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100}%`}
                                    className="circular-skill-progress-bar"
                                    styles={buildStyles({
                                        // Text size
                                        textSize: '16px',
                                        // Colors
                                        pathColor: (sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100) >= 100 ? "red" : `rgba(62, 152, 199)`,
                                        textColor: 'transparent',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#3e98c7',
                                    })}
                                /> */}
                                <p style={{ marginTop: "5px", lineBreak: "loose" }}>Fuga:</p>
                                <p style={{ marginTop: "-10px" }}> {sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "Ready - F" : sukuna.fugaCounter.currentCount + "/" + sukuna.fugaCounter.maxCount} </p>
                            </div>
                        </div>


                    </div>
                )}

                {/* PLAYER INTERFACE COMPONENT FOR MEGUMI */}
                {playerCharacter.characterName === "megumi" && (

                    <div className="player-interface">
                        <div className="skills-container">

                            {/* Nue Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={playerCharacter.nueAttackCD} />
                                <img src={require('../Assets/nue-side.png')} alt="" style={{ scale: "0.8" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Nue Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.nueAttackCD.isReady ?
                                        (nue.isActive ? "Ready - j" : "Call Nue First") :
                                        (playerCharacter.nueAttackCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Call Nue */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.callNueCD} />
                                <img src={require("../Assets/nue.png")} alt="" style={{ scale: "0.8", marginTop: "5px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    {nue.isActive ? "Cancel Nue:" : "Call Nue:"}</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.callNueCD.isReady ? "Ready - K" :
                                        (playerCharacter.callNueCD.remainingTime + "sec")}</p>
                            </div>


                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.divineDogsCD} />
                                <img src={require("../Assets/white-wolf.png")} alt="" style={{ scale: "0.8", marginTop: "10px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Wolf Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.divineDogsCD.isReady ?
                                        (playerCharacter.divineDogsCD.isReady ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                        (playerCharacter.divineDogsCD.remainingTime + "sec")}</p>
                            </div>
                        </div>
                        {/* Rapid Slash
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (playerCharacter.rapidAttackCounter.currentCount / playerCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {playerCharacter.rapidAttackCounter.currentCount >= playerCharacter.rapidAttackCounter.maxCount ? "Ready - J" : playerCharacter.rapidAttackCounter.currentCount + "/" + playerCharacter.rapidAttackCounter.maxCount} </p>
              </div> */}

                    </div>
                )}

                {/* PLAYER INTERFACE COMPONENT FOR GOJO*/}
                {playerCharacter.characterName === "gojo" && (

                    <div className="player-interface">

                        <div className="skills-container">

                            {/* Blue Attack */}
                            <div className="skill stylecontrolleft" data-tooltip={skillDescriptions.blue}>
                                {/* <CircularProgressBar skillCD={playerCharacter.blueCD} /> */}
                                {/* <img src={require('../Assets/blue.png')} alt="" style={{ scale: "0.6" }} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        filter: gojo.blueCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="gojo-blue-skill" style={{
                                        scale: "0.4",
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: gojo.blueCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.blueCD.isReady ? "" : gojo.blueCD.remainingTime}</div>
                                </div>
                                {/*<p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    {keysPressed.current.shift ? "Charged BLUE" : "BLUE "}
                                </p>
                                 <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.blueCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >=
                                            (keysPressed.current.shift ? 100 : 50) ?
                                            (keysPressed.current.shift ? "Ready - SHIFT + E" : "Ready - E") :
                                            "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy +
                                            (keysPressed.current.shift ? "/100" : "/50")) :
                                        (playerCharacter.blueCD.remainingTime + "sec")}</p> */}
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Red  */}
                            <div className="skill" data-tooltip={skillDescriptions.red}>
                                {/* <CircularProgressBar skillCD={playerCharacter.redCD} /> */}
                                {/* <img src={require("../Assets/red.png")} alt="" style={{ scale: "0.6", marginTop: "0px" }} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: gojo.redCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="gojo-red-skill" style={{ scale: "0.4" }}></div>
                                    <div className="cooldown-fade" style={{ display: gojo.redCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.redCD.isReady ? "" : gojo.redCD.remainingTime}</div>
                                </div>

                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    {keysPressed.current.shift ? "Charged RED:" : "RED:"}</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.redCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >=
                                            (keysPressed.current.shift ? 150 : 100) ?
                                            (keysPressed.current.shift ? "Ready - SHIFT + R" : "Ready - R") :
                                            "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy +
                                            (keysPressed.current.shift ? "/150" : "/100")) :
                                        (playerCharacter.redCD.remainingTime + "sec")}</p> */}
                            </div>


                            {/* Purple Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.purple}>
                                {/* <CircularProgressBar skillCD={playerCharacter.redCD.remainingTime > playerCharacter.blueCD.remainingTime ?
                                    playerCharacter.redCD : playerCharacter.blueCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#4d00b5",
                                        filter: gojo.redCD.isReady && gojo.blueCD.isReady ? "blur(1px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/purple.png")} alt="" style={{ scale: "1.06", marginTop: "0px" }} />

                                    <div className="cooldown-fade" style={{ display: gojo.redCD.isReady && gojo.blueCD.isReady ? "none" : "block" }}></div>
                                    {/* <div className="cd-timer">{gojo.redCD.isReady && gojo.blueCD.isReady ? "" : gojo.redCD.remainingTime}</div> */}
                                </div>
                                {/*                                 
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>PURPLE:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.redCD.isReady && playerCharacter.blueCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= -purpleCost ? "Ready - E+R" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/" + (-purpleCost)) :
                                        (playerCharacter.redCD.remainingTime > playerCharacter.blueCD.remainingTime ?
                                            (playerCharacter.redCD.remainingTime + "sec") : (playerCharacter.blueCD.remainingTime + "sec"))}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.domain}
                                style={{ cursor: "pointer" }} onClick={() => dispatch(gojoSlice.actions.setDomainState(
                                    { ...gojo.domainStatus, forceExpand: true }))}>
                                {/* <CircularProgressBar skillCD={playerCharacter.domainCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "black",
                                        filter: gojo.redCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/domain-hand.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />

                                    <div className="cooldown-fade" style={{ display: gojo.domainCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.domainCD.isReady ? "" : gojo.domainCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", width: "65px", textAlign: "left" }}>INFINITE VOID:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.domainCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - E+R" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/" + 200) :
                                        playerCharacter.domainCD.remainingTime + "sec"}</p> */}
                            </div>
                        </div>

                    </div>
                )}

                {/* RIVAL INTERFACE COMPONENT FOR SUKUNA */}
                {rivalCharacter.characterName === "sukuna" && (

                    <div className="rival-interface">

                        <div className="skills-container" style={{ marginLeft: "200px" }}>

                            {/* Cleave Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.dismantle}>
                                {/* <CircularProgressBar skillCD={sukuna.cleaveCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.cleaveCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-dismantle" style={{
                                        position: "absolute",
                                        top: "-22px", left: "-17px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.cleaveCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.cleaveCD.isReady ? "" : sukuna.cleaveCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Dismantle:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {sukuna.cleaveCD.isReady ? "Ready - J" :
                                        (sukuna.cleaveCD.remainingTime + "sec")}</p> */}
                            </div>

                            {/* Dismantle Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.cleave}>
                                {/* <CircularProgressBar skillCD={sukuna.dismantleCD} /> */}

                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.dismantleCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-cleave" style={{
                                        position: "absolute",
                                        top: "-25px", left: "-25px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.dismantleCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.dismantleCD.isReady ? "" : sukuna.dismantleCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Cleave:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {sukuna.dismantleCD.isReady ?
                                        (sukuna.closeRange ? "Ready - K" : "Get Closer") :
                                        (sukuna.dismantleCD.remainingTime + "sec")}</p> */}
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.shrine}
                                style={{ cursor: "pointer" }} onClick={() => dispatch(sukunaSlice.actions.setDomainState(
                                    { ...sukuna.domainStatus, forceExpand: true }))}>
                                {/* <CircularProgressBar skillCD={rivalCharacter.domainCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.domainCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/malevolent_shrine.png")} alt="" style={{}} />

                                    <div className="cooldown-fade" style={{ display: sukuna.domainCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{sukuna.domainCD.isReady ? "" : sukuna.domainCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Domain:</p> */}
                                {/* <p style={{ marginTop: "-10px" }}>{rivalCharacter.domainCD.isReady ?
                                    (rivalCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                    (rivalCharacter.domainCD.remainingTime + "sec")}</p> */}
                            </div>
                            {/* Rapid Slash */}
                            <div className="skill" data-tooltip={skillDescriptions.rapidSlash}>
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-rapid" style={{
                                        position: "absolute",
                                        top: "-25px", left: "-25px", zIndex: 9,
                                        width: "99px", height: "101px",
                                        scale: ".4"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "none" : "block" }}></div>
                                    {/* <div className="cd-timer" style={{ zIndex: 999, color: "lightblue" }}>{sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "" :
                                        sukuna.rapidAttackCounter.currentCount + "/" + sukuna.rapidAttackCounter.maxCount}
                                    </div> */}
                                </div>

                                {/* <CircularProgressbar
                                    value={sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100}
                                    text={`${sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100}%`}
                                    className="circular-skill-progress-bar"
                                    styles={buildStyles({
                                        // Text size
                                        textSize: '16px',
                                        // Colors
                                        pathColor: (sukuna.rapidAttackCounter.currentCount / sukuna.rapidAttackCounter.maxCount * 100) >= 100 ? "green" : `rgba(62, 152, 199)`,
                                        textColor: 'transparent',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#3e98c7',
                                    })}
                                /> */}
                                <p style={{ marginTop: "5px", lineBreak: "loose" }}>Rapid attack:</p>
                                <p style={{ marginTop: "-10px" }}> {sukuna.rapidAttackCounter.currentCount >= sukuna.rapidAttackCounter.maxCount ? "Ready - J" : sukuna.rapidAttackCounter.currentCount + "/" + sukuna.rapidAttackCounter.maxCount} </p>
                            </div>
                            {/* FURNITURE */}
                            <div className="skill stylecontrolright" data-tooltip={skillDescriptions.fuga}>
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="image-fuga" style={{
                                        position: "absolute",
                                        top: "-142px", left: "-114px", zIndex: 9,
                                        width: "277px", height: "333px",
                                        scale: ".10"
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "none" : "block" }}></div>
                                </div>

                                {/* <CircularProgressbar
                                    value={sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100}
                                    text={`${sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100}%`}
                                    className="circular-skill-progress-bar"
                                    styles={buildStyles({
                                        // Text size
                                        textSize: '16px',
                                        // Colors
                                        pathColor: (sukuna.fugaCounter.currentCount / sukuna.fugaCounter.maxCount * 100) >= 100 ? "red" : `rgba(62, 152, 199)`,
                                        textColor: 'transparent',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#3e98c7',
                                    })}
                                /> */}
                                <p style={{ marginTop: "5px", lineBreak: "loose" }}>Fuga:</p>
                                <p style={{ marginTop: "-10px" }}> {sukuna.fugaCounter.currentCount >= sukuna.fugaCounter.maxCount ? "Ready - F" : sukuna.fugaCounter.currentCount + "/" + sukuna.fugaCounter.maxCount} </p>
                            </div>
                        </div>


                    </div>
                )}

                {/* RIVAL INTERFACE COMPONENT FOR MEGUMI */}
                {rivalCharacter.characterName === "megumi" && (

                    <div className="rival-interface">

                        <div className="skills-container" style={{ marginLeft: "350px" }}>

                            {/* Nue Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={rivalCharacter.nueAttackCD} />
                                <img src={require('../Assets/nue-side.png')} alt="" style={{ scale: "0.8" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Nue Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.nueAttackCD.isReady ?
                                        (nue.isActive ? "Ready - j" : "Call Nue First") :
                                        (rivalCharacter.nueAttackCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{rivalCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Call Nue */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.callNueCD} />
                                <img src={require("../Assets/nue.png")} alt="" style={{ scale: "0.8", marginTop: "5px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    {nue.isActive ? "Cancel Nue:" : "Call Nue:"}</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.callNueCD.isReady ? "Ready - K" :
                                        (rivalCharacter.callNueCD.remainingTime + "sec")}</p>
                            </div>


                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.divineDogsCD} />
                                <img src={require("../Assets/white-wolf.png")} alt="" style={{ scale: "0.8", marginTop: "10px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Wolf Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.divineDogsCD.isReady ?
                                        (rivalCharacter.divineDogsCD.isReady ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                        (rivalCharacter.divineDogsCD.remainingTime + "sec")}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* RIVAL INTERFACE COMPONENT FOR GOJO */}
                {rivalCharacter.characterName === "gojo" && (

                    <div className="rival-interface">

                        <div className="skills-container" style={{ marginLeft: "300px" }}>

                            {/* Blue Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.blue}>
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        filter: gojo.blueCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="gojo-blue-skill" style={{
                                        scale: "0.4",
                                    }}></div>
                                    <div className="cooldown-fade" style={{ display: gojo.blueCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.blueCD.isReady ? "" : gojo.blueCD.remainingTime}</div>
                                </div>
                            </div>

                            {/* Red  */}
                            <div className="skill" data-tooltip={skillDescriptions.red}>
                                {/* <CircularProgressBar skillCD={playerCharacter.redCD} /> */}
                                {/* <img src={require("../Assets/red.png")} alt="" style={{ scale: "0.6", marginTop: "0px" }} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#ac000e",
                                        filter: gojo.redCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <div className="gojo-red-skill" style={{ scale: "0.4" }}></div>
                                    <div className="cooldown-fade" style={{ display: gojo.redCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.redCD.isReady ? "" : gojo.redCD.remainingTime}</div>
                                </div>

                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    {keysPressed.current.shift ? "Charged RED:" : "RED:"}</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.redCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >=
                                            (keysPressed.current.shift ? 150 : 100) ?
                                            (keysPressed.current.shift ? "Ready - SHIFT + R" : "Ready - R") :
                                            "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy +
                                            (keysPressed.current.shift ? "/150" : "/100")) :
                                        (playerCharacter.redCD.remainingTime + "sec")}</p> */}
                            </div>


                            {/* Purple Attack */}
                            <div className="skill" data-tooltip={skillDescriptions.purple}>
                                {/* <CircularProgressBar skillCD={playerCharacter.redCD.remainingTime > playerCharacter.blueCD.remainingTime ?
                                    playerCharacter.redCD : playerCharacter.blueCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "#4d00b5",
                                        filter: gojo.redCD.isReady && gojo.blueCD.isReady ? "blur(1px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/purple.png")} alt="" style={{ scale: "1.06", marginTop: "0px" }} />

                                    <div className="cooldown-fade" style={{ display: gojo.redCD.isReady && gojo.blueCD.isReady ? "none" : "block" }}></div>
                                    {/* <div className="cd-timer">{gojo.redCD.isReady && gojo.blueCD.isReady ? "" : gojo.redCD.remainingTime}</div> */}
                                </div>
                                {/*                                 
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>PURPLE:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.redCD.isReady && playerCharacter.blueCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= -purpleCost ? "Ready - E+R" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/" + (-purpleCost)) :
                                        (playerCharacter.redCD.remainingTime > playerCharacter.blueCD.remainingTime ?
                                            (playerCharacter.redCD.remainingTime + "sec") : (playerCharacter.blueCD.remainingTime + "sec"))}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill stylecontrolright" data-tooltip={skillDescriptions.domain}
                                style={{ cursor: "pointer" }} onClick={() => dispatch(gojoSlice.actions.setDomainState(
                                    { ...gojo.domainStatus, forceExpand: true }))}>
                                {/* <CircularProgressBar skillCD={playerCharacter.domainCD} /> */}
                                <div className="skill2-container">
                                    <div className="color-effect" style={{
                                        backgroundColor: "black",
                                        filter: gojo.redCD.isReady ? "blur(5px)" : "blur(15px)",
                                    }}></div>
                                    <img src={require("../Assets/domain-hand.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />

                                    <div className="cooldown-fade" style={{ display: gojo.domainCD.isReady ? "none" : "block" }}></div>
                                    <div className="cd-timer">{gojo.domainCD.isReady ? "" : gojo.domainCD.remainingTime}</div>
                                </div>
                                {/* <p style={{ marginTop: "10px", width: "65px", textAlign: "left" }}>INFINITE VOID:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.domainCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - E+R" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/" + 200) :
                                        playerCharacter.domainCD.remainingTime + "sec"}</p> */}
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </div>
    )
}

export default CharacterInterface;