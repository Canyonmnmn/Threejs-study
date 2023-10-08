// vite.config.js
export default {
  // 配置选项
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true,
  },
  build: {
    outDir: "../dist",
  },
};
