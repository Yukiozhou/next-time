import { defineConfig } from '@tarojs/cli'

export default defineConfig({
  projectName: 'next-time',
  date: '2026-09-20',
  designWidth: 390,
  deviceRatio: { 390: 2 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  plugins: ['@tarojs/plugin-framework-react', '@tarojs/plugin-platform-h5', '@tarojs/plugin-platform-weapp'],
  cache: { enable: true },
  mini: {},
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: { filename: 'js/[name].[contenthash:8].js', chunkFilename: 'js/[name].[contenthash:8].js' },
    devServer: { port: 10086, host: '0.0.0.0' }
  }
})
