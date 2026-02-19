import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {useCustomPublishAction} from './schemas/actions/customPublishAction'
import jobTemplate from './schemas/templates/jobTemplate'

export default defineConfig({
  name: 'default',
  title: 'XTintUSA Job Tracker',

  projectId: 'nafmjva4',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev, jobTemplate],
  },

  document: {
    actions: (prev, context) => {
      // For 'job' documents, replace the default publish action with our custom one
      if (context.schemaType === 'job') {
        return prev.map((originalAction) =>
          originalAction.action === 'publish'
            ? useCustomPublishAction
            : originalAction
        )
      }
      return prev
    },
  },
})

