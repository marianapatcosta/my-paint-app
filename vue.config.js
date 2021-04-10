module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_main.scss";`
      }
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'My Paint App';
      return args;
    });
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/my-paint-app/' : '/'
};
