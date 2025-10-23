/* eslint-disable @typescript-eslint/no-explicit-any */
// api/github-projects.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from 'octokit'

interface ProcessedProject {
  id: number
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
  stars: number
  forks: number
  language: string
  categories: string[]
  image: string
  lastUpdate: string
  size: number
}

// ===== Hints/Categorias =====
const BACKEND_LANGUAGE_HINTS = new Set([
  'python','java','go','c#','c++','c','rust','php','ruby','kotlin','scala','shell','dockerfile','swift'
])
const FRONTEND_LANGUAGE_HINTS = new Set([
  'javascript','typescript','html','css','vue','svelte','scss','less'
])
const BACKEND_KEYWORDS = [
  'backend','back-end','api','rest','graphql','server','service','microservice','micro-service',
  'node','express','nestjs','database','postgres','mysql','mongodb','mongo','firebase','supabase','prisma',
  'auth','authentication','authorization'
]
const FRONTEND_KEYWORDS = [
  'frontend','front-end','ui','ux','web','interface','react','next','nextjs','next.js','vue','angular',
  'svelte','tailwind','chakra','design system'
]
const MOBILE_KEYWORDS = ['mobile','android','ios','react-native','react native','flutter']

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
const GITHUB_USERNAME_ENV =
  process.env.GITHUB_USERNAME ||
  process.env.VITE_GITHUB_USERNAME ||
  process.env.NEXT_PUBLIC_GITHUB_USERNAME

// ===== Mapa/Normalização de Techs =====
const TECHNOLOGY_ALIAS: Record<string, string> = {
  react: 'React',
  'react-dom': 'React',
  'react-router': 'React Router',
  'react-router-dom': 'React Router',
  'framer-motion': 'Framer Motion',
  'lucide-react': 'Lucide',
  vite: 'Vite',
  '@vitejs/plugin-react': 'Vite',
  '@vitejs/plugin-react-swc': 'Vite',
  tailwindcss: 'Tailwind CSS',
  '@tailwindcss/postcss': 'Tailwind CSS',
  postcss: 'PostCSS',
  autoprefixer: 'Autoprefixer',
  typescript: 'TypeScript',
  '@types/node': 'TypeScript',
  'typescript-eslint': 'TypeScript',
  '@eslint/js': 'ESLint',
  eslint: 'ESLint',
  'eslint-plugin-react-hooks': 'ESLint',
  'eslint-plugin-react-refresh': 'ESLint',
  '@vercel/node': 'Vercel Functions',
  octokit: 'Octokit',
  express: 'Express',
  mongoose: 'MongoDB',
  axios: 'Axios',
  prettier: 'Prettier'
}
const IGNORE_PREFIXES = [
  'eslint-config','eslint-plugin','@eslint/','@types/','@testing-library/','prettier','vitest','jest','tsup','rimraf'
]

const toTitleCase = (v: string) =>
  v.split(' ').filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1)).join(' ')

function normaliseTechName(name: string): string | null {
  const n = name.toLowerCase().trim()
  if (IGNORE_PREFIXES.some(p => n.startsWith(p))) return null
  if (TECHNOLOGY_ALIAS[n]) return TECHNOLOGY_ALIAS[n]
  if (n.startsWith('@types/')) return 'TypeScript'
  if (n.startsWith('typescript-eslint')) return 'TypeScript'
  if (n.startsWith('@tailwindcss')) return 'Tailwind CSS'
  if (n.startsWith('@vitejs') || n.startsWith('vite-plugin-')) return 'Vite'
  const base = toTitleCase(n.replace(/^@.*\//, '').replace(/[-_]/g, ' '))
  if (['Core','Plugin','Utils'].includes(base)) return null
  return base
}

const createOctokit = () => new Octokit(GITHUB_TOKEN ? { auth: GITHUB_TOKEN } : undefined)

// ===== Imagem e Categorias =====
const getProjectImage = (language: string, topics: string[]) => {
  const imageMap: Record<string, string> = {
    javascript: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
    typescript: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    python: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600',
    react: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600',
    vue: 'https://images.pexels.com/photos/11035364/pexels-photo-11035364.jpeg?auto=compress&cs=tinysrgb&w=600',
    'node.js': 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=600',
    java: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    php: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
    'c#': 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
    go: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=600',
    rust: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  const lowerTopics = topics.map((t: string) => t.toLowerCase())
  if (lowerTopics.some((t: string) => ['mobile','react-native','flutter','android','ios'].includes(t))) {
    return 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((t: string) => ['web','frontend','website'].includes(t))) {
    return 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((t: string) => ['api','backend','server'].includes(t))) {
    return 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((t: string) => ['ecommerce','shopping'].includes(t))) {
    return 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((t: string) => ['dashboard','analytics'].includes(t))) {
    return 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  return imageMap[language.toLowerCase()] ?? 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600'
}

const getProjectCategories = (params: {
  language: string
  topics: string[]
  description?: string | null
  name: string
  languagesList: string[]
}) => {
  const { language, topics, description, name, languagesList } = params
  const categories = new Set<string>()
  const lowerTopics: string[] = topics.map((t: string) => t.toLowerCase())
  const lowerLanguages: string[] = languagesList.map((l: string) => l.toLowerCase())
  const primaryLanguage = (language || '').toLowerCase()
  const combinedText = `${name} ${description ?? ''} ${lowerTopics.join(' ')}`.toLowerCase()
  const hasKeyword = (keywords: string[], haystack: string) =>
    keywords.some((k) => haystack.includes(k))

  if (lowerTopics.some((t: string) => MOBILE_KEYWORDS.includes(t)) || hasKeyword(MOBILE_KEYWORDS, combinedText)) {
    categories.add('mobile')
  }
  const hasBackendLanguage =
    BACKEND_LANGUAGE_HINTS.has(primaryLanguage) ||
    lowerLanguages.some((lang: string) => BACKEND_LANGUAGE_HINTS.has(lang))
  if (hasBackendLanguage || lowerTopics.some((t: string) => BACKEND_KEYWORDS.includes(t)) || hasKeyword(BACKEND_KEYWORDS, combinedText)) {
    categories.add('backend')
  }
  const hasFrontendLanguage =
    FRONTEND_LANGUAGE_HINTS.has(primaryLanguage) ||
    lowerLanguages.some((lang: string) => FRONTEND_LANGUAGE_HINTS.has(lang))
  if (hasFrontendLanguage || lowerTopics.some((t: string) => FRONTEND_KEYWORDS.includes(t)) || hasKeyword(FRONTEND_KEYWORDS, combinedText)) {
    categories.add('frontend')
  }
  if (
    lowerTopics.includes('fullstack') ||
    combinedText.includes('full stack') ||
    combinedText.includes('fullstack') ||
    (categories.has('frontend') && categories.has('backend'))
  ) {
    categories.add('fullstack')
  }
  if (categories.size === 0) categories.add('frontend')
  return Array.from(categories)
}

// ===== Git helpers: varredura de package.json =====
async function listPackageJsonPaths(octokit: Octokit, owner: string, repo: string, defaultBranch: string) {
  const ref = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${defaultBranch}` })
  const commitSha = ref.data.object.sha
  const tree = await octokit.rest.git.getTree({ owner, repo, tree_sha: commitSha, recursive: '1' })
  const paths = (tree.data.tree || [])
    .filter((n: any) =>
      n.type === 'blob' &&
      typeof n.path === 'string' &&
      n.path.endsWith('package.json') &&
      !n.path.includes('node_modules/')
    )
    .map((n: any) => n.path as string)
  return paths.slice(0, 25)
}

async function readPackageJson(octokit: Octokit, owner: string, repo: string, path: string) {
  const resp = await octokit.rest.repos.getContent({ owner, repo, path })

  // Diretório? então não é o que queremos
  if (Array.isArray(resp.data)) return null

  // Garante arquivo com conteúdo
  if (resp.data.type !== 'file' || !('content' in resp.data) || !resp.data.content) {
    return null
  }

  const text = Buffer.from(resp.data.content, 'base64').toString('utf-8')
  try { return JSON.parse(text) } catch { return null }
}

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

    const relevantRepos = repos.filter((repo: any) => {
      const isPublic = repo.visibility === 'public' || repo.private === false
      return isPublic && !repo.fork && !repo.archived
    })

    const processedProjects: ProcessedProject[] = []

    for (const repo of relevantRepos.slice(0, 20)) {
      try {
        // Linguagens (fallback e categorias)
        const { data: languages } = await octokit.rest.repos.listLanguages({
          owner: username, repo: repo.name
        })
        const languagesList: string[] = Object.keys(languages)

        // ===== Tecnologias reais via package.json =====
        const techSet = new Set<string>()
        try {
          const defaultBranch: string = repo.default_branch || 'main'
          const pkgPaths = await listPackageJsonPaths(octokit, username, repo.name, defaultBranch)
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
              const t = normaliseTechName(depName)
              if (t) techSet.add(t)
            }
          }
        } catch (e) {
          console.log(`Falha ao extrair techs do repo ${repo.name}`, e)
        }

        const techList: string[] = Array.from(techSet)
        const repoTopics: string[] = Array.isArray(repo.topics) ? repo.topics : []
        const categories = getProjectCategories({
          language: repo.language || '',
          topics: repoTopics,
          description: repo.description,
          name: repo.name,
          languagesList
        })

        processedProjects.push({
          id: repo.id,
          title: String(repo.name).replace(/-/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase()),
          description: repo.description || 'Projeto desenvolvido com foco em qualidade e performance.',
          technologies: techList.length > 0
            ? techList.slice(0, 8)
            : (languagesList.length ? languagesList.slice(0, 4) : [repo.language || 'JavaScript']),
          github: repo.html_url,
          demo: repo.homepage || `https://${username}.github.io/${repo.name}`,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          language: repo.language || 'JavaScript',
          categories,
          image: getProjectImage(repo.language || '', repoTopics),
          lastUpdate: new Date(repo.updated_at ?? new Date().toISOString()).toLocaleDateString('pt-BR'),
          size: repo.size ?? 0
        })
      } catch (error) {
        console.log(`Erro ao processar repo ${repo.name}`, error)
      }
    }

    // Ordenação por estrelas + recência
    processedProjects.sort((a, b) => {
      const starsWeight = (b.stars - a.stars) * 10
      const dateWeight =
        new Date(b.lastUpdate.split('/').reverse().join('-')).getTime() -
        new Date(a.lastUpdate.split('/').reverse().join('-')).getTime()
      return starsWeight + dateWeight
    })

    // Cache leve
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    res.status(200).json({ projects: processedProjects })
  } catch (error) {
    console.error('Erro ao buscar projetos do GitHub', error)
    res.status(500).json({ error: 'Erro ao buscar projetos do GitHub' })
  }
}
