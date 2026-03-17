import {configureStore} from '@reduxjs/toolkit';

import accessReducer from './core/access/slice';
import languageReducer from './core/language/slice';
import themeReducer from './core/theme/slice';
import userReducer from './core/user/slice';
import loadingReducer from './core/loading/slice';

import authenticationReducer from './slices/authentication/slice';
import categoryReducer from './slices/category/slice';
import commentReducer from './slices/comment/slice';
import fileTransferReducer from './slices/fileTransfer/slice';
import navigationReducer from './slices/navigation/slice';
import pageReducer from './slices/page/slice';
import postReducer from './slices/post/slice';
import tagReducer from './slices/tag/slice';
import userProfileReducer from './slices/userProfile/slice';

const store = configureStore({
    reducer: {
        // Core reducers
        access: accessReducer,
        language: languageReducer,
        theme: themeReducer,
        user: userReducer,
        loading: loadingReducer,

        // Feature reducers
        authentication: authenticationReducer,
        category: categoryReducer,
        comment: commentReducer,
        fileTransfer: fileTransferReducer,
        navigation: navigationReducer,
        page: pageReducer,
        post: postReducer,
        tag: tagReducer,
        userProfile: userProfileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
