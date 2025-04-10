import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://lwtgos.com',
  base: '/', // Ensure this is just '/'
  integrations: [react()],
});
