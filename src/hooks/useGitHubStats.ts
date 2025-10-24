import { useEffect, useState } from 'react'

interface GitHubStats {
  languages: Record<string, number>
  totalRepos: number
  totalStars: number
  isLoading: boolean
  error: string | null
  detectedTechs: Record<string, number>
  apiRestCount: number
  fullstackCount: number
  crudCount: number
  repoCount: number                  // NOVO
}

export interface SkillData {
  name: string
  level: number
  bytes: number
}

export interface TechSkill {
  name: string
  level: number // porcentagem (0–100) - % de repositórios
  count: number // em quantos repositórios a tech apareceu
}

interface StatsResponse {
  languages?: Record<string, number>
  totalRepos?: number
  totalStars?: number
  detectedTechs?: Record<string, number>
  apiRestCount?: number
  fullstackCount?: number
  crudCount?: number
  repoCount?: number                 // NOVO
  skillsData?: SkillData[]           // linguagens por bytes
  techSkills?: TechSkill[]           // tecnologias por repo (NOVO)
  error?: string
}

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string

export const useGitHubStats = () => {
  const [stats, setStats] = useState<GitHubStats>({
    languages: {},
    totalRepos: 0,
    totalStars: 0,
    isLoading: true,
    error: null,
    detectedTechs: {},
    apiRestCount: 0,
    fullstackCount: 0,
    crudCount: 0,
    repoCount: 0,
  })

  const [skillsData, setSkillsData] = useState<SkillData[]>([]) // linguagens
  const [techSkills, setTechSkills] = useState<TechSkill[]>([]) // tecnologias

  useEffect(() => {
    const controller = new AbortController()

    const fetchStats = async () => {
      if (!GITHUB_USERNAME) {
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Configure VITE_GITHUB_USERNAME para carregar os dados do GitHub.',
        }))
        return
      }

      setStats(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch(
          `/api/github-stats?username=${encodeURIComponent(GITHUB_USERNAME)}`,
          { signal: controller.signal }
        )
        if (!response.ok) {
          const message = await response.text()
          throw new Error(message || 'Erro inesperado ao buscar estatísticas.')
        }

        const data: StatsResponse = await response.json()
        if (data.error) throw new Error(data.error)

        setStats({
          languages: data.languages ?? {},
          totalRepos: data.totalRepos ?? 0,
          totalStars: data.totalStars ?? 0,
          isLoading: false,
          error: null,
          detectedTechs: data.detectedTechs ?? {},
          apiRestCount: data.apiRestCount ?? 0,
          fullstackCount: data.fullstackCount ?? 0,
          crudCount: data.crudCount ?? 0,
          repoCount: data.repoCount ?? (data.totalRepos ?? 0),
        })

        setSkillsData(data.skillsData ?? [])
        setTechSkills(data.techSkills ?? [])
      } catch (err) {
        if (controller.signal.aborted) return
        console.error('Erro ao carregar estatísticas do GitHub:', err)
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error:
            'Erro ao carregar dados do GitHub. Verifique se o usuário existe ou tente novamente mais tarde.',
        }))
      }
    }

    fetchStats()
    return () => controller.abort()
  }, [])

  return {
    ...stats,
    skillsData,   // linguagens (fallback)
    techSkills,   // tecnologias (% de repositórios)
  }
}
