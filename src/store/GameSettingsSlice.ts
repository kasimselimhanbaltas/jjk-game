import { createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../App";

const initialState: GameSettings = {
  selectedCharacter: "",
};

const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState: initialState,
  reducers: {
    selectCharacter(state, action) {
      state.selectedCharacter = action.payload;
    },
  },
});

export const { selectCharacter } = gameSettingsSlice.actions;
export default gameSettingsSlice;
