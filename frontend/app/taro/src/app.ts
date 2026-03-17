import {PropsWithChildren, createElement} from 'react';
import {useLaunch} from '@tarojs/taro';
import {Provider} from 'react-redux';
import store from './store';
import './i18n';

import './app.scss';

function App({children}: PropsWithChildren) {
    useLaunch(() => {
        console.log('App launched.');
    });

    return createElement(
        Provider,
        {store},
        children
    );
}

export default App;
