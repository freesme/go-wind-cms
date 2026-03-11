import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
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
import {createAbortableCalls} from "@/store/async-thunk";

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
            // @ts-expect-error - 忽略类型检查
            listTag,
            // @ts-expect-error - 忽略类型检查
            getTag,
            // @ts-expect-error - 忽略类型检查
            createTag,
            // @ts-expect-error - 忽略类型检查
            updateTag,
            // @ts-expect-error - 忽略类型检查
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
