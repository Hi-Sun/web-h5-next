const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const nextBuildId = require('next-build-id');
const withPlugins = require('next-compose-plugins');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const withLess = require('next-with-less');

// 环境变量
const env = process.env.TYC_ENV;
// 生产环境
const isProd = env === 'production' && process.env.NODE_ENV === 'production';
// 开发环境
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
// 开发环境
const keepConsole = isDev || process.env.KEEP_CONSOLE === 'true';

const nextConfig = {
  // 自定义输出目录
  distDir: 'build',
  // 禁止请求 header 中添加 x-power-by 请求头
  poweredByHeader: false,
  // 自定义页面扩展名
  pageExtensions: ['page.ts', 'page.tsx'],
  // react 严格模式
  reactStrictMode: true,
  // for browser get process.env.TYC_ENV
  env: { TYC_ENV: env }, 
  // 忽略 Eslint 校验
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 忽略 TS 报错
  typescript: {
    ignoreBuildErrors: true,
  },
  // 编译时移除 console
  compiler: {
    removeConsole: isProd,
  },
  // 配置构建 ID 格式 (gitID前八位+发布时间数字戳+发布环境)
  generateBuildId: async () => {
    const t = new Date();
    const preZero = (num) => (num < 10 ? '0' : '') + num;
    const DHMS = [
      preZero(t.getDate()),
      preZero(t.getHours()),
      preZero(t.getMinutes()),
      preZero(t.getSeconds()),
    ].join('');
    const gitId = await nextBuildId({ dir: __dirname });
    return `${gitId.slice(0, 8)}-${DHMS}-${env.slice(0, 4)}`;
  },
  // 自定义 webpack 配置
  webpack: (config, { dev, buildId, isServer, webpack }) => {
     // 扩展名
     config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];
     // 主文件
     config.resolve.mainFiles = ['index'];
     // 禁用符号链接解析
     config.resolve.symlinks = false;
     if (!dev) {
       config.optimization = {
         minimize: true,
         minimizer: [
           new TerserPlugin({
             parallel: true,
             terserOptions: {
               ecma: 6,
               warnings: false,
               output: {
                 comments: false,
               },
               compress: {
                 drop_console: !keepConsole,
               },
             },
           }),
           new CssMinimizerPlugin({
             parallel: true,
             minify: [CssMinimizerPlugin.cssnanoMinify, CssMinimizerPlugin.cleanCssMinify],
           }),
         ],
       };
     }

    // 配置 Css Modules 导出为 驼峰 规则命名
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));
    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (moduleLoader?.loader === 'less-loader') {
          moduleLoader.options = {
            ...moduleLoader.options,
          };
        }
        if (moduleLoader.options?.modules) {
          const { modules } = moduleLoader.options;
          delete modules.exportLocalsConvention;
          moduleLoader.options.modules = {
            ...modules,
            exportLocalsConvention: 'camelCase',
          };
        }
      });
    });
    return config;
  },
}

const plugins = [
  [withLess],
  [ ['!', PHASE_DEVELOPMENT_SERVER]],
];

module.exports = withPlugins(plugins, nextConfig);
