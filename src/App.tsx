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
  Star,
  GitFork,
  Calendar,
  User,
  ExternalLink,
  MessageCircle
} from 'lucide-react'

import avatarImg from './assets/img-avatar.jpg'
import { useGitHubStats } from './hooks/useGitHubStats'
import { useGitHubProjects } from './hooks/useGitHubProjects'
import { getTechIcon, getTechColor } from './utils/techIcons'
import About from './pages/About'

type Page = 'home' | 'about'

type NavigationItem = {
  name: string
  href?: string
  action?: (setPage: (page: Page) => void) => void
}

type ContactLink = {
  id: string
  label: string
  href: string
  icon: LucideIcon
  external?: boolean
}

const contactLinks: ContactLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/williansouza19122014',
    icon: Github,
    external: true
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/willian-ferreira-souza-b7458769/',
    icon: Linkedin,
    external: true
  },
  {
    id: 'mail',
    label: 'Email',
    href: 'mailto:willianferreira.adm1@gmail.com',
    icon: Mail,
    external: false
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/5516997322808',
    icon: MessageCircle,
    external: true
  }
]

const fallbackSkills = [
  { name: 'JavaScript', level: 90, icon: Code },
  { name: 'React', level: 85, icon: Globe },
  { name: 'Node.js', level: 80, icon: Database },
  { name: 'TypeScript', level: 75, icon: Code },
  { name: 'Python', level: 70, icon: Code },
  { name: 'React Native', level: 65, icon: Smartphone }
]

const fallbackProjects = [
  {
    id: 1,
    title: 'Sistema de Gerenciamento',
    description: 'Sistema completo para gerenciamento de clientes e vendas com dashboard interativo.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: '#',
    demo: null,
    categories: ['frontend', 'backend', 'fullstack'],
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    lastUpdate: '2024-01-15',
    size: 1024
  },
  {
    id: 2,
    title: 'E-commerce Responsivo',
    description: 'Loja virtual moderna com carrinho de compras e painel administrativo.',
    technologies: ['React', 'Stripe', 'Firebase', 'Tailwind CSS'],
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
    github: '#',
    demo: null,
    categories: ['frontend'],
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    lastUpdate: '2024-01-10',
    size: 2048
  }
]

const navigationItems: NavigationItem[] = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Projetos', href: '#projetos' },
  { name: 'Habilidades', href: '#habilidades' },
  { name: 'Sobre', action: (setPage) => setPage('about') },
  { name: 'Contato', href: '#contato' }
]

const App: React.FC = () => {
  const {
    // IMPORTANTE: agora também trazemos techSkills
    skillsData,
    techSkills,
    isLoading: isLoadingGitHub,
    error: gitHubError,
    apiRestCount,
    fullstackCount,
    crudCount
  } = useGitHubStats()

  const {
    projects: githubProjects,
    isLoading: isLoadingProjects,
    error: projectsError
  } = useGitHubProjects()

  const [currentPage, setCurrentPage] = React.useState<Page>('home')
  const [activeFilter, setActiveFilter] = React.useState('todos')
  const [showAvatarContacts, setShowAvatarContacts] = React.useState(false)

  // === PROJETOS (inalterado) ===
  const displayProjects = projectsError || githubProjects.length === 0 ? fallbackProjects : githubProjects
  const filteredProjects =
    activeFilter === 'todos'
      ? displayProjects
      : displayProjects.filter((project) => (project.categories ?? []).includes(activeFilter))

  // === HABILIDADES: prioriza techSkills -> skillsData -> fallback ===
  const computedBaseSkills =
    techSkills && techSkills.length > 0
      ? techSkills.map((s) => ({ ...s, icon: getTechIcon(s.name) }))
      : (skillsData && skillsData.length > 0
          ? skillsData.map((s) => ({ ...s, icon: getTechIcon(s.name) }))
          : fallbackSkills)

  const topSkills = computedBaseSkills.slice(0, 6)

  // Destaques (inalterado)
  const capabilityHighlights = [
    { label: 'API REST', value: apiRestCount },
    { label: 'CRUD', value: crudCount },
    { label: 'Full Stack', value: fullstackCount }
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
                  onClick={() => document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Ver projetos
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

        <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Projetos <span className="text-purple-400">Reais</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                {projectsError
                  ? 'Não foi possível carregar os projetos do GitHub. Confira os destaques abaixo.'
                  : `${filteredProjects.length} projetos carregados diretamente do GitHub.`}
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['todos', 'frontend', 'backend', 'fullstack', 'mobile'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {project.stars > 0 && (
                        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-white text-xs">{project.stars}</span>
                        </div>
                      )}
                      {project.forks > 0 && (
                        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                          <GitFork className="w-3 h-3 text-blue-400" />
                          <span className="text-white text-xs">{project.forks}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      <span className="text-xs text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.lastUpdate}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                        >
                          <Github className="w-5 h-5" />
                          <span>Codigo</span>
                        </a>
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                          >
                            <ExternalLink className="w-5 h-5" />
                            <span>Demo</span>
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {(project.size / 1024).toFixed(1)}MB
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && !isLoadingProjects && (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  Nenhum projeto encontrado para esta categoria.
                </p>
              </div>
            )}
          </div>
        </section>

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
                  : 'Baseado na análise automática dos meus repositórios GitHub'}
              </p>

              {isLoadingGitHub && (
                <div className="flex items-center justify-center mb-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mr-3" />
                  <span className="text-gray-300">Analisando repositórios do GitHub...</span>
                </div>
              )}

              {gitHubError && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    Usando dados estáticos. Configure seu usuário GitHub para ativar a análise automática.
                  </p>
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
                    <div
                      key={label}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center"
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                      <p className="text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topSkills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center mb-4">
                      {/* skill.icon vem de getTechIcon para techSkills/skillsData; no fallback já está no objeto */}
                      <skill.icon className="w-7 h-7 text-purple-400 mr-3" />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                        <p className="text-xs text-gray-400">{skill.level}% do codigo analisado</p>
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

                    {'bytes' in skill && (
                      <div className="text-xs text-gray-400">
                        {(Number((skill as any).bytes) / 1024).toFixed(1)}KB mapeados
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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
                        className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors	duration-300"
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
