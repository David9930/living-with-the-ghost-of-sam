import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://david9930.github.io',
  base: '/living-with-the-ghost-of-sam',
  integrations: [react()],
});
