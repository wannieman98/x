import { defineConfig } from 'vite';
import autoprefixer = require('autoprefixer');
import tailwindcss = require('tailwindcss');
import tailwindConfig from './tailwind.config';

export default defineConfig(() => {
  return {
    css: {
      postcss: {
        plugins: [tailwindcss(tailwindConfig), autoprefixer()]
      }
    }
  };
});
