module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false, // 默认auto，将此设置为 false 将保留 ES 模块。仅当你打算将原生 ES 模块发送到浏览器时才使用此选项
        targets: {
          // 份额大于0.25%，最新的两个版本，ie>=8 , 排除废弃版本, (83.8%)
          browsers: ['>0.25%', 'last 2 versions', 'ie >= 8', 'not dead']
        },
        useBuiltIns: 'usage', // 按需引入必要的 polyfill 来兼容目标浏览器。
        corejs: 3 // babel只转换语法，而数组的includes方法是属于ES6新增的API，所以需要corejs转换
      }
    ]
  ],
  plugins: []
}
