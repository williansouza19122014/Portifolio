
import {Code, Globe, Database, Smartphone, Server, Cpu, FileCode, Layers, Terminal, Zap} from 'lucide-react'

export const getTechIcon = (techName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    // Frontend
    'JavaScript': Code,
    'TypeScript': Code,
    'HTML': Globe,
    'CSS': Globe,
    'React': Globe,
    'Vue': Globe,
    'Angular': Globe,
    'Svelte': Globe,
    
    // Backend
    'Python': Server,
    'Java': Server,
    'C#': Server,
    'C++': Cpu,
    'C': Cpu,
    'Go': Server,
    'Rust': Cpu,
    'PHP': Server,
    'Ruby': Server,
    'Node.js': Server,
    
    // Mobile
    'Swift': Smartphone,
    'Kotlin': Smartphone,
    'Dart': Smartphone,
    'Objective-C': Smartphone,
    
    // Database
    'SQL': Database,
    'PostgreSQL': Database,
    'MySQL': Database,
    'MongoDB': Database,
    
    // DevOps/Tools
    'Shell': Terminal,
    'Bash': Terminal,
    'PowerShell': Terminal,
    'Dockerfile': Layers,
    'YAML': FileCode,
    'JSON': FileCode,
    'XML': FileCode,
    
    // Other
    'Jupyter Notebook': FileCode,
    'Markdown': FileCode,
    'SCSS': Globe,
    'Less': Globe,
    'Sass': Globe
  }

  return iconMap[techName] || Zap
}

export const getTechColor = (techName: string): string => {
  const colorMap: { [key: string]: string } = {
    'JavaScript': 'from-yellow-400 to-yellow-600',
    'TypeScript': 'from-blue-400 to-blue-600',
    'Python': 'from-green-400 to-green-600',
    'Java': 'from-orange-400 to-orange-600',
    'React': 'from-cyan-400 to-cyan-600',
    'Vue': 'from-emerald-400 to-emerald-600',
    'Angular': 'from-red-400 to-red-600',
    'HTML': 'from-orange-500 to-red-500',
    'CSS': 'from-blue-500 to-purple-500',
    'PHP': 'from-purple-400 to-purple-600',
    'C#': 'from-purple-500 to-indigo-500',
    'Go': 'from-cyan-500 to-blue-500',
    'Rust': 'from-orange-600 to-red-600',
    'Swift': 'from-orange-500 to-red-500',
    'Kotlin': 'from-purple-500 to-pink-500'
  }

  return colorMap[techName] || 'from-purple-500 to-pink-500'
}


