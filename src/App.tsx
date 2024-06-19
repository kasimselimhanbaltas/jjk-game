import React from 'react';
import './App.css';
import Player from './components/Player';
import Rival from './components/Rival';
import GameArea from './Pages/GameArea';

export const playSoundEffect = (audio) => {
  audio.play()
}

export interface Character {
  value: number
}
export interface Player {
  x: number;
  y: number;
  health: number;
  cursedEnergy: number;
  direction: "left" | "right";
  isAttacking: boolean;
  canMove: boolean;
}
export interface Gojo {
  x: number;
  y: number;
  health: number;
  cursedEnergy: number;
  direction: "left" | "right" | "stop";
  cleaveAttack: boolean,
  dismantleAttack: boolean,
  gojoDomainExpansion: boolean,
  gojoDirection: "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR" | "stop";
  closeRange: boolean;
  canMove: boolean;
  rapidAttack: boolean;
  dashGauge: number;
}

export interface Rival {
  x: number;
  y: number;
  health: number;
  cursedEnergy: number;
  direction: "left" | "right" | "stop";
  cleaveAttack: boolean,
  dismantleAttack: boolean,
  rivalDomainExpansion: boolean,
  rivalDirection: "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR" | "stop";
  closeRange: boolean;
  canMove: boolean;
  rapidAttack: boolean;
  dashGauge: number;
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
