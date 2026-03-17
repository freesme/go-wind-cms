import {createSlice} from '@reduxjs/toolkit';

import type {ILanguageState} from '../../types';

const initialState: ILanguageState = {
    locale: 'zh-CN',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLocale(state, action) {
            state.locale = action.payload;
        },
    },
});

export const {setLocale} = languageSlice.actions;

export default languageSlice.reducer;
