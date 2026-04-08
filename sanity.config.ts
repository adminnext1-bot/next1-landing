import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// Load from .env — fill in SANITY_PROJECT_ID before running
const projectId = process.env.SANITY_PROJECT_ID ?? '';
const dataset   = process.env.SANITY_DATASET   ?? 'production';

export default defineConfig({
  name:    'next1-studio',
  title:   'NEXT 1 Blog Studio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
