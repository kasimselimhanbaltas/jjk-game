import { configureStore } from "@reduxjs/toolkit";
import CharacterSlice from "./characterSlice";
import PlayerSlice from "./PlayerSlice";

const store = configureStore({
  reducer: {
    CharacterState: CharacterSlice.reducer,
    PlayerState: PlayerSlice.reducer,
  },
});

export default store;
