const { useBabelRc, addBabelPlugin, override, fixBabelImports } = require('customize-cra');

module.exports = override(
  useBabelRc(),
  addBabelPlugin(['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  })
);
