import {useSelector, useDispatch} from 'react-redux';

import type {IThemeState, ThemeMode} from '../../types';
import type {AppDispatch, RootState} from '@/store';

import {setMode} from './slice';


export function useThemeStore() {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector<RootState, IThemeState>((state) => state.theme);

    return {
        theme,
        dispatch,
        setMode: (mode: ThemeMode) => {
            dispatch(setMode(mode));
        },
    };
}

/**
 * 获取当前主题模式
 */
export function useThemeMode() {
    // 直接使用 Redux store 中的值
    return useSelector<RootState, ThemeMode>((state) => state.theme.mode);
}
