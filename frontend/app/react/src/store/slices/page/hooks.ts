import {useSelector, useDispatch} from 'react-redux';
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
import {createAbortableCalls} from "@/store/async-thunk";

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
            // @ts-expect-error - 忽略类型检查
            listPage,
            // @ts-expect-error - 忽略类型检查
            getPage,
            // @ts-expect-error - 忽略类型检查
            createPage,
            // @ts-expect-error - 忽略类型检查
            updatePage,
            // @ts-expect-error - 忽略类型检查
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
