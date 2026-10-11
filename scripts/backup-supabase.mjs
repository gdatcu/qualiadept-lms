import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://uibnmpubdszfpuydefkg.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_L1I0yDfBe71n8SFcA1mFkA_jAXSYY3U'

const TABLES = [
  'article_reactions',
  'article_comments',
  'challenge_progress'
]

async function runBackup() {
  console.log(`[Backup] Starting Supabase database backup for project: ${SUPABASE_URL}`)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0]
  const backupDir = path.resolve(process.cwd(), 'backups', `supabase_${timestamp}`)
  fs.mkdirSync(backupDir, { recursive: true })

  const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  })

  const manifest = {
    timestamp: new Date().toISOString(),
    projectUrl: SUPABASE_URL,
    tables: {}
  }

  let totalRecords = 0

  for (const table of TABLES) {
    try {
      console.log(`[Backup] Fetching data from table: ${table}...`)
      const { data, error } = await client.from(table).select('*')

      if (error) {
        console.warn(`[Backup] Warning fetching ${table}:`, error.message)
        manifest.tables[table] = { status: 'error', error: error.message, count: 0 }
        continue
      }

      const rows = data || []
      manifest.tables[table] = { status: 'success', count: rows.length }
      totalRecords += rows.length

      // Save as JSON
      const jsonPath = path.join(backupDir, `${table}.json`)
      fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2), 'utf-8')

      // Save as SQL INSERT statements for easy restoration
      if (rows.length > 0) {
        const sqlStatements = generateSqlInserts(table, rows)
        const sqlPath = path.join(backupDir, `${table}.sql`)
        fs.writeFileSync(sqlPath, sqlStatements, 'utf-8')
      }

      console.log(`[Backup] Table ${table}: ${rows.length} records backed up.`)
    } catch (err) {
      console.error(`[Backup] Failed to backup table ${table}:`, err)
      manifest.tables[table] = { status: 'exception', error: err.message, count: 0 }
    }
  }

  manifest.totalRecords = totalRecords
  const manifestPath = path.join(backupDir, 'manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`[Backup] Complete! Backed up ${totalRecords} records across ${TABLES.length} tables to: ${backupDir}`)
  return { backupDir, manifest }
}

function generateSqlInserts(tableName, rows) {
  if (!rows || rows.length === 0) return ''
  const columns = Object.keys(rows[0])
  const colList = columns.map(c => `"${c}"`).join(', ')

  const lines = [
    `-- Backup for table: ${tableName}`,
    `-- Date: ${new Date().toISOString()}`,
    `-- Total Rows: ${rows.length}`,
    ''
  ]

  for (const row of rows) {
    const values = columns.map(col => {
      const val = row[col]
      if (val === null || val === undefined) return 'NULL'
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
      if (typeof val === 'number') return String(val)
      if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
      return `'${String(val).replace(/'/g, "''")}'`
    })
    lines.push(`INSERT INTO public.${tableName} (${colList}) VALUES (${values.join(', ')}) ON CONFLICT DO NOTHING;`)
  }

  return lines.join('\n')
}

runBackup().catch(err => {
  console.error('[Backup] Fatal error:', err)
  process.exit(1)
})
