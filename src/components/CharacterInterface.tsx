import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CircularProgressBar from "./CircularProgressBar";
import { useSelector } from "react-redux";


function CharacterInterface({ playerCharacter, rivalCharacter }) {

    const gameSettings = useSelector((state: any) => state.GameSettingsState);
    const sukuna = useSelector((state: any) => state.SukunaState);
    const megumi = useSelector((state: any) => state.MegumiState);
    const gojo = useSelector((state: any) => state.GojoState);
    const nue = useSelector((state: any) => state.NueState);
    const characterHeight = "80px";

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
                                position: "absolute", width: playerCharacter.health.currentHealth * 500 / playerCharacter.health.maxHealth,
                                maxWidth: "500px", height: "25px",
                                backgroundColor: "red",
                            }}></div>
                        </div>
                        <div className="cursed-energy-bar">
                            <div style={{
                                position: "absolute", width: playerCharacter.cursedEnergy.currentCursedEnergy * 350 / playerCharacter.cursedEnergy.maxCursedEnergy,
                                maxWidth: "350px", height: "25px", backgroundColor: "#068F98"
                            }}>
                                <img src={require(`../Assets/ce-bar.png`)} style={{
                                    display: playerCharacter.cursedEnergy.currentCursedEnergy >= playerCharacter.cursedEnergy.maxCursedEnergy
                                        ? "block" : "none",
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
                                position: "absolute", width: rivalCharacter.health.currentHealth * 500 / rivalCharacter.health.maxHealth,
                                maxWidth: "500px", height: "25px", backgroundColor: "red",
                                marginLeft: 500 - (rivalCharacter.health.currentHealth * 500 / rivalCharacter.health.maxHealth),
                            }}></div>
                        </div>
                        <div className="cursed-energy-bar" style={{
                            left: "69%",
                        }}>
                            <div style={{
                                position: "absolute", width: rivalCharacter.cursedEnergy.currentCursedEnergy * 350 / rivalCharacter.cursedEnergy.maxCursedEnergy,
                                maxWidth: "350px", height: "25px", backgroundColor: "#068F98",
                                marginLeft: 350 - (rivalCharacter.cursedEnergy.currentCursedEnergy * 350 / rivalCharacter.cursedEnergy.maxCursedEnergy)
                            }}>
                                <img src={require(`../Assets/ce-bar.png`)} style={{
                                    display: rivalCharacter.cursedEnergy.currentCursedEnergy >= rivalCharacter.cursedEnergy.maxCursedEnergy
                                        ? "block" : "none",
                                    width: 400, position: "absolute", top: -75, left: -30, translate: "-50%, -50%",
                                    backgroundSize: "cover",
                                }} />
                            </div>
                        </div>
                        <img src={require("../Assets/sukuna-logo.png")} className="sukuna-logo" />
                    </div>
                </div>
            </div>

            <div>
                {/* PLAYER INTERFACE COMPONENT FOR SUKUNA */}
                {playerCharacter.characterName === "sukuna" && (

                    <div className="player-interface">

                        <div className="skills-container">

                            {/* Cleave Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.cleaveCD} />
                                <img src={require("../Assets/slash.png")} alt="" />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Cleave:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.cleaveCD.isReady ? "Ready - J" :
                                        (playerCharacter.cleaveCD.remainingTime + "sec")}</p>
                            </div>

                            {/* Dismantle Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={playerCharacter.dismantleCD} />
                                <div style={{ display: "block", position: "relative", top: "-40px", left: "0px", height: "50px" }}>
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "5px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "15px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "25px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "35px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />

                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "15px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "25px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "35px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "45px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                </div>
                                <p style={{ marginTop: "-40px", lineBreak: "loose" }}>Dismantle:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.dismantleCD.isReady ?
                                        (playerCharacter.closeRange ? "Ready - K" : "Get Closer") :
                                        (playerCharacter.dismantleCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.domainCD} />
                                <img src={require("../Assets/malevolent_shrine.png")} alt="" style={{}} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Domain:</p>
                                <p style={{ marginTop: "-10px" }}>{playerCharacter.domainCD.isReady ?
                                    (playerCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                    (playerCharacter.domainCD.remainingTime + "sec")}</p>
                            </div>
                            {/* Rapid Slash */}
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

                {/* PLAYER INTERFACE COMPONENT FOR GOJO */}
                {playerCharacter.characterName === "gojo" && (

                    <div className="player-interface">

                        <div className="skills-container">

                            {/* Blue Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={playerCharacter.blueCD} />
                                <img src={require('../Assets/blue.png')} alt="" style={{ scale: "0.6" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Blue Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.blueCD.isReady ?
                                        "Ready - J" :
                                        (playerCharacter.blueCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{playerCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Red Nue */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.redCD} />
                                <img src={require("../Assets/red.png")} alt="" style={{ scale: "0.6", marginTop: "0px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    Red Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.redCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= 100 ? "Ready - K" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/100") :
                                        (playerCharacter.redCD.remainingTime + "sec")}</p>
                            </div>


                            {/* Purple Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.purpleCD} />
                                <img src={require("../Assets/purple.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Purple Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {playerCharacter.purpleCD.isReady ?
                                        (playerCharacter.cursedEnergy.currentCursedEnergy >= 150 ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/150") :
                                        (playerCharacter.purpleCD.remainingTime + "sec")}</p>
                            </div>

                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={playerCharacter.domainCD} />
                                <img src={require("../Assets/domain-hand.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                                <p>coming soon...</p>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Infinite Void:</p>

                  <p style={{ marginTop: "-10px" }}>
                    {playerCharacter.purpleCD.isReady ?
                      (playerCharacter.purpleCD.isReady ? "Ready - L" : "CursedEnergy: " + playerCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                      (playerCharacter.purpleCD.remainingTime + "sec")}</p> */}
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

                {/* RIVAL INTERFACE COMPONENT FOR SUKUNA */}
                {rivalCharacter.characterName === "sukuna" && (

                    <div className="rival-interface">

                        <div className="skills-container" style={{ marginLeft: "300px" }}>

                            {/* Cleave Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.cleaveCD} />
                                <img src={require("../Assets/slash.png")} alt="" />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Cleave:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.cleaveCD.isReady ? "Ready - J" :
                                        (rivalCharacter.cleaveCD.remainingTime + "sec")}</p>
                            </div>

                            {/* Dismantle Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={rivalCharacter.dismantleCD} />
                                <div style={{ display: "block", position: "relative", top: "-40px", left: "0px", height: "50px" }}>
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "5px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "15px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "25px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "35px", left: "0px", height: characterHeight, width: "50px", rotate: "45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />

                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "15px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "25px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "35px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                    <img src={require('../Assets/slash.png')} alt="" style={{ position: "absolute", top: "-10px", left: "45px", height: characterHeight, width: "50px", rotate: "-45deg", transform: "scale(0.8) translate(-50%, -50%)" }} />
                                </div>
                                <p style={{ marginTop: "-40px", lineBreak: "loose" }}>Dismantle:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.dismantleCD.isReady ?
                                        (rivalCharacter.closeRange ? "Ready - K" : "Get Closer") :
                                        (rivalCharacter.dismantleCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{rivalCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.domainCD} />
                                <img src={require("../Assets/malevolent_shrine.png")} alt="" style={{}} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Domain:</p>
                                <p style={{ marginTop: "-10px" }}>{rivalCharacter.domainCD.isReady ?
                                    (rivalCharacter.cursedEnergy.currentCursedEnergy >= 200 ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                                    (rivalCharacter.domainCD.remainingTime + "sec")}</p>
                            </div>
                        </div>
                        {/* Rapid Slash */}
                        <div className="skill">
                            <img src={require("../Assets/slash.png")} alt="" />
                            <CircularProgressbar
                                value={rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}
                                text={`${rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}%`}
                                className="circular-skill-progress-bar"
                                styles={buildStyles({
                                    // Text size
                                    textSize: '16px',
                                    // Colors
                                    pathColor: (rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                                    textColor: 'transparent',
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                })}
                            />
                            <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                            <p style={{ marginTop: "-10px" }}> {rivalCharacter.rapidAttackCounter.currentCount >= rivalCharacter.rapidAttackCounter.maxCount ? "Ready - J" : rivalCharacter.rapidAttackCounter.currentCount + "/" + rivalCharacter.rapidAttackCounter.maxCount} </p>
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
                        {/* Rapid Slash
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {rivalCharacter.rapidAttackCounter.currentCount >= rivalCharacter.rapidAttackCounter.maxCount ? "Ready - J" : rivalCharacter.rapidAttackCounter.currentCount + "/" + rivalCharacter.rapidAttackCounter.maxCount} </p>
              </div> */}

                    </div>
                )}

                {/* RIVAL INTERFACE COMPONENT FOR GOJO */}
                {rivalCharacter.characterName === "gojo" && (

                    <div className="rival-interface">

                        <div className="skills-container" style={{ marginLeft: "300px" }}>

                            {/* Blue Attack */}
                            <div className="skill" >
                                <CircularProgressBar skillCD={rivalCharacter.blueCD} />
                                <img src={require('../Assets/blue.png')} alt="" style={{ scale: "0.6" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Blue Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.blueCD.isReady ?
                                        "Ready - J" :
                                        (rivalCharacter.blueCD.remainingTime + "sec")}</p>
                                {/* <p style={{ color: "black" }}>{rivalCharacter.closeRange ? "close range" : "far range"}</p> */}
                            </div>

                            {/* Red Nue */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.redCD} />
                                <img src={require("../Assets/red.png")} alt="" style={{ scale: "0.6", marginTop: "0px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>
                                    Red Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.redCD.isReady ?
                                        (rivalCharacter.cursedEnergy.currentCursedEnergy >= 100 ? "Ready - K" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/100") :
                                        (rivalCharacter.redCD.remainingTime + "sec")}</p>
                            </div>


                            {/* Purple Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.purpleCD} />
                                <img src={require("../Assets/purple.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                                <p style={{ marginTop: "10px", lineBreak: "loose" }}>Purple Attack:</p>
                                <p style={{ marginTop: "-10px" }}>
                                    {rivalCharacter.purpleCD.isReady ?
                                        (rivalCharacter.cursedEnergy.currentCursedEnergy >= 150 ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/150") :
                                        (rivalCharacter.purpleCD.remainingTime + "sec")}</p>
                            </div>

                            {/* Domain Attack */}
                            <div className="skill">
                                <CircularProgressBar skillCD={rivalCharacter.domainCD} />
                                <img src={require("../Assets/domain-hand.png")} alt="" style={{ scale: "0.8", marginTop: "0px" }} />
                                <p>coming soon...</p>
                                {/* <p style={{ marginTop: "10px", lineBreak: "loose" }}>Infinite Void:</p>

                  <p style={{ marginTop: "-10px" }}>
                    {rivalCharacter.purpleCD.isReady ?
                      (rivalCharacter.purpleCD.isReady ? "Ready - L" : "CursedEnergy: " + rivalCharacter.cursedEnergy.currentCursedEnergy + "/200") :
                      (rivalCharacter.purpleCD.remainingTime + "sec")}</p> */}
                            </div>

                        </div>
                        {/* Rapid Slash
              <div className="skill">
                <img src={require("../Assets/slash.png")} alt="" />
                <CircularProgressbar
                  value={rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}
                  text={`${rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100}%`}
                  className="circular-skill-progress-bar"
                  styles={buildStyles({
                    // Text size
                    textSize: '16px',
                    // Colors
                    pathColor: (rivalCharacter.rapidAttackCounter.currentCount / rivalCharacter.rapidAttackCounter.maxCount * 100) === 100 ? "green" : `rgba(62, 152, 199)`,
                    textColor: 'transparent',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
                <p style={{ marginTop: "60px", lineBreak: "loose" }}>Rapid attack:</p>
                <p style={{ marginTop: "-10px" }}> {rivalCharacter.rapidAttackCounter.currentCount >= rivalCharacter.rapidAttackCounter.maxCount ? "Ready - J" : rivalCharacter.rapidAttackCounter.currentCount + "/" + rivalCharacter.rapidAttackCounter.maxCount} </p>
              </div> */}

                    </div>
                )}
            </div >
        </div>
    )
}

export default CharacterInterface;