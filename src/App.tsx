import { getTechIcon, getTechColor } from './utils/techIcons'
import { useGitHubStats } from './hooks/useGitHubStats'

export default function SkillsSection() {
  const {
    isLoading, error,
    techSkills,                 // tecnologias reais (package.json)
    languagePresence,          // linguagens reais (% de repositórios)
    apiRestCount, crudCount, fullstackCount,
  } = useGitHubStats()

  const topTechs = techSkills.slice(0, 6)   // cards principais com tecnologias

  return (
    <section id="habilidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Minhas <span className="text-purple-400">Habilidades</span></h2>
          <p className="text-gray-300">
            {error ? 'Erro ao carregar dados do GitHub.'
                   : 'Baseado na presença real nos meus repositórios GitHub'}
          </p>
          {isLoading && <div className="text-gray-400 mt-2">Analisando…</div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto mb-6">
          {[{label:'API REST', value: apiRestCount},
            {label:'CRUD', value: crudCount},
            {label:'FULL STACK', value: fullstackCount}].map(({label,value}) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
              <p className="text-xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topTechs.map((skill) => {
            const Icon = getTechIcon(skill.name)
            return (
              <div key={skill.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-4">
                  <Icon className="w-7 h-7 text-purple-400 mr-3" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                    <p className="text-xs text-gray-400">{skill.level}% dos repositórios usam</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${getTechColor(skill.name)} h-full rounded-full`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">{skill.count} repos</div>
              </div>
            )
          })}
        </div>

        {/* Opcional: uma tabela simples das linguagens vistas nos repositórios */}
        <div className="mt-10">
          <h3 className="text-xl text-white mb-3">Linguagens vistas nos repositórios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languagePresence.slice(0, 8).map(lang => (
              <div key={lang.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{lang.name}</span>
                  <span>{lang.percent}% ({lang.repos} repos)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
