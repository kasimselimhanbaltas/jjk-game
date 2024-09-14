import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gameSettingsSlice, { selectCharacter, selectRivalCharacter } from '../redux/GameSettingsSlice';
const MainMenu = ({ onStartGame }) => { // onStartGame prop'unu al

  const dispatch = useDispatch();
  const [showCharacterMenu, setShowCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showRivalCharacterMenu, setShowRivalCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showMainMenu, setShowMainMenu] = useState(true); // Character menu gizleme state'i
  const [username, setUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const gameSettings = useSelector((state: any) => state.GameSettingsState);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (savedUsername === "change_") {
      localStorage.removeItem('username');
      console.log("change")
      setSavedUsername(null)
    }
    if (storedUsername) {
      setSavedUsername(storedUsername);
      setShowMainMenu(true)
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
      setShowMainMenu(true);
    }
    setShowCharacterMenu(false);
  };
  const saveRivalCharacter = (characterName) => {
    dispatch(selectRivalCharacter(characterName));
    setShowRivalCharacterMenu(false);
    setShowMainMenu(true);
  };
  const tutorial = () => {
    dispatch(gameSettingsSlice.actions.setTutorial(true));
    onStartGame();
  }

  return (
    <div className="main-screen">
      {localStorage.getItem('username') && (
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
      {showMainMenu &&
        <div className="main-menu-container">
          <div className="main-menu">
            {gameSettings.selectedCharacter &&
              <img className='selected-character-image' src={require(`../Assets/profiles/${gameSettings.selectedCharacter}-profile.png`)} alt="" />
            }
            <button className="start-button" onClick={onStartGame}>
              {/* <div className='start-button-animated' style={{ position: "absolute", top: "50%", left: "50%", translate: "0 0" }}></div> */}
              <div style={{ position: "relative" }}>
                Start Game
              </div>
            </button>

            <button className="small-button" onClick={() => { setShowCharacterMenu(true); setShowMainMenu(false) }}
            // style={{ marginTop: "30px" }}
            >Select Character</button>
            <button className="small-button" onClick={tutorial}>Tutorial</button>
            <button className="small-button">Options</button>
            <button className="small-button">Controls</button>
          </div>
          <div style={{ marginRight: "50px" }}>
            <img className='selected-character-image' src={require(`../Assets/profiles/${gameSettings.selectedRivalCharacter}-profile.png`)} alt="" />
            <button className="small-button" style={{ marginTop: "0px" }} onClick={() => { setShowRivalCharacterMenu(true); setShowMainMenu(false) }}>Select Rival Character</button>
          </div>

        </div>
      }
      {!localStorage.getItem('username') && (
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
      )}

      {showCharacterMenu && (
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
            <img src={require("../Assets/sukuna.png")} alt="" />
            <h2>Ryomen Sukuna</h2>
          </button>
        </div>
      )}
      {showRivalCharacterMenu && (
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
                <img src={require("../Assets/sukuna.png")} alt="" />
                <h2>Ryomen Sukuna</h2>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default MainMenu;
