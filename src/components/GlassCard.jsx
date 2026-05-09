import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', onClick, animate = false, delay = 0 }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    initial={animate ? { opacity: 0, y: 12 } : false}
    animate={animate ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.35, delay, type: "spring", stiffness: 220, damping: 22 }}
    className={`glass ${className}`}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </motion.div>
);

export const GlassButton = ({ children, className = '', onClick, variant = 'default' }) => {
  const base = "glass-btn px-4 py-2.5 rounded-xl text-sm font-medium transition-all";
  const variants = {
    default: `${base} text-white`,
    primary: `${base} text-white bg-accent/25 border-accent/50 font-semibold`,
    danger: `${base} text-danger border-danger/30`
  };
  
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`${variants[variant]} ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </motion.button>
  );
};