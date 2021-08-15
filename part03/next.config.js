const isProd = process.env.NODE_ENV == 'production';
const url = isProd ? '/threejs-glitch/part03/out' : '/';

module.exports = {
  basePath: url,
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