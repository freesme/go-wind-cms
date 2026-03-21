import {useSelector, useDispatch} from 'react-redux';

import {createAbortableCalls} from "@/store/async-thunk";
import type {RootState, AppDispatch} from '@/store';

import {
    listPage,
    getPage,
    createPage,
    updatePage,
    deletePage,
    clearPageDetail,
    resetPage,
    getTranslation,
} from './slice';

export function usePageStore() {
    const page = useSelector((state: RootState) => state.page);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listPage: cancellableListPage,
        getPage: cancellableGetPage,
        createPage: cancellableCreatePage,
        updatePage: cancellableUpdatePage,
        deletePage: cancellableDeletePage,
    } = createAbortableCalls(dispatch,
        {
            listPage,
            getPage,
            createPage,
            updatePage,
            deletePage,
        });

    return {
        ...page,
        listPage: cancellableListPage,
        getPage: cancellableGetPage,
        createPage: cancellableCreatePage,
        updatePage: cancellableUpdatePage,
        deletePage: cancellableDeletePage,
        clearPageDetail: () => dispatch(clearPageDetail()),
        resetPage: () => dispatch(resetPage()),
        getTranslation,
    };
}
