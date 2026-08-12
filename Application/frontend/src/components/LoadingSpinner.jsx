import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

export default function LoadingSpinner({ text = 'Analyzing...' }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-6"
        >
            {/* Pulsing rings */}
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                    className="absolute inset-2 rounded-full border-2 border-teal-400/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                />
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-purple-500/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                        <Scan className="w-8 h-8 text-indigo-400" />
                    </motion.div>
                </div>
            </div>

            {/* Text */}
            <div className="text-center">
                <motion.p
                    className="text-lg font-semibold gradient-text"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {text}
                </motion.p>
                <p className="text-sm text-slate-500 mt-1">Running multispectral AI analysis</p>
            </div>
        </motion.div>
    );
}
