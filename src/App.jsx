import { Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Info, Layout, Zap, Package, ArrowRight } from 'lucide-react'
import { cn } from './lib/utils'

// Simple Home Component
const HomePage = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center"
  >
    <div className="p-4 bg-blue-500/10 rounded-full mb-6">
      <Zap className="w-12 h-12 text-blue-400" />
    </div>
    <h2 className="text-4xl font-bold mb-4">Welcome Home</h2>
    <p className="text-slate-400 text-center max-w-md mb-8">
      This is your new project setup with React Router, Lucide Icons, and Framer Motion.
    </p>
    <Link 
      to="/about" 
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full font-medium transition-all group"
    >
      Go to About <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
)

// Simple About Component
const AboutPage = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex flex-col items-center"
  >
    <div className="p-4 bg-purple-500/10 rounded-full mb-6">
      <Info className="w-12 h-12 text-purple-400" />
    </div>
    <h2 className="text-4xl font-bold mb-4">About This App</h2>
    <p className="text-slate-400 text-center max-w-md mb-8">
      Everything you need to build a premium web application is already installed and configured.
    </p>
    <Link to="/" className="text-blue-400 hover:underline">Back to Home</Link>
  </motion.div>
)

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Layout className="w-6 h-6 text-blue-500" />
            <span>App<span className="text-blue-500">Kayapat</span></span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <Info className="w-4 h-4" /> About
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        
        {/* Installed Tools Grid */}
        <div className="mt-32 w-full">
          <h3 className="text-center text-slate-500 uppercase tracking-widest text-sm font-semibold mb-12">Installed Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'React Router', icon: Layout, desc: 'Dynamic routing for your app' },
              { name: 'Lucide Icons', icon: Package, desc: 'Beautiful & consistent icons' },
              { name: 'Framer Motion', icon: Zap, desc: 'Production-ready animations' }
            ].map((tool, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-colors group">
                <tool.icon className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold mb-2">{tool.name}</h4>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App


