import React from 'react';
import './App.css';
import Megumi from './components/Megumi';
import Sukuna from './components/Sukuna';
import GameArea from './Pages/GameArea';
import Controls from './components/Controls';

export const playSoundEffect = (audio) => {
  audio.play()
}

export interface Character {
  value: number
}
export interface Megumi {
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

export interface Sukuna {
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
export interface DivineDogs {
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
        <Controls />
        <GameArea />
      </header>
    </div>
  );
}

export default App;
