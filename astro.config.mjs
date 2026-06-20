// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// ARA marketing site — static, bilingual (en default at /, ar at /ar with full RTL).
// No adapter / no server: ships as static HTML for Netlify git-connected deploy.
export default defineConfig({
  site: 'https://arasolutions.io',
  output: 'static',
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    // Cast avoids a cosmetic Vite/Tailwind plugin type-skew; the build is fine.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
