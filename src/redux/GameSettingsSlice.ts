import { createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../App";

const initialState: GameSettings = {
  selectedCharacter: "sukuna",
  selectedRivalCharacter: "megumi",
  winner: "",
  loser: "",
  surfaceY: 560,
};

const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState: initialState,
  reducers: {
    selectCharacter(state, action) {
      state.selectedCharacter = action.payload;
    },
    selectRivalCharacter(state, action) {
      state.selectedRivalCharacter = action.payload;
    },
    setWinner(state, action) {
      state.winner = action.payload;
    },
    setLoser(state, action) {
      state.loser = action.payload;
    },
    setSurfaceY(state, action) {
      state.surfaceY = action.payload;
    },
  },
});

export const {
  selectCharacter,
  selectRivalCharacter,
  setWinner,
  setLoser,
  setSurfaceY,
} = gameSettingsSlice.actions;
export default gameSettingsSlice;

export const selectSurfaceY = (state) => state.GameSettings.surfaceY;
