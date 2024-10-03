import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import MegumiSlice from "./character-slices/MegumiSlice";
import SukunaSlice from "./character-slices/SukunaSlice";
import NueSlice from "./NueSlice";
import divineDogsSlice from "./DivineDogsSlice";
import gameSettingsSlice from "./GameSettingsSlice";
import GojoSlice from "./character-slices/GojoSlice";
import TutorialSlice from "./TutorialSlice";

export const CharacterState = {
  IDLE: 'idle',
  ATTACKING: 'attacking',
  BLOCKING: 'blocking',
  TAKING_DAMAGE: 'taking_damage',
  STUNNED: 'stunned',
  // Add other states as needed
};


const store = configureStore({
  reducer: {
    MegumiState: MegumiSlice.reducer,
    SukunaState: SukunaSlice.reducer,
    GojoState: GojoSlice.reducer,
    NueState: NueSlice.reducer,
    DivineDogsState: divineDogsSlice.reducer,
    GameSettingsState: gameSettingsSlice.reducer,
    TutorialState: TutorialSlice.reducer,
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
