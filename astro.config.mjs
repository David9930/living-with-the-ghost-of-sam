import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// In astro.config.mjs
export default defineConfig({
  site: 'https://lwtgos.com',
  // Remove the "base" property if it exists
  // Or set it to "/"
});
