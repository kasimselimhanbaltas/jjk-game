import './App.css';
import Megumi from './components/characters/Megumi';
import Sukuna from './components/characters/Sukuna';
import GameArea from './Pages/GameArea';
import Controls from './components/Controls';
import ControlsPage from './Pages/ControlsPage';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Preloader from './Pages/Pre';
import Playground from './Pages/Playground';

export const CharacterState = {
  IDLE: 'idle',
  ATTACKING: 'attacking',
  BLOCKING: 'blocking',
  TAKING_DAMAGE: 'taking_damage',
  STUNNED: 'stunned',
  // Add other states as needed
};


export interface GameSettings {
  selectedCharacter: string,
  selectedRivalCharacter: string,
  winner: string,
  loser: string,
  surfaceY: number,
  entry: boolean,
  domainClashReady: boolean,
  domainClash: boolean,
  tutorial: boolean
  freePlay: boolean
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
  callNueCD: Skill,
  nueAttackCD: Skill,
  divineDogsCD: Skill,
  isBlocking: boolean,
  animationState: "stance" | "move" | "jump" | "punch" | "block" |
  "callNue" | "nueAttack" | "callDivineDogs | callMahoraga",
  velocityY: number,
  isJumping: boolean,
  gravity: number,
  jumpStrength: number,
  animationBlocker: boolean,
  transition: string,
  hardStun: boolean,
  devStun: boolean,
  // ...
  domainAmplification: {
    isActive: boolean,
    skill: Skill,
  },
  simpleDomain: {
    isActive: boolean,
    duration: number,
    skill: Skill,
  },
  fallingBlossomEmotion: {
    isActive: boolean,
    skill: Skill,
  },
  invulnerability: boolean,
  state: string,
  animationLevel: number,
  currentAnimation: string,
  stunTimer: number,
  autoMoveBlocker: boolean,
  takeDamage: {
    isTakingDamage: boolean,
    takeDamageAnimationCheck: boolean,
    damage: number,
    timeout: number
    knockback: number,
    animation: string,
    animationPriority: number
  },
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
  blueCD: Skill,
  redCD: Skill,
  domainCD: Skill,
  redAttackMoment: boolean,
  blueAttackMoment: boolean,
  bluePosition: { x: number, y: number },
  purpleAttackMoment: boolean,
  isBlocking: boolean,
  animationState: "stance" | "move" | "jump" | "punch" | "block" | "first-pose",
  velocityY: number,
  isJumping: boolean,
  gravity: number,
  jumpStrength: number,
  animationBlocker: boolean;
  transition: string,
  positioningSide: string,
  hardStun: boolean,
  takeDamage: {
    isTakingDamage: boolean,
    takeDamageAnimationCheck: boolean,
    damage: number,
    timeout: number
    knockback: number,
    animation: string,
    animationPriority: number
  },
  devStun: boolean,
  domainStatus: {
    sureHitStatus: boolean,
    clashStatus: boolean,
    isInitiated: boolean,
    isActive: boolean,
    duration: number,
    refineLevel: number,
    afterDomainRestrictions: boolean,
    forceExpand: boolean,
  },
  rct: {
    rctActive: boolean,
    rctMode: string,
  },
  infinity: boolean,
  simpleDomain: {
    isActive: boolean,
    duration: number,
    skill: Skill,
  },
  domainAmplification: {
    isActive: boolean,
    skill: Skill,
  },
  fallingBlossomEmotion: {
    isActive: boolean,
    skill: Skill,
  },
  invulnerability: boolean,

  state: string,
  animationLevel: number,
  currentAnimation: string,
  stunTimer: number,
  autoMoveBlocker: boolean,
  // inputBuffer: [],
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
  cleaveCD: Skill,
  dismantleCD: Skill,
  domainCD: Skill,
  rapidAttackCounter: {
    maxCount: number,
    currentCount: number,
  },
  fugaCounter: {
    maxCount: number,
    currentCount: number,
  },
  isBlocking: boolean,
  animationState: "stance" | "move" | "jump" | "punch" | "block" | "entry" | "walk",
  velocityY: number,
  isJumping: boolean,
  gravity: number,
  jumpStrength: number,
  animationBlocker: boolean;
  transition: string,
  bamAttackMoment: boolean,
  bamLandingPositionX: number,
  positioningSide: string,
  hardStun: boolean,
  takeDamage: {
    isTakingDamage: boolean,
    takeDamageAnimationCheck: boolean,
    damage: number,
    timeout: number
    knockback: number,
    animation: string,
    animationPriority: number
  },
  devStun: boolean,
  domainStatus: {
    sureHitStatus: boolean,
    clashStatus: boolean,
    isInitiated: boolean,
    isActive: boolean,
    duration: number,
    refineLevel: number,
    afterDomainRestrictions: boolean,
    forceExpand: boolean,
  },
  rct: {
    rctActive: boolean,
    rctMode: string,
  },
  domainAmplification: {
    isActive: boolean,
    skill: Skill,
  },
  simpleDomain: {
    isActive: boolean,
    duration: number,
    skill: Skill,
  },
  fallingBlossomEmotion: {
    isActive: boolean,
    skill: Skill,
  },
  invulnerability: boolean,
  animationLevel: number,
  currentAnimation: string,
  stunTimer: number,
  autoMoveBlocker: boolean,
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
  animationBlocker: boolean;

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

  // EFFECT HOOK FOR UPDATING LOADING STATE 
  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    return () => {
      clearTimeout(timer);
    }
  });

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div style={{
            width: "1410px", height: "610px", border: "10px solid black",
            position: "absolute"
          }}></div>
          <div style={{
            width: "1435px", height: "635px", border: "5px solid black",
            position: "absolute"
          }}></div>
          <div style={{
            width: "1450px", height: "650px", border: "3px solid black",
            position: "absolute"
          }}></div>
          <div style={{
            width: "1459px", height: "659px", border: "1px solid black",
            position: "absolute"
          }}></div>
          <Preloader load={load} />
          <Routes>
            <Route path='/jjk-game' element={(
              <div>
                {/* <Controls /> */}
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
