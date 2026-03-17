import {useSelector, useDispatch} from 'react-redux';
import type {RootState, AppDispatch} from '@/store';
import {
    downloadFileThunk,
    uploadFileThunk,
    clearFileDetail,
    resetFileTransfer,
} from './slice';
import {createAbortableCalls} from "@/store/async-thunk";

export function useFileTransferStore() {
    const fileTransfer = useSelector((state: RootState) => state.fileTransfer);
    const dispatch = useDispatch<AppDispatch>();

    // 创建带取消功能的 API 调用
    const {
        downloadFileThunk: cancellableDownloadFileThunk,
        uploadFileThunk: cancellableUploadFileThunk,
    } = createAbortableCalls(dispatch,
        {
            downloadFileThunk,
            uploadFileThunk,
        });

    return {
        ...fileTransfer,
        downloadFile: cancellableDownloadFileThunk,
        uploadFile: cancellableUploadFileThunk,
        clearFileDetail: () => dispatch(clearFileDetail()),
        resetFileTransfer: () => dispatch(resetFileTransfer()),
    };
}
