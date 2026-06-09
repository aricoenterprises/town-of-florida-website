const client = require('./sanityClient')

// How many auto-generated items to surface per document type
const AUTO_LIMIT = 3

// Section metadata — same order and descriptions as the original JSON
const SECTION_META = [
  {
    id: 'latest-news',
    title: 'Latest News & Events',
    description: 'Current notices, programs, and updates from the Town of Florida.',
  },
  {
    id: 'legal-notices',
    title: 'Legal & Voter Notices',
    description: 'Official legal notices and voter information from the Town of Florida.',
  },
  {
    id: 'senior-center',
    title: 'Senior Community Center',
    description: 'Programs and events at the Florida Senior Community Center. Wed, Thurs, Friday 9am–3pm · (413) 662-2448 ext. 4',
  },
  {
    id: 'library',
    title: 'Florida Free Library',
    description: 'News and events from the Florida Free Library. 56 North County Road · (413) 664-0153',
  },
  {
    id: 'fire-dept',
    title: 'Fire Department',
    description: 'Notices and information from the Florida Volunteer Fire Department. Burn permits: Tuesday nights 6–9pm.',
  },
  {
    id: 'transfer-station',
    title: 'Transfer Station',
    description: 'Updates and information from the Florida Transfer Station.',
  },
  {
    id: 'community',
    title: 'Community Programs',
    description: 'Community events and programs for Florida residents.',
  },
  {
    id: 'town-hall',
    title: 'Town Hall Hours',
    description: 'Current Town Hall office hours and contact information.',
  },
]

// Per-section fallback items — used when Sanity has no items for a given section
const FALLBACK_ITEMS = {
  'latest-news': [
    { title: 'General Bylaws Changes',                      url: 'https://files.cdn-files-a.com/uploads/2365528/normal_683603de1e1bb.pdf',  type: 'pdf'  },
    { title: 'Zoning Bylaws Changes',                       url: 'https://files.cdn-files-a.com/uploads/2365528/normal_683603b4cb934.pdf',  type: 'pdf'  },
    { title: 'BRTA Senior Rides',                           url: 'https://files.cdn-files-a.com/uploads/2365528/normal_68c473b4b113b.pdf',  type: 'pdf'  },
    { title: 'Florida CDBG Housing Rehabilitation Program', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_68d59e064963b.pdf',  type: 'pdf'  },
    { title: 'McCann Repair Grant — Town Approval',         url: 'https://files.cdn-files-a.com/uploads/2365528/normal_68d6b89c0ad77.pdf',  type: 'pdf'  },
    { title: 'Shred Day — Saturday, May 9',                 url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69cd8fa607e83.pdf',  type: 'pdf'  },
    { title: 'National Grid — New Meters Installed',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69f4fd5f60eae.docx', type: 'docx' },
  ],
}

const FALLBACK_FEATURED = [
  {
    title: 'Shred Day — Saturday, May 9',
    description: 'Free document shredding event for Florida residents. Details and drop-off information inside.',
    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69cd8fa607e83.pdf',
    type: 'pdf',
  },
  {
    title: 'Florida Free Library — Upcoming Events',
    description: 'Current events and programming at the Florida Free Library. 56 North County Road · (413) 664-0153',
    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69dd5411797f0.pdf',
    type: 'pdf',
  },
  {
    title: 'Rabies Clinic — April 11, 2026',
    description: 'Florida Volunteer Fire Department. Burn permits: Tuesday nights 6–9pm · Chief Michael Gleason',
    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69d4090dbd61a.docx',
    type: 'docx',
  },
  {
    title: 'Transfer Station — 2026 Recycling Guide',
    description: "What's accepted, what's not, and how to recycle properly at the Florida Transfer Station.",
    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69d3fc7c24138.pdf',
    type: 'pdf',
  },
]

// ---------------------------------------------------------------------------
// Auto-section mapping: document type → announcement section
// When new documents are added to Sanity, they automatically appear here.
// ---------------------------------------------------------------------------

module.exports = async function () {
  try {
    const [
      docs,
      topMinuteGroup,
      agendas,
      warrants,
      annualReports,
    ] = await Promise.all([
      // Manual announcements (hand-crafted in Studio)
      client.fetch(`
        *[_type == "announcement"] | order(order asc, _createdAt desc) {
          title,
          description,
          "url": coalesce(file.asset->url, fileUrl),
          "type": fileType,
          section,
          featured
        }
      `),
      // Most recent selectboard minute group → pull its latest docs
      client.fetch(`
        *[_type == "selectboardMinuteGroup"] | order(fy desc) [0] {
          fy,
          "docs": documents[0...${AUTO_LIMIT}] {
            "title": meetingName,
            "type": fileType,
            "url": coalesce(file.asset->url, fileUrl)
          }
        }
      `),
      // Recent agendas
      client.fetch(`
        *[_type == "agenda"] | order(date desc) [0...${AUTO_LIMIT}] {
          title,
          "url": coalesce(file.asset->url, fileUrl),
          "type": fileType
        }
      `),
      // Recent warrants (max 2 — these are annual)
      client.fetch(`
        *[_type == "warrant"] | order(year desc) [0...2] {
          title,
          "url": coalesce(file.asset->url, fileUrl),
          "type": fileType
        }
      `),
      // Most recent annual report (just 1)
      client.fetch(`
        *[_type == "annualReport"] | order(year desc) [0...1] {
          title,
          "url": coalesce(file.asset->url, fileUrl),
          "type": fileType
        }
      `),
    ])

    // Build auto-generated items from document types
    const autoLatestNews = []

    // Selectboard meeting docs → latest-news
    if (topMinuteGroup && Array.isArray(topMinuteGroup.docs)) {
      topMinuteGroup.docs.forEach(doc => {
        if (doc.url) {
          autoLatestNews.push({
            title: doc.title || `Selectboard Meeting Minutes — FY${topMinuteGroup.fy}`,
            url: doc.url,
            type: doc.type || 'pdf',
            section: 'latest-news',
          })
        }
      })
    }

    // Agendas → latest-news
    ;(agendas || []).forEach(a => {
      if (a.url) {
        autoLatestNews.push({
          title: a.title,
          url: a.url,
          type: a.type || 'pdf',
          section: 'latest-news',
        })
      }
    })

    // Warrants → latest-news
    ;(warrants || []).forEach(w => {
      if (w.url) {
        autoLatestNews.push({
          title: w.title,
          url: w.url,
          type: w.type || 'pdf',
          section: 'latest-news',
        })
      }
    })

    // Annual reports → latest-news
    ;(annualReports || []).forEach(r => {
      if (r.url) {
        autoLatestNews.push({
          title: r.title,
          url: r.url,
          type: r.type || 'pdf',
          section: 'latest-news',
        })
      }
    })

    const manualDocs = docs || []
    const hasContent = manualDocs.length > 0 || autoLatestNews.length > 0

    if (hasContent) {
      const sections = SECTION_META.map(meta => {
        const manualItems = manualDocs.filter(d => d.section === meta.id)
        // Auto items only apply to latest-news; other sections use only manual
        const autoItems = meta.id === 'latest-news' ? autoLatestNews : []
        const combined = [...manualItems, ...autoItems]
        return {
          ...meta,
          items: combined.length > 0 ? combined : (FALLBACK_ITEMS[meta.id] || []),
        }
      })

      const sanityFeatured = manualDocs.filter(d => d.featured)
      const featured = sanityFeatured.length > 0 ? sanityFeatured : FALLBACK_FEATURED

      return { featured, sections }
    }
  } catch (err) {
    console.warn('[Sanity] announcements.js fetch failed, using fallback:', err.message)
  }

  // Hard fallback — Sanity completely unreachable
  return {
    featured: FALLBACK_FEATURED,
    sections: SECTION_META.map(meta => ({
      ...meta,
      items: FALLBACK_ITEMS[meta.id] || [],
    })),
  }
}
