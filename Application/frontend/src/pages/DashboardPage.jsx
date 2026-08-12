import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { predictDisease, savePrediction } from '../services/api';
import GlassCard from '../components/GlassCard';
import ConfidenceMeter from '../components/ConfidenceMeter';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    Upload,
    Scan,
    Save,
    CheckCircle2,
    AlertTriangle,
    Bug,
    Shield,
    Droplets,
    Thermometer,
    Sprout,
    ChevronDown,
    ChevronUp,
    ImageIcon,
} from 'lucide-react';

export default function DashboardPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [mitigationOpen, setMitigationOpen] = useState(true);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setSaved(false);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] },
        maxFiles: 1,
        maxSize: 16 * 1024 * 1024,
    });

    const handleDetect = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await predictDisease(selectedFile);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Detection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!result?.primary_detection) return;
        setSaving(true);

        try {
            await savePrediction({
                disease_name: result.primary_detection.class_name,
                confidence: result.primary_detection.confidence,
                image_url: result.annotated_image,
                bbox_data: result.detections.map((d) => d.bbox),
                mitigation: result.mitigation,
            });
            setSaved(true);
        } catch (err) {
            setError('Failed to save result.');
        } finally {
            setSaving(false);
        }
    };

    const isHealthy = result?.primary_detection?.class_name?.toLowerCase().includes('healthy');

    const mitigationSections = result?.mitigation
        ? [
            { key: 'cause', icon: Bug, label: 'Cause', gradient: 'from-red-500 to-rose-500' },
            { key: 'prevention', icon: Shield, label: 'Prevention', gradient: 'from-indigo-500 to-blue-500' },
            { key: 'treatment', icon: Droplets, label: 'Treatment', gradient: 'from-teal-500 to-emerald-500' },
            { key: 'fertilizer_advice', icon: Sprout, label: 'Fertilizer Advice', gradient: 'from-amber-500 to-yellow-500' },
            { key: 'environmental_conditions', icon: Thermometer, label: 'Environment', gradient: 'from-violet-500 to-purple-500' },
        ]
        : [];

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-3" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold font-['Outfit'] text-white">
                        Disease <span className="gradient-text">Detection</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Upload a plant image for AI-powered analysis</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* ── Left: Upload ── */}
                    <div className="space-y-6">
                        <GlassCard glow="glow-indigo">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-indigo-400" />
                                Upload Image
                            </h2>

                            <div
                                {...getRootProps()}
                                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                            >
                                <input {...getInputProps()} />
                                {preview ? (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-64 mx-auto rounded-xl object-contain"
                                        />
                                        <p className="text-sm text-slate-500 mt-3">Click or drop to change image</p>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400 font-medium">
                                            {isDragActive ? 'Drop your image here...' : 'Drag & drop a plant image'}
                                        </p>
                                        <p className="text-sm text-slate-600 mt-2">
                                            or click to browse · PNG, JPG, WEBP · Max 16 MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleDetect}
                                disabled={!selectedFile || loading}
                                className="btn-primary w-full mt-5 flex items-center justify-center gap-2 !py-3.5"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Scan className="w-5 h-5" />
                                        Detect Disease
                                    </>
                                )}
                            </button>
                        </GlassCard>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                            >
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-sm text-red-400">{error}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Right: Results ── */}
                    <div className="space-y-6">
                        {loading && (
                            <GlassCard glow="glow-teal">
                                <LoadingSpinner text="Detecting diseases..." />
                            </GlassCard>
                        )}

                        <AnimatePresence>
                            {result && !loading && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Annotated Image */}
                                    <GlassCard glow="glow-teal">
                                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Scan className="w-5 h-5 text-teal-400" />
                                            Detection Result
                                        </h2>
                                        <img
                                            src={result.annotated_image}
                                            alt="Annotated"
                                            className="w-full rounded-xl object-contain bg-black/20 max-h-80"
                                        />
                                    </GlassCard>

                                    {/* Primary Detection */}
                                    {result.primary_detection && (
                                        <GlassCard>
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-sm text-slate-500">Detected Disease</p>
                                                    <h3 className="text-xl font-bold text-white font-['Outfit'] mt-1">
                                                        {result.primary_detection.class_name.replace(/_/g, ' ')}
                                                    </h3>
                                                </div>
                                                {isHealthy ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                        <span className="text-sm font-medium text-emerald-400">Healthy</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                        <span className="text-sm font-medium text-red-400">Disease</span>
                                                    </div>
                                                )}
                                            </div>
                                            <ConfidenceMeter confidence={result.primary_detection.confidence} />

                                            {/* All Detections */}
                                            {result.detections.length > 1 && (
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <p className="text-xs text-slate-500 mb-2">All detections ({result.detections.length})</p>
                                                    <div className="space-y-2">
                                                        {result.detections.map((det, i) => (
                                                            <div key={i} className="flex items-center justify-between text-sm">
                                                                <span className="text-slate-300">{det.class_name.replace(/_/g, ' ')}</span>
                                                                <span className="text-slate-500 tabular-nums">{(det.confidence * 100).toFixed(1)}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </GlassCard>
                                    )}

                                    {/* Mitigation Suggestions */}
                                    {result.mitigation && !isHealthy && (
                                        <GlassCard glow="glow-purple">
                                            <button
                                                onClick={() => setMitigationOpen(!mitigationOpen)}
                                                className="w-full flex items-center justify-between"
                                            >
                                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <Sprout className="w-5 h-5 text-purple-400" />
                                                    AI Mitigation Suggestions
                                                </h2>
                                                {mitigationOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {mitigationOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="space-y-4 mt-5">
                                                            {mitigationSections.map(({ key, icon: Icon, label, gradient }) => {
                                                                const content = result.mitigation[key];
                                                                if (!content || content === 'N/A') return null;
                                                                return (
                                                                    <motion.div
                                                                        key={key}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className="glass !rounded-xl !p-4"
                                                                    >
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                                                                <Icon className="w-3.5 h-3.5 text-white" />
                                                                            </div>
                                                                            <h4 className="text-sm font-semibold text-white">{label}</h4>
                                                                        </div>
                                                                        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                                                                            {content}
                                                                        </p>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </GlassCard>
                                    )}

                                    {/* Save Button */}
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving || saved}
                                            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${saved
                                                    ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 cursor-default'
                                                    : 'btn-primary'
                                                }`}
                                        >
                                            {saving ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : saved ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Saved to History
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    Save Result
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Empty State */}
                        {!result && !loading && (
                            <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mb-4">
                                    <Scan className="w-9 h-9 text-indigo-500/30" />
                                </div>
                                <p className="text-slate-500 font-medium">No analysis yet</p>
                                <p className="text-sm text-slate-600 mt-1">Upload an image and click Detect to begin</p>
                            </GlassCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
