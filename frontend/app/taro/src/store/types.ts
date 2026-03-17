import {
    type commentservicev1_Comment,
    type contentservicev1_Category,
    type contentservicev1_Page,
    type contentservicev1_Post,
    type contentservicev1_Tag,
    type identityservicev1_User,
    type siteservicev1_Navigation,
    type storageservicev1_DownloadFileResponse, type storageservicev1_UploadFileResponse
} from "@/api/generated/app/service/v1";

export interface IRootState {
    access: IAccessState;
    language: ILanguageState;
    theme: IThemeState;
    user: IUserState;
    loading: ILoadingState;
    authentication: IAuthenticationState;
    category: ICategoryState;
    comment: ICommentState;
    fileTransfer: IFileTransferState;
    navigation: INavigationState;
    page: IPageState;
    post: IPostState;
    tag: ITagState;
    userProfile: IUserProfileState;
}

/**
 * 令牌载荷
 */
export interface TokenPayload {
    /**
     * 令牌值
     */
    value: string;
    /**
     * 令牌过期时间
     */
    expiresAt?: number;
}

export interface IAccessState {
    /**
     * 权限码
     */
    permissions: string[]

    /**
     * 登录 accessToken
     */
    accessToken: TokenPayload | null
    /**
     * 登录 accessToken
     */
    refreshToken: TokenPayload | null

    /**
     * 是否已经检查过权限
     */
    isAccessChecked: boolean
    /**
     * 登录是否过期
     */
    loginExpired: boolean
}

export interface ILanguageState {
    locale: string;
}

/**
 * 主题模式
 * - dark: 暗色模式
 * - light: 亮色模式
 * - system: 跟随系统
 */
export type ThemeMode = 'dark' | 'light' | 'system';

export interface IThemeState {
    mode: ThemeMode;
}

/**
 * 用户信息
 */
export interface IUser {
    /**
     * 用户 id
     */
    id: number;

    /**
     * 用户名
     */
    username: string;

    /**
     * 用户昵称
     */
    nickname: string;

    /**
     * 用户实名
     */
    realname: string;

    /**
     * 头像
     */
    avatar: string;

    /**
     * 用户角色
     */
    roles?: string[];

    homePage: string;
}

export interface IUserState {
    user: IUser | null;
}

export interface IAuthenticationState {
    loginLoading: boolean;
    loading: boolean;
    error: string | null;
}

export interface ICategoryState {
    list: contentservicev1_Category[];
    detail: contentservicev1_Category | null;
    loading: boolean;
    total: number;
}

export interface ICommentState {
    list: commentservicev1_Comment[];
    detail: commentservicev1_Comment | null;
    loading: boolean;
    total: number;
}

export interface IFileTransferState {
    list: storageservicev1_UploadFileResponse[];
    detail: storageservicev1_DownloadFileResponse | null;
    loading: boolean;
    total: number;
}

export interface INavigationState {
    list: siteservicev1_Navigation[];
    detail: siteservicev1_Navigation | null;
    loading: boolean;
    total: number;
}

export interface IPageState {
    list: contentservicev1_Page[];
    detail: contentservicev1_Page | null;
    loading: boolean;
    total: number;
}

export interface IPostState {
    list: contentservicev1_Post[];
    detail: contentservicev1_Post | null;
    loading: boolean;
    total: number;
}

export interface ITagState {
    list: contentservicev1_Tag[];
    detail: contentservicev1_Tag | null;
    loading: boolean;
    total: number;
}

export interface IUserProfileState {
    detail: identityservicev1_User | null;
    loading: boolean;
}

export interface ILoadingState {
    isLoading: boolean;
    error: boolean | null;
}

export type RootState = IRootState;
export type AppDispatch = (...args: any[]) => any;
