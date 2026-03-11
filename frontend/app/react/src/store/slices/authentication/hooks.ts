import {useSelector, useDispatch} from 'react-redux';

import type {IAuthenticationState} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {setLoading, setError, clearError, setUserInfo, type LoginParams} from './slice';
import type {identityservicev1_User} from '@/api/generated/app/service/v1';
import {
 createAuthenticationServiceClient,
 createUserProfileServiceClient,
} from '@/api/generated/app/service/v1';
import {requestClientRequestHandler} from '@/transport/rest';

/**
 * 加密密码（需要实现 AES 加密）
 * @param password 明文密码
 */
function encryptPassword(password: string): string {
 // TODO: 实现 AES 加密逻辑
 // const key = import.meta.env.VITE_AES_KEY;
 // return encryptData(password, key, key);

 // 暂时返回明文，后续需要实现加密
 console.warn('密码未加密，需要实现 AES 加密逻辑');
 return password;
}

export function useAuthenticationStore() {
 const dispatch = useDispatch<AppDispatch>();
 const authentication = useSelector<RootState, IAuthenticationState>(
 (state) => state.authentication,
 );

 // 创建服务客户端
 const authService = createAuthenticationServiceClient(
 requestClientRequestHandler,
 );
 const userProfileService = createUserProfileServiceClient(
 requestClientRequestHandler,
 );

 /**
  * 异步处理用户登录操作并获取 accessToken
  */
 async function authLogin(
 params: LoginParams,
 onSuccess?: () => Promise<void> | void,
 ) {
 let userInfo: identityservicev1_User | null = null;

 try {
 dispatch(setLoading(true));
 dispatch(clearError());

 // 调用登录 API
 const response = await authService.Login({
 username: params.username,
 email: params.email,
 mobile: params.mobile,
 password: encryptPassword(params.password),
 grant_type: params.grant_type || 'password',
 });

 // 如果成功获取到 accessToken
 if (response.access_token) {
 // TODO: 存储 token 到 access store
 // accessStore.setAccessToken(response.access_token);
 // if (response.refresh_token) {
 //  accessStore.setRefreshToken(response.refresh_token);
 // }

 // 获取用户信息并存储
 userInfo = await fetchUserInfo();

 // TODO: 更新 user store
 // userStore.setUserInfo(userInfo);

 dispatch(setUserInfo(userInfo));

 // 执行成功回调或跳转
 if (onSuccess) {
 await onSuccess();
 }
 }
 } catch (error) {
 const errorMessage = error instanceof Error ? error.message: '登录失败';
 dispatch(setError(errorMessage));
 throw error;
 } finally {
 dispatch(setLoading(false));
 }

 return {
 userInfo,
 };
 }

 /**
  * 拉取用户信息
  */
 async function fetchUserInfo(): Promise<identityservicev1_User> {
 return await userProfileService.GetUser({});
 }

 /**
  * 清除错误状态
  */
 function clearAuthenticationError() {
 dispatch(clearError());
 }

 return {
 authentication,
 dispatch,
 setLoading: (loading: boolean) => dispatch(setLoading(loading)),
 setError: (error: string | null) => dispatch(setError(error)),
 clearError: clearAuthenticationError,
 authLogin,
 fetchUserInfo,
 };
}

/**
 * 获取认证加载状态
 */
export function useAuthLoading() {
 return useSelector<RootState, boolean>((state) => state.authentication.loading);
}

/**
 * 获取认证错误信息
 */
export function useAuthError() {
 return useSelector<RootState, string | null>((state) => state.authentication.error);
}
