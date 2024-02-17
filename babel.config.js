const getPresetOptions = (isTest = false, isProduction = false) => {
  if (isTest) return { targets: { node: 'current' } } // for speed

  return {
    // undefined means parse .browserlistrc by default
    targets: !isProduction ? 'last 2 versions' : undefined
  }
}

const getBabelConfig = (api) => {
  const isDev = api.env('development')
  const isTest = api.env('test')
  const isProduction = api.env('production')

  api.cache.using(() => isDev || isTest)

  const presets = [['@babel/preset-env', getPresetOptions(isTest, isProduction)]]

  const plugins = [
    // Polyfills the runtime needed for async/await, generators, and friends
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime
    !isTest && [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        regenerator: true
      }
    ]
  ].filter(Boolean)

  return {
    presets: presets,
    plugins: plugins,
    compact: isProduction
  }
}

module.exports = getBabelConfig
