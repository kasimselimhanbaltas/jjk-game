import './App.css';
import Megumi from './components/characters/Megumi';
import Sukuna from './components/characters/Sukuna';
import GameArea from './Pages/GameArea';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Preloader from './Pages/Pre';
import Playground from './Pages/Playground';

import assetsJsonList from './assets.json';

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

function categorizeAssets(assetList) {
  console.log("assets, categorize");
  const images = [];
  const videos = [];
  const audios = [];

  assetList.forEach((asset) => {
    const extension = asset.split('.').pop().toLowerCase();

    if (["png", "jpg", "jpeg"].includes(extension)) {
      images.push(asset);
    } else if (["mp4"].includes(extension)) {
      videos.push(asset);
    } else if (["mp3"].includes(extension)) {
      audios.push(asset);
    }
  });

  return { images, videos, audios };
}

function App() {
  const STORAGE_KEY = "areAssetsCached";
  const [load, updateLoad] = useState(true);

  const [imageSrc, setImageSrc] = useState("./Assets/back-bf.png");

  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesLength = useRef(0);
  const preloadAssets = async (assets, index = 0) => {
    if (index >= assets.length) {
      console.log("Tüm resimler yüklendi!");
      updateLoad(false);
      return;
    }

    setImageSrc(assets[index]);

    // Resim yüklenmesini handleImageLoad ile takip edeceğiz.
  };

  const handleImageLoad = () => {
    console.log(`Resim yüklendi: ${imageSrc}`);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      preloadAssets(images, nextIndex); // Bir sonraki resmi yükle
      return nextIndex;
    });
  };
  const { images, videos, audios } = categorizeAssets(assetsJsonList);

  useEffect(() => {
    if (!load) return;
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue === null) {
      console.log("assets not cached");
      // Eğer mevcut değilse, bir başlangıç değeri kaydet
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true));
      preloadAssets(images);
    } else {
      updateLoad(false);
    }
  }, [load]);


  return (
    <Router>
      <div className="App">
        <img onLoad={imageSrc == "./Assets/back-bf.png" ? () => { } : handleImageLoad} style={{ display: "none" }} src={require(`${imageSrc ? imageSrc : "/Assets/back-bf.png"}`)} alt="" />
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
