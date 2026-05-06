export default {
  name: 'agenda',
  title: 'Meeting Agenda',
  type: 'document',
  orderings: [
    { title: 'Date, Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'title', subtitle: 'date' },
    prepare({ title, subtitle }) { return { title, subtitle } }
  },
  fields: [
    {
      name: 'date',
      title: 'Meeting Date',
      type: 'string',
      description: 'e.g. May 6, 2026',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Agenda Title',
      type: 'string',
      description: 'e.g. FSCC Board Agenda  or  Assessors Board Agenda',
      validation: Rule => Rule.required()
    },
    {
      name: 'file',
      title: 'Upload PDF',
      type: 'file',
      description: 'Upload the agenda PDF.',
      options: { accept: '.pdf' },
      validation: Rule => Rule.custom((value, context) => {
        if (!value && !context.document?.fileUrl) return 'Please upload a PDF.'
        return true
      })
    }
  ]
}
