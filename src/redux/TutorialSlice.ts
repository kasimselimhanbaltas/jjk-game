import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tutorialMode: false,
  currentTaskIndex: 0,
  characters: {
    gojo: [
      {
        title: "Movement Controls", // TASK 1
        isComplete: false,
        tasks: [
          { text: "Jump: W", key: "w", isPressed: false },
          { text: "Move right: D", key: "d", isPressed: false },
          { text: "Move left: A", key: "a", isPressed: false },
        ],
      },
      {
        title: "Skill: Blue", // TASK 2
        isComplete: false,
        tasks: [{ text: "Use your BLUE skill: E", key: "e", isPressed: false }],
      },
      {
        title: "Skill: Red", // TASK 3
        isComplete: false,
        tasks: [{ text: "Use your RED skill: R", key: "r", isPressed: false }],
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
    }

  },
});

export default tutorialSlice;
export const {
  setTutorialMode,
  completeOneTaskInTutorial,
  allTasksFinished
}
  = tutorialSlice.actions;;
