import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
        title: "Skill: Red", // TASK 2
        isComplete: false,
        tasks: [{ text: "Use your RED skill: R", key: "e", isPressed: false }],
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
    completeOneTaskInTutorial: (state, action) => {
      const { tutorialIndex, taskIndex, character } = action.payload;
      if (character === "gojo") {
        state.characters.gojo[tutorialIndex].tasks[taskIndex].isPressed = true;
      }
    },
  },
});

export default tutorialSlice;
