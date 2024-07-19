import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavbarState {
  isMinimized: boolean;
}

const initialState: NavbarState = {
  isMinimized: false,
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    toggleNavbar: (state) => {
      state.isMinimized = !state.isMinimized;
    },
  },
});

export const { toggleNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;
