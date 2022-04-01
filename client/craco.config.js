module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        type: 'asset/source',
        generator: {
          filename: 'assets/images/[hash][ext]'
        }
      });
      return webpackConfig;
    }
  }
}