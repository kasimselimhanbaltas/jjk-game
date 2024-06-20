import { configureStore } from "@reduxjs/toolkit";
import PlayerSlice from "./PlayerSlice";
import RivalSlice from "./RivalSlice";
import NueSlice from "./NueSlice";
import divineDogsSlice from "./DivineDogsSlice";

const store = configureStore({
  reducer: {
    PlayerState: PlayerSlice.reducer,
    RivalState: RivalSlice.reducer,
    NueState: NueSlice.reducer,
    DivineDogsState: divineDogsSlice.reducer,
  },
});

export default store;
