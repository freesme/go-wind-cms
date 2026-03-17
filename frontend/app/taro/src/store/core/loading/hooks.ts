import {useSelector, useDispatch} from 'react-redux';

import type {RootState, AppDispatch} from '@/store';
import {startLoading, finishLoading, loadingError} from './slice';

export function useLoading() {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector<RootState, boolean>((state) => state.loading.isLoading);

    return {
        isLoading: loading,
        start: () => dispatch(startLoading()),
        finish: () => dispatch(finishLoading()),
        error: () => dispatch(loadingError()),
    };
}
