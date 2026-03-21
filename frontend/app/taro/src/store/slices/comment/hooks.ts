import {useSelector, useDispatch} from 'react-redux';

import type {RootState, AppDispatch} from '@/store';
import {createAbortableCalls} from "@/store/async-thunk";

import {
  listComment,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  clearCommentDetail,
  resetComment,
} from './slice';

export function useCommentStore() {
  const comment = useSelector((state: RootState) => state.comment);
  const dispatch = useDispatch<AppDispatch>();

  // 创建带取消功能的 API 调用
  const {
    listComment: cancellableListComment,
    getComment: cancellableGetComment,
    createComment: cancellableCreateComment,
    updateComment: cancellableUpdateComment,
    deleteComment: cancellableDeleteComment,
  } = createAbortableCalls(dispatch,
    {
      listComment,
      getComment,
      createComment,
      updateComment,
      deleteComment,
    });

  return {
    ...comment,
    listComment: cancellableListComment,
    getComment: cancellableGetComment,
    createComment: cancellableCreateComment,
    updateComment: cancellableUpdateComment,
    deleteComment: cancellableDeleteComment,
    clearCommentDetail: () => dispatch(clearCommentDetail()),
    resetComment: () => dispatch(resetComment()),
  };
}
