import React from "react"
import { motion } from "framer-motion"
import { Github, Star, GitBranch, Activity, ServerCog, Database } from "lucide-react"
import { useGitHubStats } from "../hooks/useGitHubStats"

const GitHubStats: React.FC = () => {
  const { totalRepos, totalStars, isLoading, error, detectedTechs, apiRestCount, fullstackCount, crudCount } = useGitHubStats()

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
        <div className="text-center">
          <Github className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const coreStats = [
    { icon: GitBranch, label: "Repositórios", value: totalRepos },
    { icon: Star, label: "Stars", value: totalStars },
    { icon: Activity, label: "Ativo", value: "Sim" }
  ]

  const sortedTechs = detectedTechs
    ? Object.entries(detectedTechs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center mb-4">
        <Github className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-lg font-semibold text-white">GitHub Stats</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {coreStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ServerCog className="w-5 h-5 text-purple-300" />
            <div>
              <p className="text-sm text-gray-300">API REST</p>
              <p className="text-xl font-semibold text-white">{apiRestCount}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-sm text-gray-300">CRUD</p>
                <p className="text-lg font-semibold text-white">{crudCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10 md:col-span-2 flex flex-col gap-3">
          <p className="text-sm text-gray-300 uppercase tracking-wide">Arquitetura Full Stack</p>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-bold text-white">{fullstackCount}</div>
            <div className="text-xs text-gray-400 pb-1">repositórios com frontend e backend</div>
          </div>
          <div className="bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
              style={{ width: `${Math.min(100, fullstackCount * 20)}%` }}
            />
          </div>
        </div>
      </div>

      {sortedTechs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Tecnologias detectadas (package.json)</h4>
          <div className="flex flex-wrap gap-2">
            {sortedTechs.map(([tech, count]) => (
              <span key={tech} className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-xs border border-white/10">
                {tech} <span className="text-gray-400">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GitHubStats
