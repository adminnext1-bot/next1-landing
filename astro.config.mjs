import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://next1hub.com',
  integrations: [tailwind()],
});
