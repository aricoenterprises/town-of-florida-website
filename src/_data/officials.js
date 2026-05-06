const client = require('./sanityClient')

// ---------------------------------------------------------------------------
// Fallback data — used when Sanity has no department documents yet.
// Once departments are added in Sanity Studio, these are automatically replaced.
// ---------------------------------------------------------------------------

const FALLBACK_DEPARTMENTS = [
  {
    anchorId: 'selectmen',
    category: 'elected',
    icon: 'government',
    title: 'Board of Selectmen',
    subtitle: 'Meets every other Wednesday at 6:00pm · (413) 662-2448 ext. 0 · TownAdmin@TownOfFlorida.org',
    order: 1,
    officials: [
      {
        name: 'Neil Oleson',
        role: 'Selectmen Chair',
        phone: '(413) 662-2448 ext. 0',
        email: 'townadmin@townofflorida.org',
        notes: 'Select Board meets every other Wednesday at 6:00pm',
      },
      { name: 'Michael Bedini', role: 'Selectmen' },
      { name: 'Timothy Zelazo', role: 'Selectmen' },
      {
        name: 'Current or Emergency Town Notice',
        isHighlighted: true,
        notes: 'For current emergency notices, please contact Town Hall at (413) 662-2448 or check the Announcements page.',
        links: [{ label: 'View Announcements', url: '/announcements.html' }],
      },
    ],
  },
  {
    anchorId: 'town-admin',
    category: 'admin',
    icon: 'person',
    title: 'Town Administrator',
    subtitle: 'M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm',
    order: 2,
    officials: [
      {
        name: 'Joan Lewis',
        role: 'Town Administrator',
        phone: '413-662-2448 ext. 0',
        email: 'TownAdmin@TownOfFlorida.org',
        hours: 'M, T, Th, F: 8:30am–4:00pm · Wednesday: 12:00pm–7:30pm',
      },
    ],
  },
  {
    anchorId: 'school',
    category: 'services',
    icon: 'school',
    title: 'Abbott Memorial School',
    subtitle: '56 North County Road, Florida MA 01247',
    order: 3,
    officials: [
      {
        name: 'Griffin Labbance',
        role: 'Principal',
        phone: '(413) 664-6023',
        email: 'glabbance@abbottmemorial.org',
        address: '56 North County Road, Florida MA 01247',
      },
      {
        name: 'John Franzoni',
        role: 'Superintendent',
        phone: '(413) 664-9292',
        email: 'jfranzoni@nbsunion.com',
        address: 'Northern Berkshire School Union\n26 Union Street, Suite 1A, North Adams MA 01247',
      },
    ],
  },
  {
    anchorId: 'accountant',
    category: 'admin',
    icon: 'briefcase',
    title: 'Town Accountant',
    order: 4,
    officials: [
      {
        name: 'Rebecca Choquette',
        role: 'Town Accountant',
        phone: '413-662-2448 ext. 1',
        email: 'Accountant@TownOfFlorida.org',
      },
    ],
  },
  {
    anchorId: 'assessors',
    category: 'elected',
    icon: 'home',
    title: 'Board of Assessors',
    subtitle: 'Meets every other Monday Evening at 6:00pm · (413) 662-2448 ext. 2 · Assessors@TownOfFlorida.org',
    order: 5,
    officials: [
      {
        name: 'Krista Bishop',
        role: 'Board of Assessor & Clerk',
        phone: '(413) 662-2448 ext. 2',
        email: 'Assessors@TownOfFlorida.org',
        notes: 'Board meets every other Monday Evening at 6:00pm',
      },
      { name: 'Lawrence Cote', role: 'Board of Assessor' },
      { name: 'Susan Bedini', role: 'Board of Assessors' },
    ],
  },
  {
    anchorId: 'health',
    category: 'elected',
    icon: 'heart',
    title: 'Board of Health',
    subtitle: 'Meets 4th Tuesday of the month at 3:30pm · (413) 662-2448 ext. 0',
    order: 6,
    officials: [
      {
        name: 'Alfred Bedini, Sr.',
        role: 'Board of Health Chair',
        phone: '(413) 662-2448 extension 0',
        notes: 'Meets 4th Tuesday of the month at 3:30pm',
      },
      { name: 'Neil Oleson', role: 'Board of Health' },
      { name: 'Heidi Dugal', role: 'Board of Health' },
    ],
  },
  {
    anchorId: 'building',
    category: 'inspectors',
    icon: 'tool',
    title: 'Building Inspector & Zoning Board Inspector',
    order: 7,
    officials: [
      {
        name: 'Brenda Jean Church',
        role: 'Building and Zoning Board Inspector',
        phone: '413-548-6633',
        email: 'bchurch123@gmail.com',
        notes: 'Leave a message with your contact information and phone number.\n\nPermit fee: $10.00 per $1,000.00 of total project cost, with a minimum of $80.00.\nMake checks payable to: Town of Florida',
      },
    ],
  },
  {
    anchorId: 'coa',
    category: 'services',
    icon: 'users',
    title: 'Council on Aging — Senior Center',
    subtitle: 'Wed, Thurs, Friday 9:00am–3:00pm · (413) 662-2448 ext. 4 · CouncilOnAging@TownOfFlorida.org',
    order: 8,
    officials: [
      {
        name: 'Sue Oleson',
        role: 'Senior Center Director',
        phone: '(413) 662-2448 ext. 4',
        email: 'CouncilOnAging@TownOfFlorida.org',
        hours: 'Wed, Thurs, Friday 9:00am–3:00pm',
      },
      { name: 'Joyce Van Tilborg', role: 'Assistant Director' },
    ],
  },
  {
    anchorId: 'electrical',
    category: 'inspectors',
    icon: 'zap',
    title: 'Electrical Wiring Inspector',
    subtitle: 'Permit: Residential $55.00 · Commercial $105.00',
    order: 9,
    officials: [
      {
        name: 'Timothy Keating',
        role: 'Electrical Wiring Inspector',
        phone: '(413) 663-1659',
        notes: 'Permit — Residential: $55.00 · Commercial: $105.00',
      },
      {
        name: 'Nickolas C. Keating',
        role: 'Assistant Electrical Wiring Inspector',
        phone: '413-281-7672',
        notes: 'Permit — Residential: $55.00 · Commercial: $105.00',
      },
    ],
  },
  {
    anchorId: 'library',
    category: 'services',
    icon: 'book',
    title: 'Florida Free Library',
    subtitle: '56 North County Road, Florida MA 01247 · (413) 664-0153',
    order: 10,
    officials: [
      {
        name: 'Heidi Dugal',
        role: 'Director',
        phone: '(413) 664-0153',
        email: 'Director@FloridaFreeLibrary.com',
        address: '56 North County Road, Florida MA 01247',
      },
    ],
  },
  {
    anchorId: 'fire',
    category: 'safety',
    icon: 'fire',
    title: 'Florida Volunteer Fire Department',
    subtitle: '139 Mohawk Trail, Florida MA 01247 · Burn Permits: Tuesday Nights 6pm–9pm',
    order: 11,
    officials: [
      {
        name: 'Michael Gleason',
        role: 'Chief',
        phone: '(413) 662-2448 ext. 6',
        email: 'MikeFVFD@gmail.com',
        address: '139 Mohawk Trail, Florida MA 01247',
        notes: 'BURN PERMITS available Tuesday Nights 6pm–9pm',
      },
    ],
  },
  {
    anchorId: 'highway',
    category: 'services',
    icon: 'truck',
    title: 'Highway Department',
    subtitle: 'Hours: 7:00am–3:30pm · (413) 662-2448 ext. 5 · Cell: 413-664-1691',
    order: 12,
    officials: [
      {
        name: 'James White',
        role: 'Highway Supervisor',
        phone: '(413) 662-2448 ext. 5',
        email: 'Highway@TownOfFlorida.org',
        hours: '7:00am–3:30pm',
        notes: 'Cell: 413-664-1691',
      },
      { name: 'Michael Gleason', role: 'Highway' },
      { name: 'Michael Worth', role: 'Highway' },
      { name: 'Christopher Sahady', role: 'Highway' },
    ],
  },
  {
    anchorId: 'police',
    category: 'safety',
    icon: 'shield',
    title: 'Police Department',
    subtitle: 'For emergencies, always dial 911',
    order: 13,
    officials: [
      {
        name: 'Massachusetts State Police — Cheshire Barracks',
        role: 'Police Department',
        phone: '413-743-4700',
        notes: 'For Emergencies: DIAL 911\n\nNon-Emergencies and Police Reporting:\nCall Cheshire Barracks Mass State Police',
      },
    ],
  },
  {
    anchorId: 'town-clerk',
    category: 'admin',
    icon: 'file',
    title: 'Town Clerk',
    subtitle: 'Wednesday Evenings 6:00pm–7:30pm · (413) 662-2448 ext. 3',
    order: 14,
    officials: [
      {
        name: 'Lisa H. Brown',
        role: 'Town Clerk',
        phone: '(413) 662-2448 ext. 3',
        email: 'Clerk@TownOfFlorida.org',
        hours: 'Wednesday Evenings 6:00pm–7:30pm',
      },
    ],
  },
  {
    anchorId: 'tax-collector',
    category: 'admin',
    icon: 'credit-card',
    title: 'Tax Collector',
    subtitle: 'First and Third Wednesday of the month, 4:30pm–6:00pm',
    order: 15,
    officials: [
      {
        name: 'Stephanie Pare',
        role: 'Tax Collector',
        phone: '(413) 464-1449',
        email: 'TaxCollector@TownOfFlorida.org',
        hours: 'Office Hours: First and Third Wednesday, 4:30pm–6:00pm',
        links: [
          { label: 'Online Payments: paymybills.link/floridama', url: 'https://paymybills.link/floridama' },
          { label: 'Deputy Tax Collection: www.kelleyryan.com', url: 'https://www.kelleyryan.com' },
        ],
      },
    ],
  },
  {
    anchorId: 'treasurer',
    category: 'admin',
    icon: 'database',
    title: 'Treasurer',
    subtitle: 'Office Hours: Wednesday evenings 5:30pm–7:30pm',
    order: 16,
    officials: [
      {
        name: 'Stacy Abuisi',
        role: 'Treasurer',
        phone: '413-662-2448 ext. 1',
        email: 'Treasurer@TownOfFlorida.org',
        hours: 'Wednesday evenings 5:30pm–7:30pm',
      },
    ],
  },
  {
    anchorId: 'veterans',
    category: 'services',
    icon: 'award',
    title: "Veterans' Services Officer",
    subtitle: 'District Director of Northern Berkshire County',
    order: 17,
    officials: [
      {
        name: 'Kurtis Durocher',
        role: "Veterans' Services Officer / District Director of Northern Berkshire County",
        phone: 'Office: (413) 662-3040',
        email: 'kdurocher@northadams-ma.gov',
        address: "City of North Adams Veterans' Office\n10 Main St, Room 101, North Adams, MA 01247",
        notes: 'Cell: (413) 672-5163',
      },
    ],
  },
]

// ---------------------------------------------------------------------------

module.exports = async function () {
  try {
    const departments = await client.fetch(`
      *[_type == "department"] | order(order asc) {
        anchorId,
        category,
        icon,
        title,
        subtitle,
        order,
        "officials": officials[] {
          name,
          role,
          phone,
          email,
          hours,
          address,
          notes,
          isHighlighted,
          "links": links[] { label, url }
        }
      }
    `)

    if (departments && departments.length > 0) {
      return { departments }
    }
  } catch (err) {
    console.warn('[Sanity] officials.js fetch failed:', err.message)
  }

  // Hard fallback — uses all hardcoded department data above
  return { departments: FALLBACK_DEPARTMENTS }
}
