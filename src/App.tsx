import './App.css';
import Megumi from './components/characters/Megumi';
import Sukuna from './components/characters/Sukuna';
import GameArea from './Pages/GameArea';
import Controls from './components/Controls';


export interface GameSettings {
  selectedCharacter: string,
  selectedRivalCharacter: string,
  winner: string,
  loser: string
}
export interface Skill {
  isReady: boolean,
  cooldown: number,
  remainingTime: number
}
export interface Megumi {
  characterName: string,
  x: number;
  y: number;
  health: {
    currentHealth: number,
    maxHealth: number,
  };
  cursedEnergy: {
    currentCursedEnergy: number,
    maxCursedEnergy: number,
  },
  direction: "left" | "right";
  rivalDirection: "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR" | "stop";
  isAttacking: boolean;
  canMove: boolean;
  dashGauge: number,
  callNueCD: Skill,
  nueAttackCD: Skill,
  divineDogsCD: Skill,
  isBlocking: boolean,
}
export interface Gojo {
  characterName: string,
  x: number;
  y: number;
  health: {
    currentHealth: number,
    maxHealth: number,
  };
  cursedEnergy: {
    currentCursedEnergy: number,
    maxCursedEnergy: number,
  },
  direction: "left" | "right";
  rivalDirection: "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR" | "stop";
  isAttacking: boolean;
  canMove: boolean;
  dashGauge: number,
  blueCD: Skill,
  redCD: Skill,
  purpleCD: Skill,
  domainCD: Skill,
  redAttackMoment: boolean,
  purpleAttackMoment: boolean,
  isBlocking: boolean,

}

export interface Sukuna {
  characterName: string,
  x: number;
  y: number;
  health: {
    currentHealth: number,
    maxHealth: number,
  };
  cursedEnergy: {
    currentCursedEnergy: number,
    maxCursedEnergy: number,
  },
  direction: "left" | "right" | "stop";
  cleaveAttack: boolean,
  dismantleAttack: boolean,
  rivalDomainExpansion: boolean,
  rivalDirection: "L" | "R" | "U" | "D" | "UL" | "UR" | "DL" | "DR" | "stop";
  closeRange: boolean;
  canMove: boolean;
  rapidAttack: boolean;
  dashGauge: number;
  cleaveCD: Skill,
  dismantleCD: Skill,
  domainCD: Skill,
  rapidAttackCounter: {
    maxCount: number,
    currentCount: number,
  },
  isBlocking: boolean,

}
export interface Nue {
  isActive: boolean;
  x: number;
  y: number;
  health: number;
  direction: "left" | "right";
  isAttacking: boolean;
  nueAuto: boolean;
  nueAutoAttack: boolean;
}
export interface DivineDogs {
  isActive: boolean;
  x: number;
  y: number;
  health: number;
  direction: "left" | "right";
  isAttacking: boolean;
  wolfAuto: boolean;
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
