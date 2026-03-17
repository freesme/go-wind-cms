import {useSelector, useDispatch} from 'react-redux';

import type {IUserState, IUser} from '../../types';
import type {AppDispatch, RootState} from '@/store';
import {setUser, clearUser} from './slice';

export function useUserStore() {
 const dispatch = useDispatch<AppDispatch>();
 const userState = useSelector<RootState, IUserState>((state) => state.user);

 return {
 user: userState.user,
  dispatch,
 setUser: (user: IUser) => dispatch(setUser(user)),
 clearUser: () => dispatch(clearUser()),
 };
}

/**
 * 获取当前用户信息
 */
export function useUser() {
 return useSelector<RootState, IUser | null>((state) => state.user.user);
}
