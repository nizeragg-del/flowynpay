/**
 * apply-migration.mjs
 * Aplica a migration v2 no Supabase usando a API REST de administração.
 * 
 * Como usar:
 * 1. Abra o Supabase Dashboard: https://supabase.com/dashboard/project/nehoyrpmapzhecxhyvvd/sql
 * 2. Copie o conteúdo do arquivo supabase/migration_v2_platform_relaunch.sql
 * 3. Cole no SQL Editor e clique em "Run"
 * 
 * OU rode este script com: node apply-migration.mjs <SEU_SUPABASE_ACCESS_TOKEN>
 * (Gere o token em: https://supabase.com/dashboard/account/tokens)
 */

import { readFileSync } from 'fs'

const PROJECT_REF = 'nehoyrpmapzhecxhyvvd'
const ACCESS_TOKEN = process.argv[2]

if (!ACCESS_TOKEN) {
  console.log('❌ Forneça seu Supabase Personal Access Token:')
  console.log('   node apply-migration.mjs <ACCESS_TOKEN>')
  console.log('')
  console.log('📋 Gere o token em:')
  console.log('   https://supabase.com/dashboard/account/tokens')
  console.log('')
  console.log('📌 OU copie o SQL e cole no SQL Editor:')
  console.log('   https://supabase.com/dashboard/project/nehoyrpmapzhecxhyvvd/sql/new')
  process.exit(1)
}

const sql = readFileSync('./supabase/migration_v2_platform_relaunch.sql', 'utf8')

console.log('🚀 Aplicando migration v2 no Supabase...\n')

const resp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
  },
  body: JSON.stringify({ query: sql })
})

const result = await resp.json()

if (!resp.ok) {
  console.error('❌ Erro ao aplicar migration:', result)
  process.exit(1)
}

console.log('✅ Migration aplicada com sucesso!')
console.log(result)
