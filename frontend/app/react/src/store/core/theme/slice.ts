import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {IThemeState, ThemeMode} from '../../types';

const initialState: IThemeState = {
    mode: 'system',  // 默认跟随系统
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setMode(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
        },
    }
});

export const {setMode} = themeSlice.actions;

export default themeSlice.reducer;
