import {useSelector, useDispatch} from 'react-redux';

import type {RootState, AppDispatch} from '@/store';
import {createAbortableCalls} from "@/store/async-thunk";

import {
    listTag,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    clearTagDetail,
    resetTag,
    getTranslation,
} from './slice';

export function useTagStore() {
    const tag = useSelector((state: RootState) => state.tag);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listTag: cancellableListTag,
        getTag: cancellableGetTag,
        createTag: cancellableCreateTag,
        updateTag: cancellableUpdateTag,
        deleteTag: cancellableDeleteTag,
    } = createAbortableCalls(dispatch,
        {
            listTag,
            getTag,
            createTag,
            updateTag,
            deleteTag,
        });

    return {
        ...tag,
        listTag: cancellableListTag,
        getTag: cancellableGetTag,
        createTag: cancellableCreateTag,
        updateTag: cancellableUpdateTag,
        deleteTag: cancellableDeleteTag,
        clearTagDetail: () => dispatch(clearTagDetail()),
        resetTag: () => dispatch(resetTag()),
        getTranslation,
    };
}
