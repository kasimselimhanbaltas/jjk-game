import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharacter, selectRivalCharacter } from '../redux/GameSettingsSlice';

const MainMenu = ({ onStartGame }) => { // onStartGame prop'unu al

  const dispatch = useDispatch();
  const [showCharacterMenu, setShowCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showRivalCharacterMenu, setShowRivalCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showMainMenu, setShowMainMenu] = useState(true); // Character menu gizleme state'i
  const gameSettings = useSelector((state: any) => state.GameSettingsState);

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

  return (
    <div className="main-screen">
      {showMainMenu &&
        <div className="main-menu-container">

          <div className="main-menu">
            {gameSettings.selectedCharacter &&
              <img className='selected-character-image' src={require(`../Assets/profiles/${gameSettings.selectedCharacter}-profile.png`)} alt="" />
            }
            <button className="start-button" onClick={onStartGame}>
              Start Game
            </button>
            <button className="small-button" onClick={() => { setShowCharacterMenu(true); setShowMainMenu(false) }}>Select Character</button>
            <button className="small-button">Options</button>
            <button className="small-button">Controls</button>
          </div>
          <div style={{ marginRight: "50px" }}>
            <img className='selected-character-image' src={require(`../Assets/profiles/${gameSettings.selectedRivalCharacter}-profile.png`)} alt="" />
            <button className="small-button" style={{ marginTop: "0px" }} onClick={() => { setShowRivalCharacterMenu(true); setShowMainMenu(false) }}>Select Rival Character</button>
          </div>

        </div>
      }

      {showCharacterMenu && (
        <div className="character-menu">
          <button className="character-button" onClick={() => saveCharacter('megumi')}>
            <img src={require("../Assets/megumi.png")} alt="" />
            <h2 style={{}}>Fushiguro Megumi</h2>
          </button>
          {/* <button className="character-button" onClick={() => saveCharacter('gojo')}>
            <img src={require("../Assets/kitkat.png")} alt="" />
            <h2 style={{}}>Satoru Gojo</h2>
          </button> */}
          <button className="character-button" onClick={() => saveCharacter('sukuna')}>
            <img src={require("../Assets/sukuna.png")} alt="" />
            <h2>Ryomen Sukuna</h2>
          </button>
        </div>
      )}
      {showRivalCharacterMenu && (
        <div className="character-menu">
          <h1 style={{ position: "absolute", top: "10%", left: "50%", transform: "translate(-50%, -50%)" }}>Select Your Rival</h1>
          {gameSettings.selectedCharacter !== "megumi" && (
            <div>
              <button className="character-button" onClick={() => saveRivalCharacter('megumi')}>
                <img src={require("../Assets/megumi.png")} alt="" />
                <h2 style={{}}>Fushiguro Megumi</h2>
              </button>
            </div>
          )}
          {/* {gameSettings.selectedCharacter !== "gojo" && (
            <div>
              <button className="character-button" onClick={() => saveRivalCharacter('gojo')}>
                <img src={require("../Assets/kitkat.png")} alt="" />
                <h2 style={{}}>Satoru Gojo</h2>
              </button>
            </div>
          )} */}
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
