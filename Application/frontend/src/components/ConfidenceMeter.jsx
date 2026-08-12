import { motion } from 'framer-motion';

export default function ConfidenceMeter({ confidence = 0, label = 'Confidence' }) {
    const percent = Math.round(confidence * 100);

    const getColor = () => {
        if (percent >= 80) return 'from-emerald-500 to-teal-400';
        if (percent >= 60) return 'from-amber-500 to-yellow-400';
        return 'from-red-500 to-rose-400';
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{label}</span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-bold tabular-nums"
                    style={{
                        background: `linear-gradient(135deg, ${percent >= 80 ? '#22c55e' : percent >= 60 ? '#f59e0b' : '#ef4444'}, ${percent >= 80 ? '#14b8a6' : percent >= 60 ? '#eab308' : '#f43f5e'})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {percent}%
                </motion.span>
            </div>
            <div className="confidence-bar">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className={`confidence-fill bg-gradient-to-r ${getColor()}`}
                />
            </div>
        </div>
    );
}
