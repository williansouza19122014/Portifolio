import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Octokit } from 'octokit'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

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

const BACKEND_KEYWORDS = [
  'backend',
  'back-end',
  'api',
  'rest',
  'graphql',
  'server',
  'service',
  'microservice',
  'micro-service',
  'node',
  'express',
  'nestjs',
  'database',
  'postgres',
  'mysql',
  'mongodb',
  'mongo',
  'firebase',
  'supabase',
  'prisma',
  'auth',
  'authentication',
  'authorization'
]

const FRONTEND_KEYWORDS = [
  'frontend',
  'front-end',
  'ui',
  'ux',
  'web',
  'interface',
  'react',
  'next',
  'nextjs',
  'next.js',
  'vue',
  'angular',
  'svelte',
  'tailwind',
  'chakra',
  'design system'
]

const MOBILE_KEYWORDS = [
  'mobile',
  'android',
  'ios',
  'react-native',
  'react native',
  'flutter'
]

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

  const lowerTopics = topics.map((topic) => topic.toLowerCase())

  if (lowerTopics.some((topic) => ['mobile', 'react-native', 'flutter', 'android', 'ios'].includes(topic))) {
    return 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((topic) => ['web', 'frontend', 'website'].includes(topic))) {
    return 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((topic) => ['api', 'backend', 'server'].includes(topic))) {
    return 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((topic) => ['ecommerce', 'shopping'].includes(topic))) {
    return 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
  if (lowerTopics.some((topic) => ['dashboard', 'analytics'].includes(topic))) {
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
  const lowerTopics = topics.map((topic) => topic.toLowerCase())
  const lowerLanguages = languagesList.map((lang) => lang.toLowerCase())
  const primaryLanguage = (language || '').toLowerCase()
  const combinedText = `${name} ${description ?? ''} ${lowerTopics.join(' ')}`.toLowerCase()

  const hasKeyword = (keywords: string[], haystack: string) =>
    keywords.some((keyword) => haystack.includes(keyword))

  if (
    lowerTopics.some((topic) => MOBILE_KEYWORDS.includes(topic)) ||
    hasKeyword(MOBILE_KEYWORDS, combinedText)
  ) {
    categories.add('mobile')
  }

  const hasBackendLanguage =
    BACKEND_LANGUAGE_HINTS.has(primaryLanguage) ||
    lowerLanguages.some((lang) => BACKEND_LANGUAGE_HINTS.has(lang))

  if (
    hasBackendLanguage ||
    lowerTopics.some((topic) => BACKEND_KEYWORDS.includes(topic)) ||
    hasKeyword(BACKEND_KEYWORDS, combinedText)
  ) {
    categories.add('backend')
  }

  const hasFrontendLanguage =
    FRONTEND_LANGUAGE_HINTS.has(primaryLanguage) ||
    lowerLanguages.some((lang) => FRONTEND_LANGUAGE_HINTS.has(lang))

  if (
    hasFrontendLanguage ||
    lowerTopics.some((topic) => FRONTEND_KEYWORDS.includes(topic)) ||
    hasKeyword(FRONTEND_KEYWORDS, combinedText)
  ) {
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

  if (categories.size === 0) {
    categories.add('frontend')
  }

  return Array.from(categories)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (req.query.username as string) || process.env.GITHUB_USERNAME
  if (!username) {
    return res.status(400).json({ error: 'Missing GitHub username' })
  }
  if (!process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured on the server' })
  }

  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100
    })

    const relevantRepos = repos.filter((repo) => {
      const isPublic = repo.visibility === 'public' || repo.private === false
      return isPublic && !repo.fork && !repo.archived
    })

    const processedProjects: ProcessedProject[] = []

    for (const repo of relevantRepos.slice(0, 20)) {
      try {
        const { data: languages } = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name
        })

        const languagesList = Object.keys(languages)
        const techList = languagesList.slice(0, 4)
        const categories = getProjectCategories({
          language: repo.language || '',
          topics: repo.topics || [],
          description: repo.description,
          name: repo.name,
          languagesList
        })

        processedProjects.push({
          id: repo.id,
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          description: repo.description || 'Projeto desenvolvido com foco em qualidade e performance.',
          technologies: techList.length > 0 ? techList : [repo.language || 'JavaScript'],
          github: repo.html_url,
          demo: repo.homepage || `https://${username}.github.io/${repo.name}`,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          language: repo.language || 'JavaScript',
          categories,
          image: getProjectImage(repo.language || '', repo.topics || []),
          lastUpdate: new Date(repo.updated_at ?? new Date().toISOString()).toLocaleDateString('pt-BR'),
          size: repo.size ?? 0
        })
      } catch (error) {
        console.log(`Erro ao processar repo ${repo.name}`, error)
      }
    }

    processedProjects.sort((a, b) => {
      const starsWeight = (b.stars - a.stars) * 10
      const dateWeight =
        new Date(b.lastUpdate.split('/').reverse().join('-')).getTime() -
        new Date(a.lastUpdate.split('/').reverse().join('-')).getTime()
      return starsWeight + dateWeight
    })

    res.status(200).json({ projects: processedProjects })
  } catch (error) {
    console.error('Erro ao buscar projetos do GitHub', error)
    res.status(500).json({ error: 'Erro ao buscar projetos do GitHub' })
  }
}
