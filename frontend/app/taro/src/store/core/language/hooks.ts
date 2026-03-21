import {useSelector, useDispatch} from 'react-redux';

import type {AppDispatch, RootState} from '@/store';

import type {ILanguageState} from '../../types';
import {setLocale} from './slice';

export function useLanguageStore() {
    const dispatch = useDispatch<AppDispatch>();
    const language = useSelector<RootState, ILanguageState>((state) => state.language);

    return {
        language,
        dispatch,
        setLocale: (locale: string) => dispatch(setLocale(locale)),
    };
}

export function useLocale() {
    return useSelector<RootState, string>((state) => state.language.locale);
}
