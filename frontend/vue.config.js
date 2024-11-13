// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  
  devServer: {
    // Remove or disable COEP
    'Cross-Origin-Embedder-Policy': '',
    'Cross-Origin-Opener-Policy': '',
  },
}