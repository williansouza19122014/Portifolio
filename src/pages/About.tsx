
import React from 'react'
import { motion } from 'framer-motion'
import {ArrowLeft, Code, Heart, Target, Users, Coffee, BookOpen, Zap, Plane} from 'lucide-react'

interface AboutProps {
  onBack: () => void
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  const timeline = [
    {
      year: 'jun/2025 - presente',
      title: 'Desenvolvedor Frontend',
      description: 'Focando em React, TypeScript, JavaScrip e tecnologias modernas para criar soluções web inovadoras.',
      icon: Code
    },
    {
      year: 'jan/2025 - mai/2025',
      title: 'Início da Jornada',
      description: 'Começei meus estudos em programação, fui imerço em um mundo totalmente novo, com React.js TypesScript e outras tecnologias.',
      icon: BookOpen
    },
    {
      year: 'jun/2022 - dez/2022',
      title: 'Breve introdução a Python',
      description: 'Exploração inicial da linguagem Python, entendendo seus conceitos básicos e aplicabilidades.',
      icon: Zap
    },
    {
      year: 'jun/2022 - dez/2022',
      title: 'Primeiros Passos',
      description: 'Primeiros passos na área de desenvolvimento com VBA Excel, criando pequenas automações para otimizar tarefas diárias.',
      icon: Plane
    }
  ]

  const values = [
    {
      icon: Code,
      title: 'Código Limpo',
      description: 'Acredito que código bem escrito é a base de qualquer projeto de sucesso.'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalho em equipe e comunicação clara são essenciais para entregar resultados.'
    },
    {
      icon: Target,
      title: 'Foco no Resultado',
      description: 'Cada linha de código deve agregar valor e resolver problemas reais.'
    },
    {
      icon: Heart,
      title: 'Paixão por Aprender',
      description: 'A tecnologia evolui rapidamente, e eu evoluo junto com ela.'
    }, 
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Portfólio</span>
          </button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <Code className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Olá, eu sou
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Willian Ferreira de Souza
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Estou no começo da minha jornada como desenvolvedor, aprendendo, errando, acertando — e codando todos os dias. 
            Tenho me aventurado com React, Node.js e outras tecnologias que me fazem enxergar o quanto esse universo é incrível.
          </p>
        </motion.div>

        {/* Biografia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Heart className="w-8 h-8 text-purple-400 mr-3" />
            Minha História
          </h2>
          
          <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
              Olá eu sou o Willian, e minha jornada na tecnologia começou por curiosidade — aquela vontade de entender como as coisas funcionam por trás das telas. 
              Aos poucos, essa curiosidade virou paixão e me levou a iniciar meus estudos em desenvolvimento de software em 2025.
            </p>
            <p>
              Desde então, tenho me dedicado a aprender e praticar diariamente, desenvolvendo projetos pessoais e estudando React, 
              Node.js e outras tecnologias modernas. Cada novo desafio é uma oportunidade de evoluir, errar, aprender e melhorar o que fiz ontem.
            </p>
            <p>
              Ainda estou no início da minha carreira e busco minha primeira oportunidade como desenvolvedor, para aplicar na prática o que venho 
              estudando e continuar crescendo com uma equipe experiente. Acredito que a melhor tecnologia é aquela que resolve problemas reais de 
              forma simples e eficiente — e é isso que quero aprender a fazer bem.
            </p>
            <p>
              Quando não estou estudando ou codando, gosto de explorar novas ideias, entender boas práticas e aprender com quem já trilhou esse caminho.
            </p>
            <p>
              Mais do que começar uma carreira, quero construir uma trajetória sólida e duradoura na tecnologia.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Minha <span className="text-purple-400">Trajetória</span>
          </h2>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 flex-grow">
                  <div className="flex items-center mb-2">
                    <span className="text-purple-400 font-bold text-lg mr-4">{item.year}</span>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Meus <span className="text-purple-400">Valores</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <value.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Curiosidades sobre mim
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Coffee className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-1">Café por Dia</h3>
              <p className="text-gray-300">≈ 4 xícaras</p>
            </div>
            <div>
              <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-1">Linguagem Favorita</h3>
              <p className="text-gray-300"> JavaScript/ TypeScript/ React.js</p>
            </div>
            <div>
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-1">Sempre Aprendendo</h3>
              <p className="text-gray-300">Novas tecnologias como Node.js/ Next.js/ Nest.js</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-xl text-gray-300 mb-6">
            Interessado em trabalhar juntos?
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Vamos Conversar!
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default About
