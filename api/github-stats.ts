/* eslint-disable @typescript-eslint/no-explicit-any */
// api/github-stats.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from 'octokit'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
const GITHUB_USERNAME_ENV =
  process.env.GITHUB_USERNAME ||
  process.env.VITE_GITHUB_USERNAME ||
  process.env.NEXT_PUBLIC_GITHUB_USERNAME

// ===== Aliases e filtros de tecnologias =====
const TECHNOLOGY_ALIAS: Record<string, string> = {
  // Front-end
  react: 'React',
  'react-dom': 'React',
  'react router': 'React Router',
  'react-router': 'React Router',
  'react router dom': 'React Router',
  'react-router-dom': 'React Router',
  'framer-motion': 'Framer Motion',
  'lucide-react': 'Lucide',
  // Build/Tooling
  vite: 'Vite',
  '@vitejs/plugin-react': 'Vite',
  '@vitejs/plugin-react-swc': 'Vite',
  // CSS
  tailwindcss: 'Tailwind CSS',
  '@tailwindcss/postcss': 'Tailwind CSS',
  postcss: 'PostCSS',
  autoprefixer: 'Autoprefixer',
  // TS/Lint
  typescript: 'TypeScript',
  '@types/node': 'TypeScript',
  'typescript-eslint': 'TypeScript',
  '@eslint/js': 'ESLint',
  eslint: 'ESLint',
  'eslint-plugin-react-hooks': 'ESLint',
  'eslint-plugin-react-refresh': 'ESLint',
  // Serverless/GitHub
  '@vercel/node': 'Vercel Functions',
  octokit: 'Octokit',
  // Backend/DB comuns
  express: 'Express',
  mongoose: 'MongoDB',
  axios: 'Axios',
  prettier: 'Prettier',
}

const IGNORE_PREFIXES = [
  'eslint-config',
  'eslint-plugin',
  '@eslint/',
  '@types/',
  '@testing-library/',
  'prettier',
  'vitest',
  'jest',
  'tsup',
  'rimraf'
]

// Heurísticas de categorias
const BACKEND_LANGUAGE_HINTS = new Set([
  'python','java','go','c#','c++','c','rust','php','ruby','kotlin','scala','shell','dockerfile','swift'
])
const FRONTEND_LANGUAGE_HINTS = new Set([
  'javascript','typescript','html','css','vue','svelte','scss','less'
])
const API_KEYWORDS = [
  'api','rest','restful','endpoint','endpoints','microservice','micro-service','express','nestjs','swagger','graphql'
]
const CRUD_KEYWORDS = [
  'crud','create read update delete','painel','painel admin','dashboard','admin','gerenciamento','gestao','gestão','manage','management'
]

// ===== Helpers =====
const toTitleCase = (value: string) =>
  value.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

function normaliseTechName(name: string): string | null {
  const trimmed = name.toLowerCase().trim()

  // ignora ruído/ferramentas
  if (IGNORE_PREFIXES.some(p => trimmed.startsWith(p))) return null

  if (TECHNOLOGY_ALIAS[trimmed]) return TECHNOLOGY_ALIAS[trimmed]
  if (trimmed.startsWith('@types/')) return 'TypeScript'
  if (trimmed.startsWith('typescript-eslint')) return 'TypeScript'
  if (trimmed.startsWith('eslint-') || trimmed.startsWith('@eslint/')) return 'ESLint'
  if (trimmed.startsWith('@tailwindcss')) return 'Tailwind CSS'
  if (trimmed.startsWith('@vitejs') || trimmed.startsWith('vite-plugin-')) return 'Vite'

  // fallback: tira escopo e hifens
  const sanitized = trimmed.replace(/^@.*\//, '').replace(/[-_]/g, ' ')
  const base = toTitleCase(sanitized)
  if (['Core','Plugin','Utils'].includes(base)) return null
  return base
}

const containsKeyword = (list: string[], haystack: string) =>
  list.some((keyword) => haystack.includes(keyword))

const createOctokit = () => new Octokit(GITHUB_TOKEN ? { auth: GITHUB_TOKEN } : undefined)

// ===== Git helpers: varre a árvore e lê TODOS os package.json =====
async function listPackageJsonPaths(
  octokit: Octokit,
  owner: string,
  repo: string,
  defaultBranch: string
) {
  // 1) pega o commit da HEAD
  const { data: ref } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`
  })
  const commitSha = (ref.object as any).sha

  // 2) resolve o commit para obter o SHA da ÁRVORE (tree)
  const { data: commit } = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha
  })
  const treeSha = commit.tree.sha

  // 3) agora sim: pega a árvore recursiva a partir do treeSha
  const { data: tree } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: '1'
  })

  const paths = (tree.tree || [])
    .filter(
      (n: any) =>
        n.type === 'blob' &&
        typeof n.path === 'string' &&
        n.path.endsWith('package.json') &&
        !n.path.includes('node_modules/')
    )
    .map((n: any) => n.path as string)

  // limite defensivo
  return paths.slice(0, 25)
}

async function readPackageJson(octokit: Octokit, owner: string, repo: string, path: string) {
  const resp = await octokit.rest.repos.getContent({ owner, repo, path })

  // Se vier array, é diretório/listagem — não nos interessa
  if (Array.isArray(resp.data)) return null

  // Garante que é arquivo com 'content'
  if (resp.data.type !== 'file' || !('content' in resp.data) || !resp.data.content) {
    return null
  }

  const base64 = resp.data.content
  const text = Buffer.from(base64, 'base64').toString('utf-8')
  try { return JSON.parse(text) } catch { return null }
}

// Paginação de repositórios (>100)
async function listAllUserRepos(octokit: Octokit, username: string) {
  const all: any[] = []
  let page = 1
  while (true) {
    const { data } = await octokit.rest.repos.listForUser({
      username, type: 'owner', sort: 'updated', per_page: 100, page
    })
    all.push(...data)
    if (data.length < 100) break
    page++
  }
  return all
}

// ===== Handler =====
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const octokit = createOctokit()
  const username =
    (typeof req.query.username === 'string' && req.query.username.trim()) ||
    GITHUB_USERNAME_ENV

  if (!username) {
    return res.status(400).json({ error: 'Missing GitHub username' })
  }

  try {
    const repos = await listAllUserRepos(octokit, username)

    const publicRepos = repos.filter(
      (repo: any) =>
        (repo.visibility === 'public' || repo.private === false) &&
        !repo.fork &&
        !repo.archived
    )

    let totalStars = 0
    const languageStats: Record<string, number> = {}
    const techTally: Record<string, number> = {}
    let apiRestCount = 0
    let fullstackCount = 0
    let crudCount = 0

    for (const repo of publicRepos) {
      totalStars += repo.stargazers_count || 0

      // Linguagens por bytes
      try {
        const { data: languages } = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name
        })
        Object.entries(languages).forEach(([language, bytes]) => {
          languageStats[language] = (languageStats[language] || 0) + Number(bytes)
        })
      } catch (error) {
        console.log(`Erro ao buscar linguagens do repo ${repo.name}`, error)
      }

      // ===== Varre TODOS os package.json do repo =====
      try {
        const defaultBranch: string = repo.default_branch || 'main'
        const pkgPaths = await listPackageJsonPaths(octokit, username, repo.name, defaultBranch)

        // opcional: Set para evitar contar mesma tech várias vezes no mesmo repo
        const techsInRepo = new Set<string>()

        for (const p of pkgPaths) {
          const pkg = await readPackageJson(octokit, username, repo.name, p)
          if (!pkg) continue

          const dependencies = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {}),
            ...(pkg.peerDependencies || {}),
            ...(pkg.optionalDependencies || {})
          }

          for (const depName of Object.keys(dependencies)) {
            const normalized = normaliseTechName(depName)
            if (!normalized) continue
            techsInRepo.add(normalized) // conte 1x por repo
          }
        }

        for (const t of techsInRepo) {
          techTally[t] = (techTally[t] || 0) + 1
        }
      } catch (error) {
        console.log(`Não foi possível varrer package.json no repo ${repo.name}`, error)
      }

      // ===== Heurísticas: API / CRUD / Fullstack =====
      const combinedText = `${repo.name} ${repo.description ?? ''} ${Array.isArray(repo.topics) ? repo.topics.join(' ') : ''}`.toLowerCase()
      const topics: string[] = Array.isArray(repo.topics)
        ? repo.topics.map((t: string) => t.toLowerCase())
        : []
      const primaryLanguage = (repo.language || '').toLowerCase()

      const hasFrontend =
        FRONTEND_LANGUAGE_HINTS.has(primaryLanguage) ||
        containsKeyword(['frontend','front-end','ui','ux','react','next','angular','svelte'], combinedText)

      const hasBackend =
        BACKEND_LANGUAGE_HINTS.has(primaryLanguage) ||
        containsKeyword(['backend','back-end','api','server','node','express','nest'], combinedText)

      if (hasFrontend && hasBackend) fullstackCount += 1
      if (containsKeyword(API_KEYWORDS, combinedText) || topics.some((t: string) => API_KEYWORDS.includes(t))) apiRestCount += 1
      if (containsKeyword(CRUD_KEYWORDS, combinedText) || topics.some((t: string) => t === 'crud')) crudCount += 1
    }

    // Skills por linguagem (percentual por bytes)
    const totalBytes = Object.values(languageStats).reduce((sum, bytes) => sum + bytes, 0)
    const skillsData =
      totalBytes === 0
        ? []
        : Object.entries(languageStats)
            .map(([language, bytes]) => ({
              name: language,
              level: Math.round((Number(bytes) / totalBytes) * 100),
              bytes: Number(bytes)
            }))
            .sort((a, b) => b.bytes - a.bytes)
            .slice(0, 8)

    // ===== NOVO: skills por tecnologia (a partir do techTally) =====
    const techTotal = Object.values(techTally).reduce((sum, c) => sum + c, 0)
    const techSkills =
      techTotal === 0
        ? []
        : Object.entries(techTally)
            .map(([name, count]) => ({
              name,
              count,
              level: Math.max(1, Math.round((count / techTotal) * 100)) // % arredondado
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 12) // top 12

    // Cache leve (CDN/Edge)
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')

    return res.status(200).json({
      languages: languageStats,
      totalRepos: publicRepos.length,
      totalStars,
      detectedTechs: techTally,
      apiRestCount,
      fullstackCount,
      crudCount,
      skillsData,  // linguagens
      techSkills   // tecnologias (para "Minhas Habilidades")
    })
  } catch (error) {
    console.error('Erro ao gerar estatísticas do GitHub', error)
    return res.status(500).json({ error: 'Erro ao gerar estatísticas do GitHub' })
  }
}
