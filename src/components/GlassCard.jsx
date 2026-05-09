import { motion } from 'framer-motion';
export const GlassCard = ({ children, className = '', onClick }) => (
    <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`glass p-4 ${className}`}
        onClick={onClick}
    >{children}</motion.div>
);

export const GlassButton = ({ children, className = '', onClick }) => (
    <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`glass-btn px-4 py-2 rounded-xl text-sm font-medium text-white ${className}`}
        onClick={onClick}
    >{children}</motion.button>
);