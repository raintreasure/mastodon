const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { env } = require('../configuration');

module.exports = {
  test: /\.s?css$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sourceMap: true,
        additionalData: '$classic-highlight-color: ' + env.REACT_APP_THEME_BACKGROUND_COLOR + ';' +
          '$highlight-primary-text-color: ' + env.REACT_APP_THEME_TEXT_COLOR + ';',
      },
    },
  ],
};
