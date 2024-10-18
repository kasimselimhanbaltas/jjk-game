import { createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../App";

const initialState: GameSettings = {
  selectedCharacter: "meguna",
  selectedRivalCharacter: "gojo",
  winner: "",
  loser: "",
  surfaceY: 470,
  entry: false,
  domainClashReady: false,
  domainClash: false,
  tutorial: false,
  freePlay: false,
};

const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState: initialState,
  reducers: {
    setFreePlay(state, action) {
      state.freePlay = action.payload;
    },
    setTutorial(state, action) {
      state.tutorial = action.payload;
    },
    setDomainClashReady(state, action) {
      state.domainClashReady = action.payload;
    },
    setDomainClash(state, action) {
      state.domainClash = action.payload;
    },
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
    setEntry(state, action) {
      state.entry = action.payload;
    },
  },
});

export const {
  selectCharacter,
  selectRivalCharacter,
  setWinner,
  setLoser,
  setSurfaceY,
  setEntry,
  setDomainClashReady,
  setDomainClash,
  setTutorial,
  setFreePlay
} = gameSettingsSlice.actions;
export default gameSettingsSlice;

export const selectSurfaceY = (state) => state.GameSettings.surfaceY;
