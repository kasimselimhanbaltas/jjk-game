import { createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../App";

const initialState: GameSettings = {
  selectedCharacter: "gojo",
  winner: "",
  loser: "",
};

const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState: initialState,
  reducers: {
    selectCharacter(state, action) {
      state.selectedCharacter = action.payload;
    },
    setWinner(state, action) {
      state.winner = action.payload;
    },
    setLoser(state, action) {
      state.loser = action.payload;
    },
  },
});

export const { selectCharacter, setWinner, setLoser } =
  gameSettingsSlice.actions;
export default gameSettingsSlice;
