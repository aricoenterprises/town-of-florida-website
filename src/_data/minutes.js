const client = require('./sanityClient')

// ---------------------------------------------------------------------------
// Fallback data — used when Sanity has no documents for a given type yet.
// Once entries are added in Sanity Studio, these are automatically replaced.
// ---------------------------------------------------------------------------

const FALLBACK_ANNUAL_REPORTS = [
  { year: 'FY 2022', title: 'Annual Town Report — FY22', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_65baa34017b3b.pdf' },
  { year: 'FY 2021', title: 'Annual Town Report — FY21', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_65baa3a231db8.pdf' },
  { year: 'FY 2020', title: 'Annual Town Report — FY20', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_65baa3a231db8.pdf' },
  { year: 'FY 2019', title: 'Annual Town Report — FY19', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_65baa3b57b175.pdf' },
  { year: 'FY 2018', title: 'Annual Town Report — FY18', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_65baa3be9e96a.pdf' },
]

const FALLBACK_WARRANTS = [
  { year: 'FY 2026', title: 'FY26 Warrant (Signed)',   url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890da88955c7.pdf' },
  { year: 'FY 2026', title: 'FY26 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890ea654b2df.xlsx' },
  { year: 'FY 2025', title: 'FY25 Warrant (Signed)',   url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890ea7717584.xlsx' },
  { year: 'FY 2025', title: 'FY25 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890ea7717584.xlsx' },
  { year: 'FY 2024', title: 'FY24 Warrant (Signed)',   url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890b8f994c9e.pdf' },
  { year: 'FY 2024', title: 'FY24 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890eadb27ace.xlsx' },
  { year: 'FY 2023', title: 'FY23 Warrant',            url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890b8f994c9e.pdf' },
  { year: 'FY 2023', title: 'FY23 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890b8f994c9e.pdf' },
  { year: 'Mar 2023', title: 'March 2023 STM Warrant', url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890e302e380c.pdf' },
  { year: 'FY 2022', title: 'FY22 Warrant',            url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890dc8fab77a.xlsx' },
  { year: 'FY 2022', title: 'FY22 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890ee5c6ec28.xlsx' },
  { year: 'FY 2021', title: 'FY21 Warrant',            url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890f13618645.xlsx' },
  { year: 'FY 2021', title: 'FY21 ATM Results',        url: 'https://files.cdn-files-a.com/uploads/2365528/normal_6890f15ad0d51.pdf' },
]

const FALLBACK_AGENDAS = [
  { year: 'May 11, 2026',   title: 'Assessors Board Agenda',    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69f4fcc586fa2.docx' },
  { year: 'May 6, 2026',    title: 'FSCC Board Agenda',         url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69f26b0da7094.pdf' },
  { year: 'April 28, 2026', title: 'Board of Health Agenda',    url: 'https://files.cdn-files-a.com/uploads/2365528/normal_69ea63ae6d5b3.pdf' },
]

// ---------------------------------------------------------------------------

module.exports = async function () {
  try {
    const [selectboard_minutes, sanityReports, sanityWarrants, sanityAgendas] = await Promise.all([
      client.fetch(`
        *[_type == "selectboardMinuteGroup"] | order(fy desc) {
          fy,
          "label": title,
          "open": openByDefault,
          "docs": documents[] {
            "name": meetingName,
            "type": fileType,
            "url": coalesce(file.asset->url, fileUrl)
          }
        }
      `),
      client.fetch(`
        *[_type == "annualReport"] | order(year desc) {
          year,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
      client.fetch(`
        *[_type == "warrant"] | order(year desc) {
          year,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
      client.fetch(`
        *[_type == "agenda"] | order(date desc) {
          "year": date,
          title,
          "url": coalesce(file.asset->url, fileUrl)
        }
      `),
    ])

    if (selectboard_minutes && selectboard_minutes.length > 0) {
      return {
        selectboard_minutes,
        annual_reports: sanityReports.length  > 0 ? sanityReports  : FALLBACK_ANNUAL_REPORTS,
        warrants:       sanityWarrants.length > 0 ? sanityWarrants  : FALLBACK_WARRANTS,
        agendas:        sanityAgendas.length  > 0 ? sanityAgendas   : FALLBACK_AGENDAS,
      }
    }
  } catch (err) {
    console.warn('[Sanity] minutes.js fetch failed:', err.message)
  }

  // Hard fallback if Sanity is completely unreachable
  return {
    selectboard_minutes: [],
    annual_reports: FALLBACK_ANNUAL_REPORTS,
    warrants:       FALLBACK_WARRANTS,
    agendas:        FALLBACK_AGENDAS,
  }
}
