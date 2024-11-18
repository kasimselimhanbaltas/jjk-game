import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gameSettingsSlice, { selectCharacter, selectRivalCharacter } from '../redux/GameSettingsSlice';
import tutorialSlice from '../redux/TutorialSlice';
const MainMenu = ({ onStartGame, onShowControls, onTutorialSelected }) => { // onStartGame prop'unu al

  const dispatch = useDispatch();
  const [showCharacterMenu, setShowCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showRivalCharacterMenu, setShowRivalCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showMainMenu, setShowMainMenu] = useState(true); // Character menu gizleme state'i
  const [showTutorialMenu, setShowTutorialMenu] = useState(false); // Tutorial menu
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const gameSettings = useSelector((state: any) => state.GameSettingsState);
  const tutorialState = useSelector((state: any) => state.TutorialState);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (savedUsername === "change_") {
      localStorage.removeItem('username');
      console.log("change")
      setSavedUsername(null)
    }
    if (storedUsername) {
      setSavedUsername(storedUsername);
      if (!showTutorialMenu) {
        setShowMainMenu(true)
      }
      console.log("*/1")
    } else {
      setShowMainMenu(false)
    }
  }, [savedUsername]);

  // Form submit edildiğinde kullanıcı adını kaydet
  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('username', username);
    setSavedUsername(username);
    setUsername(''); // Input alanını temizle
  };

  const saveCharacter = (characterName) => {
    dispatch(selectCharacter(characterName));
    if (characterName === gameSettings.selectedRivalCharacter) {
      setShowRivalCharacterMenu(true);
    } else {
      console.log("*/2")
      setShowMainMenu(true);
    }
    setShowCharacterMenu(false);
  };
  const saveRivalCharacter = (characterName) => {
    dispatch(selectRivalCharacter(characterName));
    setShowRivalCharacterMenu(false);
    console.log("*/3")
    setShowMainMenu(true);
  };
  const handleStartGame = () => {
    dispatch(gameSettingsSlice.actions.setTutorial(false));
    onStartGame();
  }
  const tutorialMenu = () => {
    dispatch(gameSettingsSlice.actions.setTutorial(true));
    setShowMainMenu(false);
    setShowTutorialMenu(true);
    onTutorialSelected();
    // onStartGame();
  }
  const freePlay = () => {
    dispatch(gameSettingsSlice.actions.setTutorial(true));
    onStartGame();
  }

  const handleReturnToMainMenu = () => {
    setShowMainMenu(true)
    setShowTutorialMenu(false)
    dispatch(gameSettingsSlice.actions.setTutorial(false));
    dispatch(tutorialSlice.actions.setTutorialMode(false));
  };
  const swapCharacters = () => {
    if (gameSettings.selectedCharacter === "meguna") {
      dispatch(gameSettingsSlice.actions.selectRivalCharacter("meguna"));
      dispatch(gameSettingsSlice.actions.selectCharacter("gojo"));
    } else {
      dispatch(gameSettingsSlice.actions.selectRivalCharacter("gojo"));
      dispatch(gameSettingsSlice.actions.selectCharacter("meguna"));
    }
  }
  const tutorialSelected = (index) => {
    // onTutorialSelected(index);
    dispatch(tutorialSlice.actions.setTutorialMode({ tutorialMode: true, tutorialIndex: index }))
    freePlay();
  }
  useEffect(() => {
    if (tutorialState.goToTutorialMenu) {
      console.log("*********************")
      tutorialMenu();
      setShowMainMenu(false);
      dispatch(tutorialSlice.actions.setGoToTutorialMenu(false));
    }
  }, [tutorialState.goToTutorialMenu])
  return (
    <div className="main-screen">
      {localStorage.getItem('username') && showMainMenu && (
        <div style={{ position: "absolute", top: "0%", left: "50%", translate: "-50% 0", zIndex: 99 }}>
          <h2>Welcome,
            <button className='username-button' onClick={() => setSavedUsername('change_')} style={{
              outline: "none", backgroundColor: "transparent", border: "none",
              fontSize: "1em",
              fontWeight: "bold",
              marginBlockStart: "0.83em",
              marginBlockEnd: "0.83em",
              marginInlineStart: "0px",
              marginInlineEnd: "0px",
              color: "white",
              cursor: "pointer",
            }}>
              {savedUsername} !
            </button>
          </h2>
        </div>
      )}
      {showTutorialMenu && (
        <>
          <div className='tutorial-menu' style={{ paddingBottom: "50px", marginTop: "-50px" }}>

            <button className="small-button" style={{ marginLeft: "20px" }} onClick={handleReturnToMainMenu}>Main Menu</button>
            <button className="small-button" style={{ marginLeft: "10px" }} onClick={freePlay}>Free Play</button>
          </div>

          <div className="tutorial-menu-container">

            <div className="tutorial-menu">

              {tutorialState.characters[gameSettings.selectedCharacter].map((gojoTutorial, index) => (
                <button key={index} className={"tutorial-button tutorial-button-" + gameSettings.selectedCharacter}
                  onClick={() => {
                    console.log("handler in tutorial menu:", gameSettings.selectCharacter, index);
                    tutorialSelected(index)
                  }}>
                  <span>{gojoTutorial.title}</span>
                  { }
                  <div style={{ display: tutorialState.characters[gameSettings.selectedCharacter][index].isComplete ? "block" : "none" }} className='tutorial-checked'></div>
                </button>
              ))}
            </div>
          </div>
        </>

      )
      }
      {
        showMainMenu &&
        <div className="main-menu-container">
          {gameSettings.selectedCharacter === "gojo" &&
            <div className='gojo-menu' style={{ right: undefined, left: "250px" }}></div>
          }
          {gameSettings.selectedCharacter === "sukuna" &&
            <div className='sukuna-menu' style={{ right: undefined, left: "250px" }}></div>
          }
          {gameSettings.selectedCharacter === "meguna" &&
            <div className='meguna-menu' style={{ right: undefined, left: "250px" }}></div>
          }
          {gameSettings.selectedRivalCharacter === "gojo" &&
            <div className='gojo-menu' style={{ left: undefined, right: "200px", transform: "scaleX(-1)" }}></div>
          }
          {gameSettings.selectedRivalCharacter === "sukuna" &&
            <div className='sukuna-menu' style={{ left: undefined, right: "200px", transform: "scaleX(-1)" }}></div>
          }
          {gameSettings.selectedRivalCharacter === "meguna" &&
            <div className='meguna-menu' style={{ left: undefined, right: "250px" }}></div>
          }
          <div className="main-menu myfont">
            <button className="start-button" onClick={handleStartGame} style={{ position: "relative" }}>
              {/* <div className='start-button-animated' style={{ position: "absolute", top: "50%", left: "50%", translate: "0 0" }}></div> */}
              <div style={{ position: "relative" }}>
                Start Game
              </div>
              <div
                style={{
                  content: "", width: "20px", height: "20px", backgroundColor: "white", position: "absolute",
                  top: 0, left: 0, borderRadius: "50%", transform: "translate(-50%, -50%)",
                }}
              ></div>
            </button>

            <button className="small-button long-button" onClick={() => {
              // setShowCharacterMenu(true); setShowMainMenu(false) 
              swapCharacters()
            }}
            // style={{ marginTop: "30px" }}
            >
              {gameSettings.selectedCharacter === "gojo" ? "Play as Sukuna" : "Play as Gojo"}</button>
            <button className="small-button" onClick={tutorialMenu}>Tutorial</button>
            <button className="small-button">Options</button>
            <button className="small-button" onClick={onShowControls}>Controls</button>
          </div>
        </div>
      }
      {
        !localStorage.getItem('username') && (
          <div style={{ position: "absolute", top: "0%", left: "50%", translate: "-50% 0" }}>
            <h1>Enter Your Username</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <br />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <button type="submit" style={{ margin: "5px" }}>Save</button>
            </form>

          </div>
        )
      }

      {
        showCharacterMenu && (
          <div className="character-menu">
            {/* <button className="character-button" onClick={() => saveCharacter('megumi')}>
            <img src={require("../Assets/megumi.png")} alt="" />
            <h2 style={{}}>Fushiguro Megumi</h2>
          </button> */}
            <button className="character-button" onClick={() => saveCharacter('gojo')}>
              <img src={require("../Assets/kitkat.png")} alt="" />
              <h2 style={{}}>Satoru Gojo</h2>
            </button>
            <button className="character-button" onClick={() => saveCharacter('sukuna')}>
              <div className='sukuna-menu' style={{ left: undefined, right: "200px", transform: "scaleX(-1)" }}></div>
              <h2>Ryomen Sukuna</h2>
            </button>
          </div>
        )
      }
      {
        showRivalCharacterMenu && (
          <div className="character-menu">
            <h1 style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)" }}>Select Your Rival</h1>
            {/* {gameSettings.selectedCharacter !== "megumi" && (
            <div>
              <button className="character-button" onClick={() => saveRivalCharacter('megumi')}>
                <img src={require("../Assets/megumi.png")} alt="" />
                <h2 style={{}}>Fushiguro Megumi</h2>
              </button>
            </div>
          )} */}
            {gameSettings.selectedCharacter !== "gojo" && (
              <div>
                <button className="character-button" onClick={() => saveRivalCharacter('gojo')}>
                  <img src={require("../Assets/kitkat.png")} alt="" />
                  <h2 style={{}}>Satoru Gojo</h2>
                </button>
              </div>
            )}
            {gameSettings.selectedCharacter !== "sukuna" && (
              <div>
                <button className="character-button" onClick={() => saveRivalCharacter('sukuna')}>
                  <div className='sukuna-menu' style={{ left: undefined, right: "200px", transform: "scaleX(-1)" }}></div>

                  <h2>Ryomen Sukuna</h2>
                </button>
              </div>
            )}
          </div>
        )
      }

    </div >
  );
};

export default MainMenu;
