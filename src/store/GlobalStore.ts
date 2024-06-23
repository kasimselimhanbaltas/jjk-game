import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import MegumiSlice from "./MegumiSlice";
import SukunaSlice from "./SukunaSlice";
import NueSlice from "./NueSlice";
import divineDogsSlice from "./DivineDogsSlice";
import gameSettingsSlice from "./GameSettingsSlice";

const store = configureStore({
  reducer: {
    MegumiState: MegumiSlice.reducer,
    SukunaState: SukunaSlice.reducer,
    NueState: NueSlice.reducer,
    DivineDogsState: divineDogsSlice.reducer,
    GameSettingsState: gameSettingsSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
