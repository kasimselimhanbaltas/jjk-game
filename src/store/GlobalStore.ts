import { configureStore } from "@reduxjs/toolkit";
import PlayerSlice from "./PlayerSlice";
import RivalSlice from "./RivalSlice";
import NueSlice from "./NueSlice";

const store = configureStore({
  reducer: {
    PlayerState: PlayerSlice.reducer,
    RivalState: RivalSlice.reducer,
    NueState: NueSlice.reducer,
  },
});

export default store;
