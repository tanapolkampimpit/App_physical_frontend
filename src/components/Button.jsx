import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500/10'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
