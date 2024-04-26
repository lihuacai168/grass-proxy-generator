const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/zh/personal/api/v1': {
        target: 'https://proxy-seller.com',
        changeOrigin: true,
      },
    },
  },
})
