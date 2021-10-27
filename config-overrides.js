const { useBabelRc, override, fixBabelImports, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  useBabelRc(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackModuleRule({
    test: /\.(styl|stylus)$/,
    exclude: /(node_modules)/,
    loaders: [
      'style-loader',
      'css-loader',
      {
        loader: 'stylus-loader',
        options: {
          stylusOptions: {
            import: [path.resolve(__dirname, './src/assets/stylus/lib/mixin.styl')],
          },
        },
      },
    ],
  }),
  addWebpackModuleRule({
    test: /\.svg$/,
    include: [path.resolve(__dirname, './src/assets/icons')],
    use: [
      { loader: 'svg-sprite-loader', options: {} },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [
            {
              name: 'removeAttrs',
              params: { attrs: 'fill' },
            },
          ],
        },
      },
    ],
  })
);
