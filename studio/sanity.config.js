import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index'

export default defineConfig({
  name: 'town-of-florida',
  title: 'Town of Florida',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'hs5p5cc4',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Selectboard Minutes')
              .child(S.documentTypeList('selectboardMinuteGroup').title('Selectboard Minutes')),
            S.listItem()
              .title('Annual Town Reports')
              .child(S.documentTypeList('annualReport').title('Annual Town Reports')),
            S.listItem()
              .title('Town Meeting Warrants')
              .child(S.documentTypeList('warrant').title('Town Meeting Warrants')),
            S.listItem()
              .title('Meetings & Agendas')
              .child(S.documentTypeList('agenda').title('Meetings & Agendas')),
            S.divider(),
            S.listItem()
              .title('Announcements')
              .child(S.documentTypeList('announcement').title('Announcements')),
            S.listItem()
              .title('Forms & Documents')
              .child(S.documentTypeList('form').title('Forms & Documents')),
            S.divider(),
            S.listItem()
              .title('Town Departments & Officials')
              .child(S.documentTypeList('department').title('Town Departments & Officials').defaultOrdering([{ field: 'order', direction: 'asc' }])),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
