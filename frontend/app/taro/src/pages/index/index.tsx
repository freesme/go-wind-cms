import {View, Text} from '@tarojs/components';
import {useLoad} from '@tarojs/taro';
import {useTranslation} from 'react-i18next';
import {Button, Input} from '@/components/ui';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {setLocale} from '@/store/core/language/slice';
import {setUser} from '@/store/core/user/slice';
import {useToast} from '@/hooks';
import './index.scss';

export default function Index() {
    const {t, i18n} = useTranslation();
    const dispatch = useAppDispatch();
    const locale = useAppSelector((state) => state.language.locale);
    const user = useAppSelector((state) => state.user);
    const {showToast} = useToast();

    useLoad(() => {
        console.log('Page loaded.');
    });

    const handleToggleLanguage = () => {
        const newLocale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
        dispatch(setLocale(newLocale));
        i18n.changeLanguage(newLocale);
    };

    const handleLoginDemo = () => {
        // 模拟登录
        dispatch(
            setUser({
                id: '1',
                username: 'demo_user',
                email: 'demo@example.com',
                avatar: '',
                roles: ['user'],
            }),
        );
        showToast(t('success'), 'success');
    };

    return (
        <View className='index'>
            <Text className='title'>Taro CMS</Text>

            <View className='section'>
                <Text className='label'>当前语言：{locale}</Text>
                <Button type='primary' onClick={handleToggleLanguage}>
                    {locale === 'zh-CN' ? 'Switch to English' : '切换到中文'}
                </Button>
            </View>

            <View className='section'>
                <Text className='label'>{t('loading')}</Text>
                <Button loading>{t('loading')}</Button>
            </View>

            <View className='section'>
                <Text className='label'>{user.username ? `欢迎，${user.username}` : '未登录'}</Text>
                <Button type='primary' onClick={handleLoginDemo} disabled={!!user.username}>
                    {user.username ? t('ok') : t('add')}
                </Button>
            </View>

            <View className='section'>
                <Text className='label'>Input 组件测试</Text>
                <Input placeholder={t('search')} />
            </View>

            <View className='section'>
                <Text className='label'>Button 组件测试</Text>
                <View className='button-group'>
                    <Button type='primary'>{t('confirm')}</Button>
                    <Button type='default'>{t('cancel')}</Button>
                    <Button type='danger'>{t('delete')}</Button>
                </View>
            </View>
        </View>
    );
}
