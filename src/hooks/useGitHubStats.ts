import { useEffect, useState } from 'react'

export interface TechSkill {
  name: string
  level: number   // % de repositórios onde aparece
  count: number   // número de repositórios
}

export interface LanguageSkill {
  name: string
  level: number   // % por BYTES
  bytes: number
}

export interface LanguagePresence {
  name: string
  repos: number
  percent: number // % de repositórios
}

interface StatsResponse {
  totalRepos: number
  totalStars: number

  languageSkills: LanguageSkill[]
  languagePresence: LanguagePresence[]

  techSkills: TechSkill[]

  apiRestCount: number
  crudCount: number
  fullstackCount: number

  error?: string
}

export interface GitHubStatsState {
  isLoading: boolean
  error: string | null

  totalRepos: number
  totalStars: number

  languageSkills: LanguageSkill[]
  languagePresence: LanguagePresence[]

  techSkills: TechSkill[]

  apiRestCount: number
  crudCount: number
  fullstackCount: number
}

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string

export const useGitHubStats = (): GitHubStatsState => {
  const [state, setState] = useState<GitHubStatsState>({
    isLoading: true,
    error: null,

    totalRepos: 0,
    totalStars: 0,

    languageSkills: [],
    languagePresence: [],

    techSkills: [],

    apiRestCount: 0,
    crudCount: 0,
    fullstackCount: 0,
  })

  useEffect(() => {
    const controller = new AbortController()

    const run = async () => {
      if (!GITHUB_USERNAME) {
        setState(s => ({ ...s, isLoading: false, error: 'Configure VITE_GITHUB_USERNAME' }))
        return
      }

      try {
        setState(s => ({ ...s, isLoading: true, error: null }))

        const resp = await fetch(`/api/github-stats?username=${encodeURIComponent(GITHUB_USERNAME)}`, {
          signal: controller.signal
        })
        if (!resp.ok) {
          throw new Error(await resp.text())
        }
        const data: StatsResponse = await resp.json()
        if (data.error) throw new Error(data.error)

        setState({
          isLoading: false,
          error: null,

          totalRepos: data.totalRepos,
          totalStars: data.totalStars,

          languageSkills: data.languageSkills || [],
          languagePresence: data.languagePresence || [],

          techSkills: data.techSkills || [],

          apiRestCount: data.apiRestCount || 0,
          crudCount: data.crudCount || 0,
          fullstackCount: data.fullstackCount || 0,
        })
      } catch (e) {
        if (controller.signal.aborted) return
        console.error('Erro ao buscar stats:', e)
        setState(s => ({
          ...s,
          isLoading: false,
          error: e instanceof Error ? e.message : 'Erro ao carregar dados do GitHub.',
        }))
      }
    }

    run()
    return () => controller.abort()
  }, [])

  return state
}