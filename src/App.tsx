/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Github,
  Linkedin,
  Mail,
  Code,
  Database,
  Globe,
  Smartphone,
  User,
  MessageCircle,
} from 'lucide-react'

import avatarImg from './assets/img-avatar.jpg'
import { useGitHubStats } from './hooks/useGitHubStats'
import { getTechIcon, getTechColor } from './utils/techIcons'
import About from './pages/About'

type Page = 'home' | 'about'

// tipagem da callback de navegação para evitar "implicit any"
type SetPage = React.Dispatch<React.SetStateAction<Page>>
type NavigationItem = {
  name: string
  href?: string
  action?: (setPage: SetPage) => void
}

type ContactLink = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  external?: boolean
}

const contactLinks: ContactLink[] = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/williansouza19122014', icon: Github, external: true },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/willian-ferreira-souza-b7458769/', icon: Linkedin, external: true },
  { id: 'mail', label: 'Email', href: 'mailto:willianferreira.adm1@gmail.com', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/5516997322808', icon: MessageCircle, external: true },
]

// fallback para quando não houver dados do GitHub
const fallbackSkills = [
  { name: 'JavaScript', level: 90, icon: Code },
  { name: 'React', level: 85, icon: Globe },
  { name: 'Node.js', level: 80, icon: Database },
  { name: 'TypeScript', level: 75, icon: Code },
  { name: 'Python', level: 70, icon: Code },
  { name: 'React Native', level: 65, icon: Smartphone },
]

const App: React.FC = () => {
  const {
    skillsData,
    techSkills,
    isLoading: isLoadingGitHub,
    error: gitHubError,
    apiRestCount,
    fullstackCount,
    crudCount,
    repoCount,
  } = useGitHubStats()

  const [currentPage, setCurrentPage] = React.useState<Page>('home')
  const [showAvatarContacts, setShowAvatarContacts] = React.useState(false)

  // === HABILIDADES: prioriza techSkills -> skillsData -> fallback ===
  const computedBaseSkills =
    techSkills && techSkills.length > 0
      ? techSkills.map((s) => ({ ...s, icon: getTechIcon(s.name) }))
      : skillsData && skillsData.length > 0
      ? skillsData.map((s) => ({ ...s, icon: getTechIcon(s.name) }))
      : fallbackSkills

  const topSkills = computedBaseSkills.slice(0, 6)

  // Destaques
  const capabilityHighlights = [
    { label: 'API REST', value: apiRestCount },
    { label: 'CRUD', value: crudCount },
    { label: 'Full Stack', value: fullstackCount },
  ]

  // menu – sem item de “Projetos”
  const navigationItems: NavigationItem[] = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Habilidades', href: '#habilidades' },
    { name: 'Sobre', action: (setPage) => setPage('about') },
    { name: 'Contato', href: '#contato' },
  ]

  React.useEffect(() => {
    if (currentPage === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  if (currentPage === 'about') {
    return <About onBack={() => setCurrentPage('home')} />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        {/* Avatar lateral */}
        <motion.aside
          initial={{ opacity: 0, x: -30, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="fixed left-4 top-24 z-50"
          onMouseEnter={() => setShowAvatarContacts(true)}
          onMouseLeave={() => setShowAvatarContacts(false)}
        >
          <motion.div
            layout
            initial={{ width: 200 }}
            animate={{ width: showAvatarContacts ? 260 : 200 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col gap-4 bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-4 shadow-lg"
          >
            <motion.div
              animate={showAvatarContacts ? { y: 0 } : { y: [0, -6, 0] }}
              transition={{ repeat: showAvatarContacts ? 0 : Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex items-center gap-3"
            >
              <img
                src={avatarImg}
                alt="Avatar"
                className="w-12 h-12 rounded-full ring-2 ring-purple-500/50 object-cover"
              />
              <div className="leading-tight">
                <div className="text-white font-semibold">Willian Souza</div>
                <div className="text-xs text-gray-300">Desenvolvedor</div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showAvatarContacts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-2"
                >
                  {contactLinks.map((contact) => (
                    <a
                      key={contact.id}
                      href={contact.href}
                      target={contact.external ? '_blank' : undefined}
                      rel={contact.external ? 'noreferrer' : undefined}
                      className="flex items-center gap-3 rounded-xl bg-white/5 hover:bg-purple-500/25 text-gray-200 hover:text-white transition-all duration-200 px-3 py-2"
                    >
                      <contact.icon className="w-4 h-4 text-purple-300" />
                      <span className="text-sm">{contact.label}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.aside>

        {/* Navbar */}
        <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-white">
                &lt;Dev/&gt;
              </motion.div>

              <div className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      if (item.action) {
                        item.action(setCurrentPage)
                        return
                      }
                      if (item.href) {
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section id="inicio" className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Code className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                  Desenvolvedor
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    JavaScript
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Transformo ideias em soluções digitais. Foco em desempenho, código limpo e ótima experiência para o usuário.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button
                  onClick={() => document.querySelector('#habilidades')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Ver habilidades
                </button>

                <button
                  onClick={() => setCurrentPage('about')}
                  className="flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Sobre mim</span>
                </button>

                <div className="flex space-x-4">
                  {contactLinks.map((contact) => (
                    <a
                      key={`hero-${contact.id}`}
                      href={contact.href}
                      target={contact.external ? '_blank' : undefined}
                      rel={contact.external ? 'noreferrer' : undefined}
                      className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                    >
                      <contact.icon className="w-6 h-6 text-white" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Habilidades */}
        <section id="habilidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Minhas <span className="text-purple-400">Habilidades</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {gitHubError || (techSkills.length === 0 && skillsData.length === 0)
                  ? 'Tecnologias e ferramentas que domino para criar soluções eficientes'
                  : techSkills.length > 0
                  ? 'Baseado na presença das tecnologias nos meus repositórios GitHub'
                  : 'Baseado na distribuição de bytes por linguagem nos repositórios'}
              </p>

              {isLoadingGitHub && (
                <div className="flex items-center justify-center mb-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mr-3" />
                  <span className="text-gray-300">Analisando repositórios do GitHub...</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Stack principal</h3>
                  <p className="text-sm text-gray-300">Principais tecnologias identificadas nos repositórios</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  {capabilityHighlights.map(({ label, value }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                      <p className="text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topSkills.map((skill: any, index) => (
                  <div key={skill.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <skill.icon className="w-7 h-7 text-purple-400 mr-3" />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                        <p className="text-xs text-gray-400">
                          {'bytes' in skill
                            ? `${(Number(skill.bytes) / 1024).toFixed(1)}KB mapeados`
                            : `${skill.level}% dos repositórios usam`}
                        </p>
                        {'count' in skill && repoCount > 0 && (
                          <p className="text-[11px] text-gray-500">
                            {skill.count} de {repoCount} repositórios
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-gray-700/60 rounded-full h-2.5 mb-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-r ${getTechColor(skill.name)} h-full rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Vamos <span className="text-purple-400">Conversar?</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="mailto:willianferreira.adm1@gmail.com"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Enviar email</span>
                </a>
                <div className="flex space-x-4">
                  {contactLinks
                    .filter((contact) => contact.id !== 'mail')
                    .map((contact) => (
                      <a
                        key={`contact-${contact.id}`}
                        href={contact.href}
                        target={contact.external ? '_blank' : undefined}
                        rel={contact.external ? 'noreferrer' : undefined}
                        className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                      >
                        <contact.icon className="w-6 h-6 text-white" />
                      </a>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">&copy; 2024 Todos os direitos reservados.</p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  )
}

export default App
