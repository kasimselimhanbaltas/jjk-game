import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
