module.exports = {
  webpack: function (config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert")
    };
    
    // Suppress critical dependency warning from react-datepicker
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/react-datepicker/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: []
        }
      }
    });
    
    // Ignore the critical dependency warning
    config.ignoreWarnings = [
      function (warning) {
        return (
          warning.message &&
          warning.message.includes('Critical dependency: the request of a dependency is an expression')
        );
      }
    ];
    
    return config;
  }
};
