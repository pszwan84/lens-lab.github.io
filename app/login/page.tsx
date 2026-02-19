'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
            const body = tab === 'login'
                ? { email, password }
                : { email, username, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || '操作失败');

            window.location.href = '/';
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : '操作失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Branding */}
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-cyan-900/30 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.15),transparent_70%)]" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30">
                        <span className="text-3xl">🔮</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">LensLab</h1>
                    <p className="text-white/50 text-lg max-w-xs">AI 平行现实透镜 — 窥探另一个世界</p>

                    <div className="mt-12 grid grid-cols-3 gap-3">
                        {['🌃', '🧱', '🍃', '✏️', '🎨', '🚀', '🏠', '🐱', '🕰️'].map((emoji, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="w-14 h-14 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xl hover:bg-white/10 transition-all cursor-default"
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-sm"
                >
                    {/* Mobile logo */}
                    <div className="md:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-lg">🔮</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">LensLab</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 mb-6">
                        {(['login', 'register'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(''); }}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                {t === 'login' ? '登录' : '注册'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === 'register' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                <label className="text-xs text-white/40 mb-1 block">用户名</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
                                    placeholder="你的昵称"
                                />
                            </motion.div>
                        )}

                        <div>
                            <label className="text-xs text-white/40 mb-1 block">邮箱</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-white/40 mb-1 block">密码</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
                                    placeholder="至少 6 位"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    {tab === 'login' ? '登录' : '创建账号'}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
