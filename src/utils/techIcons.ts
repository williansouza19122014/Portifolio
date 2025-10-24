// src/utils/techIcons.ts
import type { ComponentType } from 'react'
import {
  Code,
  Globe,
  Database,
  Smartphone,
  Server,
  Cpu,
  FileCode,
  Layers,
  Terminal,
  Zap,
  Wrench,
  Box,
  Cloud,
  Shield
} from 'lucide-react'

/**
 * Ícones por tecnologia/linguagem.
 * As chaves devem combinar com os names normalizados do backend.
 */
const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  // ----- Linguagens / Web Core -----
  JavaScript: Code,
  TypeScript: Code,
  HTML: Globe,
  CSS: Globe,
  'Jupyter Notebook': FileCode,
  Markdown: FileCode,
  SCSS: Globe,
  Less: Globe,
  Sass: Globe,

  // ----- Frontend libs/tools -----
  React: Globe,
  'React Router': Globe,
  Vite: Zap,
  'Tailwind CSS': Layers,
  'Framer Motion': Zap,
  Lucide: Wrench,
  Axios: Zap,

  // ----- Backend / Server / Node -----
  'Node.js': Server,
  Express: Server,
  Octokit: Code,
  ESLint: Shield,
  Prettier: Wrench,
  'Vercel Functions': Cloud,

  // ----- Banco de dados -----
  SQL: Database,
  PostgreSQL: Database,
  MySQL: Database,
  MongoDB: Database,

  // ----- Outras linguagens -----
  Python: Server,
  Java: Server,
  'C#': Server,
  'C++': Cpu,
  C: Cpu,
  Go: Server,
  Rust: Cpu,
  PHP: Server,
  Ruby: Server,
  Kotlin: Smartphone,
  Scala: Server,
  Swift: Smartphone,

  // ----- DevOps / Script -----
  Shell: Terminal,
  Bash: Terminal,
  PowerShell: Terminal,
  Dockerfile: Layers,
  YAML: FileCode,
  JSON: FileCode,
  XML: FileCode,

  // ----- Mobile / Cross -----
  'React Native': Smartphone,
  Flutter: Smartphone,

  // ----- Genéricos / outros -----
  'Design System': Box,
}

/**
 * Paleta de cores (gradientes Tailwind) por tecnologia.
 * Use nomes iguais aos do backend.
 */
const COLOR_MAP: Record<string, string> = {
  // Linguagens / web
  JavaScript: 'from-yellow-400 to-yellow-600',
  TypeScript: 'from-blue-400 to-blue-600',
  HTML: 'from-orange-500 to-red-500',
  CSS: 'from-blue-500 to-purple-500',
  SCSS: 'from-pink-500 to-rose-600',
  Sass: 'from-pink-500 to-rose-600',
  Less: 'from-teal-500 to-emerald-600',

  // Frontend
  React: 'from-cyan-400 to-cyan-600',
  'React Router': 'from-cyan-400 to-cyan-600',
  Vite: 'from-indigo-400 to-violet-600',
  'Tailwind CSS': 'from-teal-400 to-emerald-600',
  'Framer Motion': 'from-pink-400 to-rose-600',
  Lucide: 'from-amber-400 to-orange-600',
  Axios: 'from-sky-400 to-blue-600',

  // Backend / tooling
  'Node.js': 'from-lime-500 to-emerald-600',
  Express: 'from-slate-500 to-gray-700',
  Octokit: 'from-sky-500 to-indigo-600',
  ESLint: 'from-indigo-400 to-purple-600',
  Prettier: 'from-fuchsia-400 to-pink-600',
  'Vercel Functions': 'from-zinc-400 to-neutral-700',

  // DB
  SQL: 'from-blue-400 to-indigo-600',
  PostgreSQL: 'from-sky-500 to-blue-700',
  MySQL: 'from-cyan-500 to-blue-600',
  MongoDB: 'from-emerald-400 to-green-600',

  // Outras linguagens
  Python: 'from-green-400 to-green-600',
  Java: 'from-orange-400 to-orange-600',
  'C#': 'from-purple-500 to-indigo-600',
  'C++': 'from-indigo-500 to-blue-700',
  C: 'from-slate-500 to-gray-600',
  Go: 'from-cyan-500 to-blue-600',
  Rust: 'from-orange-600 to-red-700',
  PHP: 'from-purple-400 to-purple-600',
  Ruby: 'from-rose-500 to-red-600',
  Kotlin: 'from-purple-500 to-pink-500',
  Scala: 'from-red-500 to-orange-600',
  Swift: 'from-orange-500 to-red-500',

  // DevOps / script
  Shell: 'from-emerald-500 to-green-700',
  Bash: 'from-emerald-500 to-green-700',
  PowerShell: 'from-blue-500 to-indigo-700',
  Dockerfile: 'from-sky-500 to-blue-700',
  YAML: 'from-amber-400 to-orange-600',
  JSON: 'from-amber-400 to-orange-600',
  XML: 'from-amber-400 to-orange-600',

  // Mobile
  'React Native': 'from-sky-500 to-indigo-600',
  Flutter: 'from-sky-500 to-blue-700',
}

/** Ícone para a tecnologia (fallback = Zap) */
export const getTechIcon = (techName: string) => {
  return ICON_MAP[techName] ?? Zap
}

/** Gradiente Tailwind para a tecnologia (fallback roxinho bonito) */
export const getTechColor = (techName: string): string => {
  return COLOR_MAP[techName] ?? 'from-purple-500 to-pink-500'
}
