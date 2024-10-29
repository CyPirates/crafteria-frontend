import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeState = {
    isLight: boolean;
};

const initialState: ThemeState = {
    isLight: true,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isLight = !state.isLight;
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
