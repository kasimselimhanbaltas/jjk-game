import React, { useState } from 'react';

const MainMenu = ({ onStartGame }) => { // onStartGame prop'unu al
  return (
    <div className="main-menu">
      <button className="start-button" onClick={onStartGame}>
        Start Game
      </button>
      <button className="small-button">Select Character</button>
      <button className="small-button">Options</button>
      <button className="small-button">Controls</button>
    </div>
  );
};

export default MainMenu;
