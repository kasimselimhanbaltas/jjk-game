import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rivalAction: "",
  tutorialMode: false,
  currentTaskIndex: 0,
  goToTutorialMenu: false,
  characters: {
    "gojo": [
      {
        title: "Movements", // TASK 1
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Jump: ", keys: ["w"], isPressed: false },
          { text: "Move right: ", keys: ["d"], isPressed: false },
          { text: "Move left: ", keys: ["a"], isPressed: false },
        ],
      },
      {
        title: "Blue", // TASK 2
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your BLUE skill", keys: ["e"], isPressed: false }],
      },
      {
        title: "Red", // TASK 3
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your RED skill", keys: ["r"], isPressed: false }],
      },
      {
        title: "Hollow Purple", // TASK 4
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your HOLLOW PURPLE skill", keys: ["e", "r"], isPressed: false }],
      },
      {
        title: "Mixing Colors", // TASK 5
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Make a charged blue", keys: ["shift", "e"], isPressed: false },
          { text: "Make a charged red", keys: ["shift", "r"], isPressed: false }
        ],
      },
      {
        title: "Infinite Void", // TASK 6
        isComplete: false,
        rivalTaskAction: "none",
        tips: "Expanding your domain will make you unable to use your Cursed Technique right after your expansion is finished.",
        tasks: [{ text: "Expand your domain", keys: ["l"], isPressed: false }],
      },
      {
        title: "Domain Clash", // TASK 7
        isComplete: false,
        rivalTaskAction: { action: "domain", timeout: 2 },
        tips: "You must expand your domain with perfect timing in order to protect yourself from the enemy domain's Sure Hit Effect.\
        Sure Hit Effect always bypasses infinity. Best way to counter Sure Hit Effect is to expand your own domain.",
        tasks: [{ text: "Expand your domain", keys: ["l"], isPressed: false }],
      },
      {
        title: "Close Combat", // TASK 8
        isComplete: false,
        rivalTaskAction: "none",
        tips: "While using your Cursed Energy, use your combat skills to maximize your damage.",
        tasks: [
          { text: "Punching Combo", keys: ["j"], isPressed: false },
          { text: "Black Flash Combo", keys: ["k"], isPressed: false },
          { text: "Kick Combo", keys: ["s", "j"], isPressed: false },
        ],
      },
      {
        title: "Reverse Cursed Technique", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "useCleave", timeout: 2 },
        tips: "You can heal yourself or make yourself able to use your Cursed Technique sooner by manipulating the reverse cursed energy. \
        Be careful, Reverse Cursed Energy and Cursed Energy cannot be used simultaneously, so you cannot use your Cursed Technique while RCT is active.",
        tasks: [
          { text: "Heal with RCT", keys: ["z"], isPressed: false },
          { text: "Use Blue Skill", keys: ["e"], isPressed: false },
          { text: "Heal burnt out CT with RCT", keys: ["x"], isPressed: false },
        ],
      },
      {
        title: "Simple Domain", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "forceDomain", timeout: 2 },
        tips: "Simple domain buys you a litte time against a domain by cancelling the Sure Hit Effect for you.",
        tasks: [
          { text: "Use Simple Domain", keys: ["c"], isPressed: false },
        ],
      },
      {
        title: "Falling Blossom Emotion", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "forceDomain", timeout: 2 },
        tips: "This technique programs your cursed energy to counter the incoming attacks with the same amount of cursed energy.\
        Effective against basic Cursed Techniques such as Malevolent Shrine's Dismantle and Cleave",
        tasks: [
          { text: "Use Falling Blossom Emotion", keys: ["g"], isPressed: false },
        ],
      },
    ],
    "meguna": [
      {
        title: "Movements", // TASK 1
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Jump: ", keys: ["w"], isPressed: false },
          { text: "Move right: ", keys: ["d"], isPressed: false },
          { text: "Move left: ", keys: ["a"], isPressed: false },
        ],
      },
      {
        title: "Blue", // TASK 2
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your BLUE skill", keys: ["e"], isPressed: false }],
      },
      {
        title: "Red", // TASK 3
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your RED skill", keys: ["r"], isPressed: false }],
      },
      {
        title: "Hollow Purple", // TASK 4
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [{ text: "Use your HOLLOW PURPLE skill", keys: ["e", "r"], isPressed: false }],
      },
      {
        title: "Mixing Colors", // TASK 5
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Make a charged blue", keys: ["shift", "e"], isPressed: false },
          { text: "Make a charged red", keys: ["shift", "r"], isPressed: false }
        ],
      },
      {
        title: "Infinite Void", // TASK 6
        isComplete: false,
        rivalTaskAction: "none",
        tips: "Expanding your domain will make you unable to use your Cursed Technique right after your expansion is finished.",
        tasks: [{ text: "Expand your domain", keys: ["l"], isPressed: false }],
      },
      {
        title: "Domain Clash", // TASK 7
        isComplete: false,
        rivalTaskAction: { action: "domain", timeout: 2 },
        tips: "You must expand your domain with perfect timing in order to protect yourself from the enemy domain's Sure Hit Effect.\
        Sure Hit Effect always bypasses infinity. Best way to counter Sure Hit Effect is to expand your own domain.",
        tasks: [{ text: "Expand your domain", keys: ["l"], isPressed: false }],
      },
      {
        title: "Close Combat", // TASK 8
        isComplete: false,
        rivalTaskAction: "none",
        tips: "While using your Cursed Energy, use your combat skills to maximize your damage.",
        tasks: [
          { text: "Punching Combo", keys: ["j"], isPressed: false },
          { text: "Black Flash Combo", keys: ["k"], isPressed: false },
          { text: "Kick Combo", keys: ["s", "j"], isPressed: false },
        ],
      },
      {
        title: "Reverse Cursed Technique", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "useCleave", timeout: 2 },
        tips: "You can heal yourself or make yourself able to use your Cursed Technique sooner by manipulating the reverse cursed energy. \
        Be careful, Reverse Cursed Energy and Cursed Energy cannot be used simultaneously, so you cannot use your Cursed Technique while RCT is active.",
        tasks: [
          { text: "Heal with RCT", keys: ["z"], isPressed: false },
          { text: "Use Blue Skill", keys: ["e"], isPressed: false },
          { text: "Heal burnt out CT with RCT", keys: ["x"], isPressed: false },
        ],
      },
      {
        title: "Simple Domain", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "forceDomain", timeout: 2 },
        tips: "Simple domain buys you a litte time against a domain by cancelling the Sure Hit Effect for you.",
        tasks: [
          { text: "Use Simple Domain", keys: ["c"], isPressed: false },
        ],
      },
      {
        title: "Falling Blossom Emotion", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "forceDomain", timeout: 2 },
        tips: "This technique programs your cursed energy to counter the incoming attacks with the same amount of cursed energy.\
        Effective against basic Cursed Techniques such as Malevolent Shrine's Dismantle and Cleave",
        tasks: [
          { text: "Use Falling Blossom Emotion", keys: ["g"], isPressed: false },
        ],
      },
    ],

    // SUKUNA TUTORIALS
    "sukuna": [
      {
        title: "Movements", // TASK 1
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Jump", keys: ["w"], isPressed: false, timeoutSec: 0 },
          { text: "Move right", keys: ["d"], isPressed: false, timeoutSec: 0 },
          { text: "Move left", keys: ["a"], isPressed: false, timeoutSec: 0 },
          { text: "Backflip", keys: ["s"], isPressed: false, timeoutSec: 0 },
          { text: "Dash", keys: ["space"], isPressed: false, timeoutSec: 0 },
        ],
        timeoutSec: 1
      },
      {
        title: "Dismantle", // TASK 
        rivalTaskAction: { action: "combat", timeout: 0 },
        isComplete: false,
        tips: "",
        tasks: [{ text: "Use your DISMANTLE skill", keys: ["e"], isPressed: false, timeoutSec: 1 }],
        timeoutSec: 1
      },
      {
        title: "Cleave", // TASK 
        rivalTaskAction: { action: "combat", timeout: 0 },
        isComplete: false,
        tips: "",
        tasks: [{ text: "Use your CLEAVE skill", keys: ["r"], isPressed: false, timeoutSec: 1 }],
        timeoutSec: 1
      },
      {
        title: "Malevolent Shrine", // TASK 
        rivalTaskAction: "none",
        isComplete: false,
        tips: "",
        tasks: [{ text: "Expand your domain!", keys: ["l"], isPressed: false, timeoutSec: 1 }],
        timeoutSec: 10
      },
      {
        title: "Rapid Slashes", // TASK 
        rivalTaskAction: { action: "rapid", timeout: 0 },
        isComplete: false,
        tips: "",
        tasks: [{ text: "Use your RAPID SLASHES skill!", keys: ["e"], isPressed: false, timeoutSec: 1 }],
        timeoutSec: 3
      },
      {
        title: "FUGA: OPEN", // TASK 
        rivalTaskAction: { action: "combat", timeout: 0 },
        isComplete: false,
        tips: "",
        tasks: [{ text: "It's a little cold in here isn't it? Open up the furnace!", keys: ["f"], isPressed: false, timeoutSec: 1 }],
        timeoutSec: 10
      },
      {
        title: "Domain Clash", // TASK 7
        isComplete: false,
        rivalTaskAction: { action: "domain", timeout: 3 },
        tips: "",
        tasks: [{ text: "Expand your domain: L", keys: ["l"], isPressed: false }],
      },
      {
        title: "Close Combat", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "combat", timeout: 0 },
        tips: "",
        tasks: [
          { text: "Launching Kick", keys: ["j"], isPressed: false },
          { text: "Bam Attack", keys: ["k"], isPressed: false },
        ],
      },
      {
        title: "Reverse Cursed Technique", // TASK 8
        isComplete: false,
        rivalTaskAction: { action: "useBlue", timeout: 3 },
        tips: "",
        tasks: [
          { text: "Heal with RCT", keys: ["z"], isPressed: false },
          { text: "Use Cleave", keys: ["r"], isPressed: false },
          { text: "Heal burnt out CT with RCT", keys: ["x"], isPressed: false },
        ],
      },
      {
        title: "Domain Amplification", // TASK 8
        isComplete: false,
        rivalTaskAction: "none",
        tips: "",
        tasks: [
          { text: "Activate Domain Amplification", keys: ["q"], isPressed: false },
        ],
      },
    ]
    // Diğer karakterlerin tutorial'ları...
  },
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    setTutorialMode: (state, action) => {
      const { tutorialMode, tutorialIndex } = action.payload;
      state.tutorialMode = tutorialMode;
      state.currentTaskIndex = tutorialIndex;
    },
    completeOneTaskInTutorial: (state, action) => {
      const { tutorialIndex, taskIndex, character } = action.payload;
      state.characters[character][tutorialIndex].tasks[taskIndex].isPressed = true;
    },
    allTasksFinished: (state, action) => {
      const { tutorialIndex, character } = action.payload;
      state.characters[character][tutorialIndex].isComplete = true;
    },
    setGoToTutorialMenu: (state, action) => {
      state.goToTutorialMenu = action.payload;
    },
    setTutorialIndex: (state, action) => {
      state.currentTaskIndex = action.payload;
    },
    setRivalAction: (state, action) => {
      state.rivalAction = action.payload;
    },

  },
});

export default tutorialSlice;
export const {
  setTutorialMode,
  completeOneTaskInTutorial,
  allTasksFinished,
  setGoToTutorialMenu,
  setTutorialIndex,
  setRivalAction
}
  = tutorialSlice.actions;
