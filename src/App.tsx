import './App.css';
import Megumi from './components/characters/Megumi';
import Sukuna from './components/characters/Sukuna';
import GameArea from './Pages/GameArea';
import Controls from './components/Controls';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from 'react';
import Preloader from './Pages/Pre';
import Playground from './Pages/Playground';

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
  animationState: "stance" | "move" | "jump" | "punch" | "block" |
  "callNue" | "nueAttack" | "callDivineDogs | callMahoraga",
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
  animationState: "stance" | "move" | "jump" | "punch" | "block" | "swordAttack",

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
  animationState: "stance" | "move" | "jump" | "punch" | "block" | "entry" | "walk",

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
  animationState: "nueStance" | "move" | "jump" | "punch" | "block" | "nueAttack",
}
export interface Mahoraga {
  isActive: boolean;
  x: number;
  y: number;
  canMove: boolean,
  health: {
    currentHealth: number,
    maxHealth: number,
  };
  direction: "left" | "right";
  isAttacking: boolean;
  animationState: "stance" | "move" | "jump" | "punch" | "block",
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
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Preloader load={load} />
          <Routes>
            <Route path='/jjk-game' element={(
              <div>
                <Controls />
                <GameArea />
              </div>
            )} />
            <Route path='/jjk-game/playground' element={<Playground />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
