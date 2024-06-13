import { createSlice } from "@reduxjs/toolkit";
import { Character } from "../App";

interface CharacterState {
  Characters: number;
}

const initialState: CharacterState = {
  Characters: 0,
};
const CharacterSlice = createSlice({
  name: "CharacterState",
  initialState: initialState,
  reducers: {
    setCharacters: (state, action) => {
      return { ...state, Characters: action.payload };
    },
  },
});

export default CharacterSlice;
export const { setCharacters } = CharacterSlice.actions;
