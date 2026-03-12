import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {IThemeState, ThemeMode} from '../../types';
import {StorageManager} from '@/caches';
import {appNamespace} from '@/caches';

// 使用函数来延迟初始化，确保只在客户端访问 localStorage
const getInitialState = (): IThemeState => {
    // 服务端环境返回默认值
    if (typeof window === 'undefined') {
        return {mode: 'system'};
    }

    // 客户端环境尝试从 localStorage 读取
    try {
        const storage = new StorageManager({prefix: `${appNamespace}-theme`});
        const storedMode = storage.getItem<ThemeMode>('mode', null);
        
        console.log('[Theme Store] storedMode:', storedMode, typeof storedMode);
        
        // 如果有明确的主题偏好（light/dark），直接使用
        if (storedMode && storedMode !== 'system') {
            console.log('[Theme Store] Using stored mode:', storedMode);
            return {
                mode: storedMode
            };
        }
        
        // 如果用户选择了跟随系统，或者没有存储，根据系统主题设置初始值
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = isDark ? 'dark' : 'light';
        console.log('[Theme Store] Mode is "system" or not set, using system theme:', systemTheme);
        return {
            mode: 'system'  // 保持 mode 为 'system'，但应用系统主题的视觉效果
        };
    } catch (error) {
        console.error('[Theme Store] Error reading mode:', error);
        return {mode: 'system'};
    }
};

const initialState: IThemeState = getInitialState();

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setMode(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
            // 持久化到 localStorage（仅在客户端执行）
            if (typeof window !== 'undefined') {
                const storage = new StorageManager({prefix: `${appNamespace}-theme`});
                storage.setItem('mode', action.payload);
            }
        },
    }
});

export const {setMode} = themeSlice.actions;

export default themeSlice.reducer;
