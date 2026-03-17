import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';

/**
 * 获取 Redux store 的 dispatch
 */
export function useAppDispatch() {
    return useDispatch<AppDispatch>();
}

/**
 * 获取 Redux store 的 selector
 */
export function useAppSelector<T>(selector: (state: RootState) => T): T {
    return useSelector(selector);
}
