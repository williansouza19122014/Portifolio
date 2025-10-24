// src/components/GitHubStats.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  Github,
  Star,
  GitBranch,
  Activity,
  ServerCog,
  Database,
} from 'lucide-react'
import { useGitHubStats } from '../hooks/useGitHubStats'
import { getTechIcon, getTechColor } from '../utils/techIcons'

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value }) => (
  <div className="text-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
    <Icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
    <div className="text-xl font-bold text-white">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
)

const ProgressBar: React.FC<{ percent: number; color: string; delay?: number }> = ({
  percent,
  color,
  delay = 0,
}) => (
  <div className="w-full bg-gray-700/60 rounded-full h-2.5 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className={`bg-gradient-to-r ${color} h-full rounded-full`}
    />
  </div>
)

const GitHubStats: React.FC = () => {
  const {
    totalRepos,
    totalStars,
    isLoading,
    error,
    techSkills,     // [{ name, count, level }] => tecnologias por repo (package.json)
    apiRestCount,
    fullstackCount,
    crudCount,
  } = useGitHubStats()

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

  // Estatísticas de topo (como no seu design anterior)
  const coreStats = [
    { icon: GitBranch, label: 'Repositórios', value: totalRepos },
    { icon: Star,      label: 'Stars',        value: totalStars },
    { icon: Activity,  label: 'Ativo',        value: 'Sim' },
  ]

  // Top 6 tecnologias reais (vindas da API)
  const topTechs = (techSkills ?? []).slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      {/* Cabeçalho */}
      <div className="flex items-center mb-4">
        <Github className="w-6 h-6 text-purple-400 mr-3" />
        <h3 className="text-lg font-semibold text-white">GitHub Stats</h3>
      </div>

      {/* Contadores principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {coreStats.map((stat) => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      {/* API/CRUD + Full-Stack */}
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
            <div className="text-xs text-gray-400 pb-1">
              repositórios com frontend e backend
            </div>
          </div>
          <div className="bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
              style={{
                width: `${
                  totalRepos > 0 ? Math.min(100, (fullstackCount / totalRepos) * 100) : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tecnologias detectadas (package.json) — barra de progresso por % de presença */}
      {topTechs.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">
              Tecnologias detectadas (package.json)
            </h4>
            <p className="text-xs text-gray-400">
              % indica presença entre os repositórios analisados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topTechs.map((tech, idx) => {
              const Icon = getTechIcon(tech.name)
              return (
                <div
                  key={`${tech.name}-${idx}`}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center mb-3">
                    <Icon className="w-6 h-6 text-purple-400 mr-3" />
                    <div>
                      <h5 className="text-white font-semibold">{tech.name}</h5>
                      <p className="text-xs text-gray-400">
                        {Math.round(tech.level)}% dos repositórios usam • {tech.count} de {totalRepos}
                      </p>
                    </div>
                  </div>

                  <ProgressBar
                    percent={tech.level}
                    color={getTechColor(tech.name)}
                    delay={idx * 0.06}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GitHubStats
