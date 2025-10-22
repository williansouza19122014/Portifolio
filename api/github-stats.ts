import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from 'octokit'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN
const GITHUB_USERNAME_ENV =
  process.env.GITHUB_USERNAME ||
  process.env.VITE_GITHUB_USERNAME ||
  process.env.NEXT_PUBLIC_GITHUB_USERNAME

const TECHNOLOGY_ALIAS: Record<string, string> = {
  mongoose: 'MongoDB',
  express: 'Express',
  react: 'React',
  'react dom': 'React',
  'react-dom': 'React',
  'react router': 'React Router',
  'react-router': 'React Router',
  'react router dom': 'React Router',
  'react-router-dom': 'React Router',
  'react accordion': 'React',
  'react aspect ratio': 'React',
  vite: 'Vite',
  tailwindcss: 'Tailwind CSS',
  axios: 'Axios',
  typescript: 'TypeScript',
  'typescript eslint': 'TypeScript',
  'typescript-eslint': 'TypeScript',
  'typescript eslint parser': 'TypeScript',
  'typescript eslint plugin': 'TypeScript',
  'typescript eslint eslintrc': 'TypeScript',
  'typescript-eslint eslint-plugin': 'TypeScript',
  'typescript-eslint parser': 'TypeScript',
  nodemon: 'Nodemon',
  eslint: 'ESLint',
  'eslint plugin react hooks': 'ESLint',
  'eslint-plugin-react-hooks': 'ESLint',
  'eslint-plugin-react-refresh': 'ESLint',
  'eslint-plugin-react': 'ESLint',
  'eslint plugin react': 'ESLint',
  'eslint plugin react refresh': 'ESLint',
  '@eslint/js': 'ESLint',
  'eslint-config': 'ESLint',
  prettier: 'Prettier',
  '@types/node': 'TypeScript',
  'types node': 'TypeScript',
  'styled components': 'Styled Components',
  'styled-components': 'Styled Components',
  'plugin react': 'ESLint',
  globals: 'ESLint',
  js: 'JavaScript',
  javascript: 'JavaScript'
}

const BACKEND_LANGUAGE_HINTS = new Set([
  'python',
  'java',
  'go',
  'c#',
  'c++',
  'c',
  'rust',
  'php',
  'ruby',
  'kotlin',
  'scala',
  'shell',
  'dockerfile',
  'swift'
])

const FRONTEND_LANGUAGE_HINTS = new Set([
  'javascript',
  'typescript',
  'html',
  'css',
  'vue',
  'svelte',
  'scss',
  'less'
])

const API_KEYWORDS = [
  'api',
  'rest',
  'restful',
  'endpoint',
  'endpoints',
  'microservice',
  'micro-service',
  'express',
  'nestjs',
  'swagger',
  'graphql'
]

const CRUD_KEYWORDS = [
  'crud',
  'create read update delete',
  'painel',
  'painel admin',
  'dashboard',
  'admin',
  'gerenciamento',
  'gestao',
  'gestão',
  'manage',
  'management'
]

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const normaliseTechName = (name: string) => {
  const trimmed = name.toLowerCase().trim()
  if (TECHNOLOGY_ALIAS[trimmed]) return TECHNOLOGY_ALIAS[trimmed]

  if (trimmed.startsWith('@types/')) return 'TypeScript'
  if (trimmed.startsWith('typescript-eslint')) return 'TypeScript'
  if (trimmed.startsWith('eslint-plugin') || trimmed.startsWith('@eslint/') || trimmed.startsWith('eslint-')) {
    return 'ESLint'
  }
  if (trimmed.startsWith('@tailwindcss')) return 'Tailwind CSS'
  if (trimmed.startsWith('@vitejs')) return 'Vite'

  const sanitized = trimmed.replace(/^@.*\//, '').replace(/[-_]/g, ' ')
  return toTitleCase(sanitized)
}

const containsKeyword = (list: string[], haystack: string) =>
  list.some((keyword) => haystack.includes(keyword))

const createOctokit = () =>
  new Octokit(GITHUB_TOKEN ? { auth: GITHUB_TOKEN } : undefined)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const octokit = createOctokit()
  const username =
    (typeof req.query.username === 'string' && req.query.username.trim()) ||
    GITHUB_USERNAME_ENV
  if (!username) {
    return res.status(400).json({ error: 'Missing GitHub username' })
  }

  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100
    })

    const publicRepos = repos.filter(
      (repo) => (repo.visibility === 'public' || repo.private === false) && !repo.fork && !repo.archived
    )

    let totalStars = 0
    const languageStats: Record<string, number> = {}
    const techTally: Record<string, number> = {}
    let apiRestCount = 0
    let fullstackCount = 0
    let crudCount = 0

    for (const repo of publicRepos) {
      totalStars += repo.stargazers_count || 0

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

      try {
        const gqlResponse = await octokit.graphql<{
          repository: { object: { text?: string } | null }
        }>(
          `query ($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              object(expression: "HEAD:package.json") {
                ... on Blob { text }
              }
            }
          }`,
          { owner: username, name: repo.name }
        )

        const packageText = gqlResponse?.repository?.object?.text
        if (packageText) {
          const pkg = JSON.parse(packageText)
          const dependencies = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {})
          }

          Object.keys(dependencies).forEach((depName) => {
            const normalized = normaliseTechName(depName.toLowerCase())
            techTally[normalized] = (techTally[normalized] || 0) + 1
          })
        }
      } catch (error) {
        console.log(`Não foi possível ler package.json do repo ${repo.name}`, error)
      }

      const combinedText = `${repo.name} ${repo.description ?? ''} ${(repo.topics || []).join(' ')}`.toLowerCase()
      const topics = (repo.topics || []).map((topic) => topic.toLowerCase())
      const primaryLanguage = (repo.language || '').toLowerCase()

      const hasFrontend =
        FRONTEND_LANGUAGE_HINTS.has(primaryLanguage) ||
        containsKeyword(['frontend', 'front-end', 'ui', 'ux', 'react', 'next', 'angular', 'svelte'], combinedText)

      const hasBackend =
        BACKEND_LANGUAGE_HINTS.has(primaryLanguage) ||
        containsKeyword(['backend', 'back-end', 'api', 'server', 'node', 'express', 'nest'], combinedText)

      if (hasFrontend && hasBackend) {
        fullstackCount += 1
      }

      if (containsKeyword(API_KEYWORDS, combinedText) || topics.some((topic) => API_KEYWORDS.includes(topic))) {
        apiRestCount += 1
      }

      if (containsKeyword(CRUD_KEYWORDS, combinedText) || topics.includes('crud')) {
        crudCount += 1
      }
    }

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

    return res.status(200).json({
      languages: languageStats,
      totalRepos: publicRepos.length,
      totalStars,
      detectedTechs: techTally,
      apiRestCount,
      fullstackCount,
      crudCount,
      skillsData
    })
  } catch (error) {
    console.error('Erro ao gerar estatísticas do GitHub', error)
    return res.status(500).json({ error: 'Erro ao gerar estatísticas do GitHub' })
  }
}
