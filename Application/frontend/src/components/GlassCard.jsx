import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', glow = '', animate = true, ...props }) {
    const Component = animate ? motion.div : 'div';
    const animProps = animate
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, ease: 'easeOut' },
        }
        : {};

    return (
        <Component
            className={`glass p-6 ${glow} ${className}`}
            {...animProps}
            {...props}
        >
            {children}
        </Component>
    );
}
