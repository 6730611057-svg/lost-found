import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => ({
  boot: [],
  css: ['app.scss'],
  extras: ['roboto-font', 'material-icons'],
  build: {
    target: { browser: ['es2022', 'firefox115', 'chrome115', 'safari14'], node: 'node20' },
    vueRouterMode: 'hash' // deploy ได้ทุกที่ ไม่ต้องตั้งค่า rewrite
  },
  devServer: { open: true },
  framework: {
    config: {},
    plugins: ['Notify', 'Dialog']
  },
  animations: []
}))
