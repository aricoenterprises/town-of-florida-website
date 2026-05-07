/**
 * Migration script — adds the 7 Latest News items to Sanity.
 * Safe to re-run: uses createOrReplace so it won't duplicate.
 *
 * Run from the studio/ folder:
 *   node scripts/migrateLatestNews.js
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@sanity/client'

const token = process.env.SANITY_MIGRATE_TOKEN
if (!token) {
  console.error('ERROR: SANITY_MIGRATE_TOKEN not found. Check that studio/.env.local exists and contains the token.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'hs5p5cc4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const LATEST_NEWS_ITEMS = [
  {
    _id:      'announcement-general-bylaws-changes',
    _type:    'announcement',
    title:    'General Bylaws Changes',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_683603de1e1bb.pdf',
    featured: false,
    order:    10,
  },
  {
    _id:      'announcement-zoning-bylaws-changes',
    _type:    'announcement',
    title:    'Zoning Bylaws Changes',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_683603b4cb934.pdf',
    featured: false,
    order:    11,
  },
  {
    _id:      'announcement-brta-senior-rides',
    _type:    'announcement',
    title:    'BRTA Senior Rides',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_68c473b4b113b.pdf',
    featured: false,
    order:    12,
  },
  {
    _id:      'announcement-cdbg-housing',
    _type:    'announcement',
    title:    'Florida CDBG Housing Rehabilitation Program',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_68d59e064963b.pdf',
    featured: false,
    order:    13,
  },
  {
    _id:      'announcement-mccann-repair-grant',
    _type:    'announcement',
    title:    'McCann Repair Grant — Town Approval',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_68d6b89c0ad77.pdf',
    featured: false,
    order:    14,
  },
  {
    _id:      'announcement-shred-day',
    _type:    'announcement',
    title:    'Shred Day — Saturday, May 9',
    section:  'latest-news',
    fileType: 'pdf',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_69cd8fa607e83.pdf',
    featured: true,
    order:    15,
  },
  {
    _id:      'announcement-national-grid-meters',
    _type:    'announcement',
    title:    'National Grid — New Meters Installed',
    section:  'latest-news',
    fileType: 'docx',
    fileUrl:  'https://files.cdn-files-a.com/uploads/2365528/normal_69f4fd5f60eae.docx',
    featured: false,
    order:    16,
  },
]

async function run() {
  console.log(`Migrating ${LATEST_NEWS_ITEMS.length} Latest News items to Sanity...`)
  for (const item of LATEST_NEWS_ITEMS) {
    await client.createOrReplace(item)
    console.log(`  ✓ ${item.title}`)
  }
  console.log('\nAll Latest News items migrated. Publish them in Sanity Studio to make them live.')
}

run().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
