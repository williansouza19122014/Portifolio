import { useEffect, useState } from 'react'

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

interface ProjectsResponse {
  projects?: ProcessedProject[]
  error?: string
}

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string

export const useGitHubProjects = () => {
  const [projects, setProjects] = useState<ProcessedProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchProjects = async () => {
      if (!GITHUB_USERNAME) {
        setError('Configure VITE_GITHUB_USERNAME para carregar os projetos do GitHub.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/github-projects?username=${encodeURIComponent(GITHUB_USERNAME)}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          const message = await response.text()
          throw new Error(message || 'Erro inesperado ao buscar projetos.')
        }

        const data: ProjectsResponse = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setProjects(data.projects ?? [])
      } catch (err) {
        if (controller.signal.aborted) return

        console.error('Erro ao buscar projetos do GitHub:', err)
        setError('Erro ao carregar projetos do GitHub. Tente novamente mais tarde.')
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()

    return () => controller.abort()
  }, [])

  return { projects, isLoading, error }
}
