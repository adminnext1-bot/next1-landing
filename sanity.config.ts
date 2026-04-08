import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = '71o95mt5';
const dataset   = 'production';

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
