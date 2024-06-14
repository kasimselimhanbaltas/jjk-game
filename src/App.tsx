import React from 'react';
import './App.css';
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
  direction: "left" | "right";
  isAttacking: boolean;
}
export interface Rival {
  x: number;
  y: number;
  health: number;
  direction: "left" | "right";
  isAttacking: boolean;
}
export interface Nue {
  isActive: boolean;
  x: number;
  y: number;
  health: number;
  direction: "left" | "right";
  isAttacking: boolean;
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
