
module.exports = {
  // 关闭语法检查
  lintOnSave: false,
  devServer: {
    // vue项目启动时的ip地址和端口
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      // 匹配所有以 /api 开头的url
      "/api": {
        // 请求的目标主机
        target: "http://123.57.180.25:9000",
        changeOrigin: true,
        ws: true,
        //这样重写会把,路径中 /api 消去
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
}