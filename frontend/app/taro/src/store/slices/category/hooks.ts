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

export function useCategoryStore() {
  const category = useSelector((state: RootState) => state.category);
  const dispatch = useDispatch<AppDispatch>();

  // 创建带取消功能的 API 调用
  const cancellableListCategory = async (params: Parameters<typeof listCategory>[0]) => {
    return dispatch(listCategory(params)).unwrap();
  };
  const cancellableGetCategory = async (params: Parameters<typeof getCategory>[0]) => {
    return dispatch(getCategory(params)).unwrap();
  };
  const cancellableCreateCategory = async (params: Parameters<typeof createCategory>[0]) => {
    return dispatch(createCategory(params)).unwrap();
  };
  const cancellableUpdateCategory = async (params: Parameters<typeof updateCategory>[0]) => {
    return dispatch(updateCategory(params)).unwrap();
  };
  const cancellableDeleteCategory = async (params: Parameters<typeof deleteCategory>[0]) => {
    return dispatch(deleteCategory(params)).unwrap();
  };

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
