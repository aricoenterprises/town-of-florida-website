import { PrependArrayInput } from '../components/PrependArrayInput.jsx'

export default {
  name: 'department',
  title: 'Town Department / Board',
  type: 'document',
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
    prepare({ title, subtitle }) {
      const labels = {
        elected: 'Elected Board',
        admin: 'Administration',
        safety: 'Public Safety',
        services: 'Services',
        inspectors: 'Inspectors & Permits',
      }
      return { title, subtitle: labels[subtitle] || subtitle }
    }
  },
  fields: [
    {
      name: 'title',
      title: 'Department / Board Name',
      type: 'string',
      description: 'e.g. Board of Selectmen  or  Town Clerk',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Meeting times, address, or phone shown under the department title. e.g. Meets every other Wednesday at 6:00pm · (413) 662-2448 ext. 0',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Elected Boards', value: 'elected' },
          { title: 'Administration', value: 'admin' },
          { title: 'Public Safety', value: 'safety' },
          { title: 'Services', value: 'services' },
          { title: 'Inspectors & Permits', value: 'inspectors' },
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Choose the icon that appears next to the department heading.',
      options: {
        list: [
          { title: '🏛️  Government (Selectmen)', value: 'government' },
          { title: '👤  Person (Administrator)', value: 'person' },
          { title: '🏫  School', value: 'school' },
          { title: '💼  Briefcase (Accountant)', value: 'briefcase' },
          { title: '🏠  Home (Assessors)', value: 'home' },
          { title: '❤️  Heart (Board of Health)', value: 'heart' },
          { title: '🔧  Wrench (Building/Inspectors)', value: 'tool' },
          { title: '👥  Users (Council on Aging)', value: 'users' },
          { title: '⚡  Zap (Electrical)', value: 'zap' },
          { title: '📚  Book (Library)', value: 'book' },
          { title: '🔥  Fire Department', value: 'fire' },
          { title: '🚛  Truck (Highway)', value: 'truck' },
          { title: '🛡️  Shield (Police)', value: 'shield' },
          { title: '📄  File (Town Clerk)', value: 'file' },
          { title: '💳  Credit Card (Tax Collector)', value: 'credit-card' },
          { title: '🗄️  Database (Treasurer)', value: 'database' },
          { title: '🏆  Award (Veterans)', value: 'award' },
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description: 'Used for direct-link URLs. Lowercase letters and hyphens only. e.g. selectmen, town-clerk, board-of-health',
      validation: Rule => Rule.required().regex(/^[a-z0-9-]+$/, { name: 'slug', invert: false })
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first on the page. e.g. 1, 2, 3 ...',
      validation: Rule => Rule.required().integer().min(1)
    },
    {
      name: 'officials',
      title: 'Officials / Staff',
      type: 'array',
      description: 'Click "Add item" above to add a new person at the top of the list.',
      components: { input: PrependArrayInput },
      of: [
        {
          type: 'object',
          name: 'official',
          title: 'Official / Staff Member',
          options: { collapsible: true, collapsed: false },
          preview: {
            select: { title: 'name', subtitle: 'role' },
            prepare({ title, subtitle }) {
              return { title: title || '(unnamed)', subtitle }
            }
          },
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'Full name or organization name',
              validation: Rule => Rule.required()
            },
            {
              name: 'role',
              title: 'Title / Role',
              type: 'string',
              description: 'e.g. Selectmen Chair, Town Clerk, Principal'
            },
            {
              name: 'phone',
              title: 'Phone',
              type: 'string',
              description: 'e.g. (413) 662-2448 ext. 0'
            },
            {
              name: 'email',
              title: 'Email Address',
              type: 'string',
              description: 'e.g. TownAdmin@TownOfFlorida.org'
            },
            {
              name: 'hours',
              title: 'Hours / Meeting Times',
              type: 'string',
              description: 'e.g. M, T, Th, F: 8:30am–4:00pm  or  Wednesday Evenings 6:00pm–7:30pm'
            },
            {
              name: 'address',
              title: 'Address',
              type: 'text',
              rows: 2,
              description: 'Street address. Use a new line for organization name + address if needed.'
            },
            {
              name: 'notes',
              title: 'Additional Notes',
              type: 'text',
              rows: 3,
              description: 'Extra info: permit fees, emergency notices, special instructions. Each line becomes its own line on the website.'
            },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              description: 'External or internal links to show at the bottom of this card.',
              of: [
                {
                  type: 'object',
                  name: 'cardLink',
                  title: 'Link',
                  fields: [
                    {
                      name: 'label',
                      title: 'Link Text',
                      type: 'string',
                      description: 'e.g. Online Bill Pay  or  View Announcements',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                      description: 'e.g. https://paymybills.link/floridama  or  /announcements.html',
                      validation: Rule => Rule.required()
                    },
                  ]
                }
              ]
            },
            {
              name: 'isHighlighted',
              title: 'Highlight Card',
              type: 'boolean',
              description: 'Gives this card a light background. Use for notices or special informational cards.',
              initialValue: false
            },
          ]
        }
      ]
    }
  ]
}
