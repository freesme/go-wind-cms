import {useSelector, useDispatch} from 'react-redux';

import {createAbortableCalls} from "@/store/async-thunk";
import type {RootState, AppDispatch} from '@/store/types';

import {
    listNavigation,
    getNavigation,
    createNavigation,
    updateNavigation,
    deleteNavigation,
    clearNavigationDetail,
    resetNavigation,
    findNavItem,
} from './slice';

export function useNavigationStore() {
    const navigation = useSelector((state: RootState) => state.navigation);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listNavigation: cancellableListNavigation,
        getNavigation: cancellableGetNavigation,
        createNavigation: cancellableCreateNavigation,
        updateNavigation: cancellableUpdateNavigation,
        deleteNavigation: cancellableDeleteNavigation,
    } = createAbortableCalls(dispatch,
        {
            listNavigation,
            getNavigation,
            createNavigation,
            updateNavigation,
            deleteNavigation,
        });

    return {
        ...navigation,
        listNavigation: cancellableListNavigation,
        getNavigation: cancellableGetNavigation,
        createNavigation: cancellableCreateNavigation,
        updateNavigation: cancellableUpdateNavigation,
        deleteNavigation: cancellableDeleteNavigation,
        clearNavigationDetail: () => dispatch(clearNavigationDetail()),
        resetNavigation: () => dispatch(resetNavigation()),
        findNavItem,
    };
}
