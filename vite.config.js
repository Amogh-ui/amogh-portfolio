import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        paalan: resolve(__dirname, 'paalan.html'),
        screencalorie: resolve(__dirname, 'screencalorie.html'),
        beyondthenet: resolve(__dirname, 'beyondthenet.html'),
        trox: resolve(__dirname, 'trox.html'),
        popclozet: resolve(__dirname, 'popclozet.html'),
        ticketsure: resolve(__dirname, 'ticketsure.html'),
        procreate: resolve(__dirname, 'procreate.html'),
        oneflow: resolve(__dirname, 'oneflow.html'),
      }
    }
  }
})
