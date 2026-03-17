import {useSelector, useDispatch} from 'react-redux';

import type {IAccessState, TokenPayload} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {
    setAccessToken,
    setRefreshToken,
    setTokens,
    setPermissions,
    addPermission,
    removePermission,
    setIsAccessChecked,
    setLoginExpired,
    clearTokens,
    resetAccess,
    restoreAccess,
} from './slice';

export function useAccessStore() {
    const dispatch = useDispatch<AppDispatch>();
    const access = useSelector<RootState, IAccessState>((state) => state.access);

    return {
        access,
        dispatch,
        setAccessToken: (payload: TokenPayload | null) => dispatch(setAccessToken(payload)),
        setRefreshToken: (payload: TokenPayload | null) => dispatch(setRefreshToken(payload)),
        setTokens: (payload: {
            accessToken: TokenPayload | null;
            refreshToken: TokenPayload | null
        }) => dispatch(setTokens(payload)),
        setPermissions: (permissions: string[]) => dispatch(setPermissions(permissions)),
        addPermission: (permission: string) => dispatch(addPermission(permission)),
        removePermission: (permission: string) => dispatch(removePermission(permission)),
        setIsAccessChecked: (isAccessChecked: boolean) => dispatch(setIsAccessChecked(isAccessChecked)),
        setLoginExpired: (loginExpired: boolean) => dispatch(setLoginExpired(loginExpired)),
        clearTokens: () => dispatch(clearTokens()),
        resetAccess: () => dispatch(resetAccess()),
        restoreAccess: (payload: Partial<IAccessState>) => dispatch(restoreAccess(payload)),
    };
}

/**
 * 判断是否已登录（计算属性）
 */
export function useIsLogin() {
    return useSelector<RootState, boolean>((state) => {
        const {accessToken, loginExpired} = state.access;

        // 有 accessToken 且未过期 = 已登录
        if (!accessToken || loginExpired) {
            return false;
        }

        // 检查是否过期
        if (accessToken.expiresAt && accessToken.expiresAt < Date.now()) {
            return false;
        }

        return true;
    });
}

/**
 * 获取访问令牌
 */
export function useAccessToken() {
    return useSelector<RootState, TokenPayload | null>((state) => state.access.accessToken);
}

/**
 * 获取刷新令牌
 */
export function useRefreshToken() {
    return useSelector<RootState, TokenPayload | null>((state) => state.access.refreshToken);
}

/**
 * 获取权限列表
 */
export function usePermissions() {
    return useSelector<RootState, string[]>((state) => state.access.permissions);
}
