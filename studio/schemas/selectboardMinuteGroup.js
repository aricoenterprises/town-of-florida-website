import { PrependArrayInput } from '../components/PrependArrayInput.jsx'

export default {
  name: 'selectboardMinuteGroup',
  title: 'Selectboard Minutes (by FY)',
  type: 'document',
  orderings: [
    { title: 'Fiscal Year, Newest', name: 'fyDesc', by: [{ field: 'fy', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'title', subtitle: 'fy' },
    prepare({ title, subtitle }) {
      return { title: title || `FY ${subtitle}`, subtitle: `${subtitle}` }
    }
  },
  fields: [
    {
      name: 'fy',
      title: 'Fiscal Year',
      type: 'number',
      description: 'e.g. 2026 for FY 2026 (July 2025 – June 2026)',
      validation: Rule => Rule.required().integer().min(2000).max(2100)
    },
    {
      name: 'title',
      title: 'Label',
      type: 'string',
      description: 'e.g. FY 2026 — Selectboard Minutes',
      validation: Rule => Rule.required()
    },
    {
      name: 'openByDefault',
      title: 'Open by default on the website?',
      type: 'boolean',
      description: 'Turn on for the current fiscal year only. All others should be off.',
      initialValue: false
    },
    {
      name: 'documents',
      title: 'Meeting Documents',
      type: 'array',
      description: 'Click "Add item" above to add a new meeting at the top.',
      components: { input: PrependArrayInput },
      of: [
        {
          type: 'object',
          name: 'meetingDoc',
          title: 'Meeting Document',
          // Expand inline in the list — no popup dialog
          options: { collapsible: true, collapsed: false },
          preview: {
            select: { title: 'meetingName', subtitle: 'fileType' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle?.toUpperCase() }
            }
          },
          fields: [
            {
              name: 'meetingName',
              title: 'Meeting Date / Name',
              type: 'string',
              description: 'e.g. April 8, 2026  or  March 25, 2026 — Finance Joint',
              validation: Rule => Rule.required()
            },
            {
              name: 'fileType',
              title: 'File Type',
              type: 'string',
              options: {
                list: [
                  { title: 'PDF', value: 'pdf' },
                  { title: 'Word Document (.docx)', value: 'docx' }
                ],
                layout: 'radio'
              },
              initialValue: 'docx',
              validation: Rule => Rule.required()
            },
            {
              name: 'file',
              title: 'Upload Document',
              type: 'file',
              description: 'Upload the PDF or Word document.',
              options: { accept: '.pdf,.docx' },
              validation: Rule => Rule.custom((value, context) => {
                if (!value && !context.parent?.fileUrl) return 'Please upload a document.'
                return true
              })
            }
          ]
        }
      ]
    }
  ]
}
