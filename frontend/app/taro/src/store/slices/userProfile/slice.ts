import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {createUserProfileServiceClient} from "@/api/generated/app/service/v1";
import {requestApi} from "@/transport/rest";
import {IUserProfileState} from "@/store/types";


const initialState: IUserProfileState = {
    detail: null,
    loading: false,
};

export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetchUserProfile',
    async (_, {rejectWithValue}) => {
        const userProfileService = createUserProfileServiceClient(requestApi);

        try {
            return await userProfileService.GetUser({});
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        clearUserProfile: (state) => {
            state.detail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload || null;
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const {clearUserProfile} = userProfileSlice.actions;
export default userProfileSlice.reducer;
