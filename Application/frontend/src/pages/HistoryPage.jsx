import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, getHistoryDetail, deleteHistory } from '../services/api';
import GlassCard from '../components/GlassCard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import {
    History,
    Trash2,
    ChevronRight,
    X,
    Calendar,
    Bug,
    Shield,
    Droplets,
    Sprout,
    Thermometer,
    FileSearch,
    Loader2,
} from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await getHistory();
            setHistory(res.data.history || []);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (id) => {
        setDetailLoading(true);
        try {
            const res = await getHistoryDetail(id);
            const data = res.data;
            // Parse recommendation JSON if it's a string
            if (data.recommendation?.recommendation_text) {
                try {
                    data.recommendation.parsed = JSON.parse(data.recommendation.recommendation_text);
                } catch {
                    data.recommendation.parsed = null;
                }
            }
            setSelectedDetail(data);
        } catch (err) {
            console.error('Failed to fetch detail:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Delete this prediction?')) return;
        setDeleting(id);
        try {
            await deleteHistory(id);
            setHistory((prev) => prev.filter((p) => p.id !== id));
            if (selectedDetail?.id === id) setSelectedDetail(null);
        } catch (err) {
            console.error('Failed to delete:', err);
        } finally {
            setDeleting(null);
        }
    };

    const mitigationSections = [
        { key: 'cause', icon: Bug, label: 'Cause', gradient: 'from-red-500 to-rose-500' },
        { key: 'prevention', icon: Shield, label: 'Prevention', gradient: 'from-indigo-500 to-blue-500' },
        { key: 'treatment', icon: Droplets, label: 'Treatment', gradient: 'from-teal-500 to-emerald-500' },
        { key: 'fertilizer_advice', icon: Sprout, label: 'Fertilizer', gradient: 'from-amber-500 to-yellow-500' },
        { key: 'environmental_conditions', icon: Thermometer, label: 'Environment', gradient: 'from-violet-500 to-purple-500' },
    ];

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold font-['Outfit'] text-white">
                        Prediction <span className="gradient-text">History</span>
                    </h1>
                    <p className="text-slate-500 mt-1">View and manage your past analyses</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : history.length === 0 ? (
                    <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-4">
                            <FileSearch className="w-9 h-9 text-indigo-500/30" />
                        </div>
                        <p className="text-slate-400 font-medium text-lg">No predictions yet</p>
                        <p className="text-sm text-slate-600 mt-1">Go to Dashboard to analyze your first plant image</p>
                    </GlassCard>
                ) : (
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* List */}
                        <div className="lg:col-span-2 space-y-3">
                            {history.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => handleViewDetail(item.id)}
                                    className={`glass p-4 cursor-pointer transition-all duration-200 group ${selectedDetail?.id === item.id
                                            ? '!border-indigo-500/30 !bg-indigo-500/5'
                                            : 'hover:!border-white/12'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-white truncate">
                                                {item.disease_name?.replace(/_/g, ' ')}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                                <span
                                                    className={`text-xs font-medium tabular-nums ${item.confidence >= 0.8
                                                            ? 'text-emerald-400'
                                                            : item.confidence >= 0.6
                                                                ? 'text-amber-400'
                                                                : 'text-red-400'
                                                        }`}
                                                >
                                                    {(item.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                disabled={deleting === item.id}
                                                className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                {deleting === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Detail Panel */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {detailLoading ? (
                                    <GlassCard key="loading" className="flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                    </GlassCard>
                                ) : selectedDetail ? (
                                    <motion.div
                                        key={selectedDetail.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <GlassCard glow="glow-teal">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-bold text-white font-['Outfit']">
                                                    {selectedDetail.disease_name?.replace(/_/g, ' ')}
                                                </h2>
                                                <button
                                                    onClick={() => setSelectedDetail(null)}
                                                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <ConfidenceMeter confidence={selectedDetail.confidence} />

                                            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(selectedDetail.created_at).toLocaleString()}
                                            </div>

                                            {selectedDetail.image_url && (
                                                <img
                                                    src={selectedDetail.image_url}
                                                    alt="Detection"
                                                    className="w-full rounded-xl mt-4 object-contain bg-black/20 max-h-64"
                                                />
                                            )}
                                        </GlassCard>

                                        {/* Recommendation */}
                                        {selectedDetail.recommendation?.parsed && (
                                            <GlassCard glow="glow-purple">
                                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <Sprout className="w-5 h-5 text-purple-400" />
                                                    AI Recommendation
                                                </h3>
                                                <div className="space-y-3">
                                                    {mitigationSections.map(({ key, icon: Icon, label, gradient }) => {
                                                        const content = selectedDetail.recommendation.parsed[key];
                                                        if (!content || content === 'N/A') return null;
                                                        return (
                                                            <div key={key} className="glass !rounded-xl !p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                                                        <Icon className="w-3 h-3 text-white" />
                                                                    </div>
                                                                    <h4 className="text-sm font-semibold text-white">{label}</h4>
                                                                </div>
                                                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{content}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </GlassCard>
                                        )}
                                    </motion.div>
                                ) : (
                                    <GlassCard key="empty" className="flex flex-col items-center justify-center py-20 text-center">
                                        <History className="w-10 h-10 text-slate-600 mb-3" />
                                        <p className="text-slate-500">Select a prediction to view details</p>
                                    </GlassCard>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
