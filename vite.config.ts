/**
 * @file vite 配置
 * @author Yangholmes 2024-08-20
 */

import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import basicSsl from '@vitejs/plugin-basic-ssl';

import MsClarity from "vite-plugin-ms-clarity";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '' : '/app/pick-gua',
    server: {
      host: '0.0.0.0',
      // https: true
    },
    plugins: [
      vue(), vueJsx(),
      // basicSsl(),
      MsClarity({
        id: '',
        enableInDevMode: false,
        injectTo: 'body'
      })
    ],
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      ]
    },
    css: {
      preprocessorOptions: {
        less: {}
      }
    }
  };
});

