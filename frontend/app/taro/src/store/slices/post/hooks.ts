import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
import {
    listPost,
    getPost,
    createPost,
    updatePost,
    deletePost,
    clearPostDetail,
    resetPost,
    getTranslation,
    getPostTitle,
    getPostSummary,
    getPostThumbnail,
    getPostContent,
} from './slice';
import {createAbortableCalls} from "@/store/async-thunk";

export function usePostStore() {
    const post = useSelector((state: RootState) => state.post);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        listPost: cancellableListPost,
        getPost: cancellableGetPost,
        createPost: cancellableCreatePost,
        updatePost: cancellableUpdatePost,
        deletePost: cancellableDeletePost,
    } = createAbortableCalls(dispatch,
        {
            listPost,
            getPost,
            createPost,
            updatePost,
            deletePost,
        });

    return {
        ...post,
        listPost: cancellableListPost,
        getPost: cancellableGetPost,
        createPost: cancellableCreatePost,
        updatePost: cancellableUpdatePost,
        deletePost: cancellableDeletePost,
        clearPostDetail: () => dispatch(clearPostDetail()),
        resetPost: () => dispatch(resetPost()),
        getTranslation,
        getPostTitle,
        getPostSummary,
        getPostThumbnail,
        getPostContent,
    };
}
