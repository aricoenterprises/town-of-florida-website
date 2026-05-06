export default {
  name: 'annualReport',
  title: 'Annual Town Report',
  type: 'document',
  preview: {
    select: { title: 'title', subtitle: 'year' },
    prepare({ title, subtitle }) { return { title, subtitle } }
  },
  fields: [
    {
      name: 'year',
      title: 'Fiscal Year Label',
      type: 'string',
      description: 'e.g. FY 2022',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Report Title',
      type: 'string',
      description: 'e.g. Annual Town Report — FY22',
      validation: Rule => Rule.required()
    },
    {
      name: 'file',
      title: 'Upload PDF',
      type: 'file',
      description: 'Upload the annual report PDF.',
      options: { accept: '.pdf' },
      validation: Rule => Rule.custom((value, context) => {
        if (!value && !context.document?.fileUrl) return 'Please upload a PDF.'
        return true
      })
    }
  ]
}
