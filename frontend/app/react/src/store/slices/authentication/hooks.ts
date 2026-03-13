import {useSelector, useDispatch} from 'react-redux';

import type {IAuthenticationState, IUser} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {authenticationservicev1_GrantType} from '@/api/generated/app/service/v1';
import {setLoginLoading} from './slice';
import {
    createAuthenticationServiceClient,
    createUserProfileServiceClient,
} from '@/api/generated/app/service/v1';
import {requestApi} from '@/transport/rest';
import {encryptByAES} from "@/utils";
import {useAccessStore} from "@/store/core/access/hooks";
import {useUserStore} from "@/store/core/user/hooks";
import {useI18nRouter} from "@/i18n/helpers";

export interface LoginParams {
    username?: string;
    email?: string;
    mobile?: string;
    password: string;
    grant_type?: string;
}

export const DEFAULT_HOME_PATH = '/'

/**
 * 加密密码（需要实现 AES 加密）
 * @param password 明文密码
 */
function encryptPassword(password: string): string {
    const key = process.env.NEXT_PUBLIC_AES_KEY || '';
    return encryptByAES(password, key);
}

export function useAuthenticationStore() {
    const dispatch = useDispatch<AppDispatch>();
    const authentication = useSelector<RootState, IAuthenticationState>(
        (state) => state.authentication,
    );

    // 创建服务客户端
    const authService = createAuthenticationServiceClient(
        requestApi,
    );
    const userProfileService = createUserProfileServiceClient(
        requestApi,
    );

    const accessStore = useAccessStore();
    const userStore = useUserStore();

    const router = useI18nRouter();

    /**
     * 异步处理用户登录操作并获取 accessToken
     */
    async function login(
        params: LoginParams,
        onSuccess?: () => Promise<void> | void,
    ) {
        let userInfo: IUser | null = null;

        try {
            dispatch(setLoginLoading(true));

            // 调用登录 API
            const response = await authService.Login({
                username: params.username,
                email: params.email,
                mobile: params.mobile,
                password: encryptPassword(params.password),
                grant_type: (params.grant_type || "password") as authenticationservicev1_GrantType,
            });
            if (response.access_token) {

                accessStore.setAccessToken({
                    value: response.access_token,
                    expiresAt: response.expires_in && response.expires_in != 0 ? Date.now() + response.expires_in * 1000 : undefined,
                });
                accessStore.setRefreshToken({
                    value: response.refresh_token || '',
                    expiresAt: response.refresh_expires_in && response.refresh_expires_in != 0 ? Date.now() + response.refresh_expires_in * 1000 : undefined,
                });
                accessStore.setLoginExpired(false)

                userInfo = await fetchUserInfo();
                // TODO: 更新 user store
                userStore.setUser(userInfo);

                onSuccess
                    ? await onSuccess?.()
                    : router.push(userInfo.homePage || DEFAULT_HOME_PATH)
            }
        } catch (error) {
            throw error;
        } finally {
            dispatch(setLoginLoading(false));
        }
        return {
            userInfo,
        };
    }

    /**
     * 拉取用户信息
     */
    async function fetchUserInfo(): Promise<IUser> {
        return (await userProfileService.GetUser({})) as unknown as IUser;
    }

    async function logout(redirect: boolean = true) {
        try {
            await authService.Logout({})
        } catch {
            // 不做任何处理
        } finally {
            accessStore.clearTokens()
            accessStore.setLoginExpired(false)

            // 回登录页带上当前路由地址
            router.replace(redirect ? '/login?redirect=' + encodeURIComponent(window.location.pathname) : '/login');
        }
    }

    /**
     * 重新认证
     */
    async function reauthenticate() {
        console.warn('Access token or refresh token is invalid or expired. ')

        accessStore.setAccessToken(null)
        accessStore.setLoginExpired(true)
    }

    /**
     * 刷新访问令牌
     */
    async function refreshToken() {
        const resp = await authService.RefreshToken({
            grant_type: 'password',
            refresh_token: accessStore.access.refreshToken ? accessStore.access.refreshToken.value : '',
        })
        const newToken = resp.access_token || ''

        accessStore.setAccessToken({
            value: newToken,
            expiresAt: resp.expires_in && resp.expires_in != 0 ? Date.now() + resp.expires_in * 1000 : undefined,
        })

        return newToken
    }

    return {
        authentication,
        dispatch,
        login,
        logout,
        refreshToken,
        reauthenticate,
        fetchUserInfo,
    };
}
