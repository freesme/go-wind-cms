import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
import {
    listCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCategoryDetail,
    resetCategory,
    getTranslation,
    getCategoryName,
    getCategoryDescription,
    getCategoryThumbnail,
} from './slice';
import {createAbortableCalls} from "@/store/async-thunk";

export function useCategoryStore() {
    const category = useSelector((state: RootState) => state.category);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listCategory: cancellableListCategory,
        getCategory: cancellableGetCategory,
        createCategory: cancellableCreateCategory,
        updateCategory: cancellableUpdateCategory,
        deleteCategory: cancellableDeleteCategory,
    } = createAbortableCalls(dispatch,
        {
            // @ts-expect-error - 忽略类型检查
            listCategory,
            // @ts-expect-error - 忽略类型检查
            getCategory,
            // @ts-expect-error - 忽略类型检查
            createCategory,
            // @ts-expect-error - 忽略类型检查
            updateCategory,
            // @ts-expect-error - 忽略类型检查
            deleteCategory,
        });

    return {
        ...category,
        listCategory: cancellableListCategory,
        getCategory: cancellableGetCategory,
        createCategory: cancellableCreateCategory,
        updateCategory: cancellableUpdateCategory,
        deleteCategory: cancellableDeleteCategory,
        clearCategoryDetail: () => dispatch(clearCategoryDetail()),
        resetCategory: () => dispatch(resetCategory()),
        // 辅助函数
        getTranslation,
        getCategoryName,
        getCategoryDescription,
        getCategoryThumbnail,
    };
}
