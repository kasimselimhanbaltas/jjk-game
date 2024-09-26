import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tutorialMode: false,
  currentTaskIndex: 0,
  goToTutorialMenu: false,
  characters: {
    gojo: [
      {
        title: "Movement Controls", // TASK 1
        isComplete: false,
        tasks: [
          { text: "Jump: W", keys: ["w"], isPressed: false },
          { text: "Move right: D", keys: ["d"], isPressed: false },
          { text: "Move left: A", keys: ["a"], isPressed: false },
        ],
      },
      {
        title: "Skill: Blue", // TASK 2
        isComplete: false,
        tasks: [{ text: "Use your BLUE skill: E", keys: ["e"], isPressed: false }],
      },
      {
        title: "Skill: Red", // TASK 3
        isComplete: false,
        tasks: [{ text: "Use your RED skill: R", keys: ["r"], isPressed: false }],
      },
      {
        title: "Skill: Hollow Purple", // TASK 4
        isComplete: false,
        tasks: [{ text: "Use your HOLLOW PURPLE skill: E+R", keys: ["e", "r"], isPressed: false }],
      },
      {
        title: "Mixing Colors", // TASK 5
        isComplete: false,
        tasks: [
          { text: "Make a charged blue", keys: ["shift", "e"], isPressed: false },
          { text: "Make a charged red", keys: ["shift", "r"], isPressed: false }
        ],
      },
      {
        title: "Domain Expansion: Infinite Void", // TASK 6
        isComplete: false,
        tasks: [{ text: "Expand your domain: L", keys: ["l"], isPressed: false }],
      },

    ],
  },
  // sukuna: {
  //   movement: {
  //     isComplete: false,
  //     currentTaskIndex: 0,
  //     tasks: ["Move with WASD"],
  //   },
  //   slash: {
  //     isComplete: false,
  //     currentTaskIndex: 0,
  //     tasks: ["Perform slash (K)", "Teleport and slam (S + J)"],
  //   },
  //   domain: {
  //     isComplete: false,
  //     currentTaskIndex: 0,
  //     tasks: ["Expand domain (L)", "Use amplified slash (Q)"],
  //   },
  //   // Sukuna'nın diğer görevleri...
  // },
  // Diğer karakterlerin tutorial'ları...
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
      if (character === "gojo") {
        state.characters.gojo[tutorialIndex].tasks[taskIndex].isPressed = true;
      }
    },
    allTasksFinished: (state, action) => {
      const { tutorialIndex, character } = action.payload;
      if (character === "gojo") {
        state.characters.gojo[tutorialIndex].isComplete = true;
      }
    },
    setGoToTutorialMenu: (state, action) => {
      state.goToTutorialMenu = action.payload;
    },
    setTutorialIndex: (state, action) => {
      state.currentTaskIndex = action.payload;
    },

  },
});

export default tutorialSlice;
export const {
  setTutorialMode,
  completeOneTaskInTutorial,
  allTasksFinished,
  setGoToTutorialMenu,
  setTutorialIndex
}
  = tutorialSlice.actions;;
