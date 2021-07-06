/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const helloWorldSlice = createSlice({
  name: 'helloWorld',
  initialState: {
    value: 'Hello World',
  },
  reducers: {
    changeValue: () => {},
    setValue: (state, action) => {
      return {
        ...state,
        value: action.payload,
      };
    },
  },
});

export const { changeValue, setValue } = helloWorldSlice.actions;

export default helloWorldSlice.reducer;
