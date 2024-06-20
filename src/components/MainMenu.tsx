import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharacter } from '../store/GameSettingsSlice';

const MainMenu = ({ onStartGame }) => { // onStartGame prop'unu al

  const dispatch = useDispatch();
  const [showCharacterMenu, setShowCharacterMenu] = useState(false); // Character menu gizleme state'i
  const [showMainMenu, setShowMainMenu] = useState(true); // Character menu gizleme state'i
  const gameSettings = useSelector((state: any) => state.GameSettingsState);

  const saveCharacter = (characterName) => {
    dispatch(selectCharacter(characterName));
    setShowCharacterMenu(false);
    setShowMainMenu(true);
  };

  return (
    <div className="main-screen">
      {showMainMenu &&
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
      }


      {showCharacterMenu && (
        <div className="character-menu">
          <button className="character-button" onClick={() => saveCharacter('megumi')}>
            <img src={require("../Assets/megumi.png")} alt="" />
            <h2 style={{ marginTop: "-40px" }}>Fushiguro Megumi</h2>
          </button>
          <button className="character-button" onClick={() => saveCharacter('sukuna')}>
            <img src={require("../Assets/sukuna.png")} alt="" />
            <h2>Ryomen Sukuna</h2>
          </button>
        </div>
      )}

    </div>
  );
};

export default MainMenu;
