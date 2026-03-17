export default defineAppConfig({
  pages: [
    'pages/index',
    'pages/login/index',
    'pages/register/index',
    'pages/category/index',
    'pages/category/detail/index',
    'pages/post/index',
    'pages/post/detail/index',
    'pages/tag/index',
    'pages/tag/detail/index',
    'pages/about/index',
    'pages/contact/index',
    'pages/disclaimer/index',
    'pages/privacy/index',
    'pages/settings/index',
    'pages/user/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro CMS',
    navigationBarTextStyle: 'black'
  }
})
