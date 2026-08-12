import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Leaf,
    Shield,
    Cpu,
    BarChart3,
    Sparkles,
    ArrowRight,
    Layers,
    Zap,
} from 'lucide-react';

const features = [
    {
        icon: Cpu,
        title: 'YOLOv8 AI Engine',
        desc: 'Trained on 57 disease classes with combined RGB + Infrared imaging for superior accuracy.',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
        icon: Sparkles,
        title: 'AI Mitigation',
        desc: 'Groq-powered LLM generates cause analysis, prevention, treatment & fertilizer advice.',
        gradient: 'linear-gradient(135deg, #14b8a6, #10b981)',
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        desc: 'Supabase authentication with Row-Level Security. Your data stays yours.',
        gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    },
    {
        icon: BarChart3,
        title: 'History & Analytics',
        desc: 'Track all predictions over time with full recommendation history.',
        gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    },
];

const stats = [
    { value: '57', label: 'Disease Classes' },
    { value: 'RGB+IR', label: 'Multispectral' },
    { value: '< 2s', label: 'Detection Time' },
    { value: 'AI', label: 'Powered Advice' },
];

export default function LandingPage() {
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Background Orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            {/* Hero */}
            <section style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '180px 24px 80px',
                textAlign: 'center',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            borderRadius: '9999px',
                            marginBottom: '32px',
                        }}
                        className="glass"
                    >
                        <Layers style={{ width: 16, height: 16, color: '#818cf8' }} />
                        <span style={{ fontSize: '0.875rem', color: '#a5b4fc', fontWeight: 500 }}>
                            Multispectral AI Technology
                        </span>
                    </motion.div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 800,
                        fontFamily: "'Outfit', sans-serif",
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        marginBottom: '24px',
                    }}>
                        <span className="gradient-text">Plant Disease</span>
                        <br />
                        <span style={{ color: '#fff' }}>Detection & Mitigation</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: '#94a3b8',
                        maxWidth: '640px',
                        margin: '0 auto 40px',
                        lineHeight: 1.7,
                    }}>
                        Upload a plant image and let our YOLOv8 model — trained on{' '}
                        <span style={{ color: '#818cf8', fontWeight: 600 }}>57 disease classes</span> with{' '}
                        <span style={{ color: '#2dd4bf', fontWeight: 600 }}>RGB + Infrared</span> data — detect diseases
                        instantly and provide AI-powered treatment plans.
                    </p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            to={user ? '/dashboard' : '/register'}
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 40px', fontSize: '1rem' }}
                        >
                            <Zap style={{ width: 20, height: 20 }} />
                            Get Started
                            <ArrowRight style={{ width: 16, height: 16 }} />
                        </Link>
                        <Link
                            to={user ? '/dashboard' : '/login'}
                            className="btn-outline"
                            style={{ padding: '16px 40px', fontSize: '1rem' }}
                        >
                            {user ? 'Go to Dashboard' : 'Login'}
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '16px',
                        maxWidth: '768px',
                        margin: '64px auto 0',
                    }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="glass" style={{ textAlign: 'center', padding: '20px 16px' }}>
                            <div className="gradient-text" style={{
                                fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
                                fontWeight: 700,
                                fontFamily: "'Outfit', sans-serif",
                            }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Features */}
            <section style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '40px 24px 80px',
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '56px' }}
                >
                    <h2 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 700,
                        fontFamily: "'Outfit', sans-serif",
                        color: '#fff',
                        marginBottom: '12px',
                    }}>
                        Powerful <span className="gradient-text">Features</span>
                    </h2>
                    <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto' }}>
                        Everything you need for intelligent crop health monitoring
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                }}>
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass"
                            style={{ padding: '24px', transition: 'all 0.3s ease' }}
                        >
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: feat.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            }}>
                                <feat.icon style={{ width: 24, height: 24, color: '#fff' }} />
                            </div>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#fff',
                                marginBottom: '8px',
                                fontFamily: "'Outfit', sans-serif",
                            }}>
                                {feat.title}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                position: 'relative',
                zIndex: 10,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '40px',
                padding: '32px 0',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Leaf style={{ width: 20, height: 20, color: '#818cf8' }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff' }}>PhytoGuard</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                        Multispectral AI Plant Disease Detection System © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
