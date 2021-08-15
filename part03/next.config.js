const isProd = process.env.NODE_ENV == 'production';

module.exports = {
  basePath: isProd ? '/threejs-glitch/part03/out' : '',
  assetPrefix:  isProd ? 'https://yuki-sakaguchi.github.io/threejs-glitch/part03/out' : '',
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'raw-loader'
      }
    );
    return config
  },
}