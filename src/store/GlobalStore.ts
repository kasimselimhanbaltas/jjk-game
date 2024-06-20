import { configureStore } from "@reduxjs/toolkit";
import PlayerSlice from "./PlayerSlice";
import RivalSlice from "./RivalSlice";
import NueSlice from "./NueSlice";
import divineDogsSlice from "./DivineDogsSlice";
import gameSettingsSlice from "./GameSettingsSlice";

const store = configureStore({
  reducer: {
    PlayerState: PlayerSlice.reducer,
    RivalState: RivalSlice.reducer,
    NueState: NueSlice.reducer,
    DivineDogsState: divineDogsSlice.reducer,
    GameSettingsState: gameSettingsSlice.reducer,
  },
});

export default store;
