import React from 'react';
import './App.css';
import C1 from './components/Player';
import C2 from './components/Rival';
import Player from './components/Player';
import Rival from './components/Rival';
import GameArea from './Pages/GameArea';

export interface Character {
  value: number
}
export interface Player {
  x: number;
  y: number;
  health: number;
  isPunching: boolean;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GameArea></GameArea>
      </header>
    </div>
  );
}

export default App;
