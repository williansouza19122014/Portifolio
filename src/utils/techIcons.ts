import React from 'react'
import {
  Code, Globe, Database, Smartphone, Server, Cpu, FileCode,
  Layers, Terminal, Zap, Box, GitBranch, Package
} from 'lucide-react'

export const getTechIcon = (name: string) => {
  const Map: Record<string, React.ComponentType<{ className?: string }>> = {
    // Linguagens
    JavaScript: Code,
    TypeScript: Code,
    HTML: Globe,
    CSS: Globe,

    // Node / backend
    'Node.js': Server,
    Express: Server,
    Fastify: Server,
    Koa: Server,
    'NestJS': Server,

    // Front libs
    React: Globe,
    'React Router': Globe,
    'Framer Motion': Box,
    'Lucide': Package,
    Vite: Zap,

    // DB/ORM
    MongoDB: Database,
    Prisma: Database,

    // Lint/build
    ESLint: GitBranch,
    Prettier: FileCode,
    PostCSS: FileCode,
    Tailwind: FileCode,
    'Tailwind CSS': FileCode,
    Autoprefixer: FileCode,
    Octokit: Package,
    'Vercel Functions': Layers,

    // Outros
    Python: Server,
    Java: Server,
    PHP: Server,
    Go: Server,
    Rust: Cpu,
    Swift: Smartphone,
    Kotlin: Smartphone,
    Shell: Terminal,
    Dockerfile: Layers,
  }
  return Map[name] || Zap
}

export const getTechColor = (name: string): string => {
  const C: Record<string, string> = {
    JavaScript: 'from-yellow-400 to-yellow-600',
    TypeScript: 'from-blue-400 to-blue-600',
    HTML: 'from-orange-500 to-red-500',
    CSS: 'from-blue-500 to-indigo-500',

    'Node.js': 'from-emerald-400 to-teal-600',
    React: 'from-cyan-400 to-cyan-600',
    Vite: 'from-violet-400 to-fuchsia-600',

    'React Router': 'from-rose-400 to-pink-600',
    'Framer Motion': 'from-pink-400 to-rose-600',

    MongoDB: 'from-green-500 to-emerald-700',
    Prisma: 'from-slate-400 to-slate-600',
    ESLint: 'from-indigo-400 to-indigo-600',
    Prettier: 'from-amber-400 to-amber-600',
    'Tailwind CSS': 'from-sky-400 to-cyan-600',
    PostCSS: 'from-red-400 to-rose-600',
    Autoprefixer: 'from-lime-400 to-lime-600',
  }
  return C[name] || 'from-purple-500 to-pink-500'
}
