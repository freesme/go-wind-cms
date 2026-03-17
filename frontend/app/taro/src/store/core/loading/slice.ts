import {createSlice} from '@reduxjs/toolkit';

import type {ILoadingState} from '../../types';

const initialState: ILoadingState = {
    isLoading: false,
    error: null,
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
            state.error = null;
        },
        finishLoading(state) {
            state.isLoading = false;
        },
        loadingError(state) {
            state.isLoading = false;
            state.error = true;
        },
    },
});

export const {startLoading, finishLoading, loadingError} = loadingSlice.actions;
export default loadingSlice.reducer;
