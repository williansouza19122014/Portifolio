import avatarImg from './assets/img-avatar.jpg'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Github, Linkedin, Mail, Code, Database, Globe, Smartphone, Star, GitFork, Calendar, User, ExternalLink} from 'lucide-react'
import { useGitHubStats } from './hooks/useGitHubStats'
import { useGitHubProjects } from './hooks/useGitHubProjects'
import { getTechIcon, getTechColor } from './utils/techIcons'
import About from './pages/About'

function App() {
  const {
    skillsData,
    isLoading: isLoadingGitHub,
    error: gitHubError,
    apiRestCount,
    fullstackCount,
    crudCount
  } = useGitHubStats()
  const { projects: githubProjects, isLoading: isLoadingProjects, error: projectsError } = useGitHubProjects()
  const [currentPage, setCurrentPage] = React.useState<'home' | 'about'>('home')

  // Fallback para habilidades estÃ¡ticas caso GitHub API falhe
  const fallbackSkills = [
    { name: "JavaScript", level: 90, icon: Code },
    { name: "React", level: 85, icon: Globe },
    { name: "Node.js", level: 80, icon: Database },
    { name: "TypeScript", level: 75, icon: Code },
    { name: "Python", level: 70, icon: Code },
    { name: "React Native", level: 65, icon: Smartphone }
  ]

  // Projetos fallback caso GitHub API falhe
  const fallbackProjects = [
    {
      id: 1,
      title: "Sistema de Gerenciamento",
      description: "Sistema completo para gerenciamento de clientes e vendas com dashboard interativo",
      technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"],
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600",
      github: "#",
      demo: null,
      categories: ["frontend", "backend", "fullstack"],
      stars: 0,
      forks: 0,
      language: "TypeScript",
      lastUpdate: "2024-01-15",
      size: 1024
    },
    {
      id: 2,
      title: "E-commerce Responsivo",
      description: "Loja virtual moderna com carrinho de compras, pagamento integrado e painel administrativo",
      technologies: ["React", "Stripe", "Firebase", "Tailwind CSS"],
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600",
      github: "#",
      demo: null,
      categories: ["frontend"],
      stars: 0,
      forks: 0,
      language: "JavaScript",
      lastUpdate: "2024-01-10",
      size: 2048
    }
  ]

  // Usar dados do GitHub se disponíveis, senão usar fallback
  const displaySkills = gitHubError || skillsData.length === 0 
    ? fallbackSkills 
    : skillsData.map(skill => ({
        ...skill,
        icon: getTechIcon(skill.name)
      }))

  const displayProjects = projectsError || githubProjects.length === 0 
    ? fallbackProjects 
    : githubProjects

  const topSkills = (gitHubError ? fallbackSkills : displaySkills).slice(0, 6)
  const capabilityHighlights = [
    { label: 'API REST', value: apiRestCount },
    { label: 'CRUD', value: crudCount },
    { label: 'Full Stack', value: fullstackCount }
  ]

  const [activeFilter, setActiveFilter] = React.useState('todos')

  const filteredProjects = activeFilter === 'todos' 
    ? displayProjects 
    : displayProjects.filter(project => (project.categories ?? []).includes(activeFilter))

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
        {/* Navigation */}
                {/* Floating Avatar */}
        <motion.aside
          initial={{ opacity: 0, x: -30, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="fixed left-4 top-24 z-50"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="flex items-center gap-3 bg-black/40 border border-white/10 backdrop-blur-md rounded-full pr-4 pl-2 py-2 shadow-lg"
          >
            <img src={avatarImg} alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-purple-500/50 object-cover" />
            <div className="leading-tight">
              <div className="text-white font-semibold">Willian Souza</div>
              <div className="text-xs text-gray-300">Full Stack Developer • React | Node</div>
            </div>
          </motion.div>
        </motion.aside>
        <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white"
              >
                &lt;Dev/&gt;
              </motion.div>
              
              <div className="hidden md:flex space-x-8">
                {[
                  { name: 'Iní­cio', href: '#iní­cio' },
                  { name: 'Projetos', href: '#projetos' },
                  { name: 'Habilidades', href: '#habilidades' },
                  { name: 'Sobre', action: () => setCurrentPage('about') },
                  { name: 'Contato', href: '#contato' }
                ].map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={item.action || (() => document.querySelector(item.href!)?.scrollIntoView({ behavior: 'smooth' }))}
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

        {/* Hero Section */}
        <section id="inÃ­cio" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
                  Gosto de transformar ideias em projetos reais. Trabalho com desenvolvimento de software, 
                  sempre buscando criar experiências simples, rápidas e agradáveis para o usuário.
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
                  Ver Projetos
                </button>
                
                <button
                  onClick={() => setCurrentPage('about')}
                  className="flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Sobre Mim</span>
                </button>
                
                <div className="flex space-x-4">
                  <a href="https://github.com/williansouza19122014" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300">
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a href="https://www.linkedin.com/in/willian-ferreira-souza-b7458769/" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300">
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                  <a href="mailto:willianferreira.adm1@gmail.com" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projetos" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Buttons */}
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
                    
                    {/* Stats do projeto */}
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
                          <span>Código</span>
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

        {/* Skills Section */}
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
                {gitHubError || skillsData.length === 0
                  ? 'Tecnologias e ferramentas que domino para criar soluções eficientes'
                  : 'Baseado na análise automática dos meus repositórios GitHub'
                }
              </p>

              {/* Status da análise automáticaÃ¡lise automÃ¡tica */}
              {isLoadingGitHub && (
                <div className="flex items-center justify-center mb-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mr-3"></div>
                  <span className="text-gray-300">Analisando repositórios GitHub...</span>
                </div>
              )}

              {gitHubError && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                  <p className="text-yellow-300 text-sm">
                    Usando dados estaticos. Configure seu usuario GitHub para análise automática. Configure seu usuário GitHub para análise automática.
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
                      <skill.icon className="w-7 h-7 text-purple-400 mr-3" />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{skill.name}</h4>
                        <p className="text-xs text-gray-400">{skill.level}% do código analisado</p>
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
                        {(skill.bytes / 1024).toFixed(1)}KB mapeados
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>        
        {/* Contact Section */}
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
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Estou sempre aberto a novas oportunidades e projetos interessantes. 
                Entre em contato para discutirmos como posso ajudar!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a
                  href="mailto:willianferreira.adm1@gmail.com"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Enviar Email</span>
                </a>
                
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a
                    href="#"
                    className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              © 2024 Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  )
}

export default App





// AVATAR FLOATING ADDED
