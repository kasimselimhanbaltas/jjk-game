import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCharacter } from '../redux/GameSettingsSlice';

const FinishMenu = ({ onRestart, onReturnToMainMenu }) => { // onStartGame prop'unu al

    const dispatch = useDispatch();
    const [showCharacterMenu, setShowCharacterMenu] = useState(false); // Character menu gizleme state'i
    const [showMainMenu, setShowMainMenu] = useState(true); // Character menu gizleme state'i
    const gameSettings = useSelector((state: any) => state.GameSettingsState);


    return (
        <div className="finish-screen">
            {showMainMenu &&
                <div className="finish-menu">
                    {gameSettings.winner &&
                        <div>
                            <h3 style={{ color: "black" }}>Winner:</h3>
                            <img className='selected-character-image' src={require(`../Assets/profiles/${gameSettings.winner}-profile.png`)} alt="" />
                        </div>
                    }
                    <button className="start-button" onClick={onRestart}>
                        Restart
                    </button>
                    <button className="small-button" onClick={onReturnToMainMenu}>Main Menu</button>
                </div>
            }
        </div>
    );
};

export default FinishMenu;
