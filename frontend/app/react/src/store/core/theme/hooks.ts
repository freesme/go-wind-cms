import {useSelector, useDispatch} from 'react-redux';

import type {IThemeState, ThemeMode} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {appNamespace, StorageManager} from "@/caches";

import {setMode} from './slice';


export function useThemeStore() {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector<RootState, IThemeState>((state) => state.theme);
    const storage = new StorageManager({prefix: `${appNamespace}-theme`});

    return {
        theme,
        dispatch,
        setMode: (mode: ThemeMode) => {
            dispatch(setMode(mode));
            storage.setItem('mode', mode);
        },
    };
}

/**
 * 获取当前主题模式
 */
export function useThemeMode() {
    const storage = new StorageManager({prefix: `${appNamespace}-theme`});
    const storedMode = storage.getItem<ThemeMode>('mode', null);
    if (storedMode) return storedMode;
    return useSelector<RootState, ThemeMode>((state) => state.theme.mode);
}
