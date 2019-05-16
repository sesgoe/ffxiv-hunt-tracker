module.exports = {
  pwa: {
    name: 'FFXIV Hunt Tracker'
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5000/',
        changeOrigin: true
      }
    }
  }
}
