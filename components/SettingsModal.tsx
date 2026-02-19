'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Globe, Cpu, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

export default function SettingsModal({ isOpen, onClose, isAdmin }: SettingsModalProps) {
    const [baseUrl, setBaseUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gemini-2.0-flash-exp');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSaved(false);
            fetch('/api/user/settings')
                .then((r) => r.json())
                .then((data) => {
                    setBaseUrl(data.apiBaseUrl || '');
                    setApiKey('');
                    setModel(data.model || 'gemini-2.0-flash-exp');
                })
                .catch(() => { });
        }
    }, [isOpen]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiBaseUrl: baseUrl.trim(), apiKey: apiKey.trim() }),
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || '保存失败');
                return;
            }
            setSaved(true);
            setTimeout(() => onClose(), 600);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md glass rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                                <h2 className="text-base font-semibold text-white/90">API 设置</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4">
                                {isAdmin ? (
                                    <div className="text-xs text-white/40 bg-green-500/5 rounded-xl p-3 border border-green-500/10">
                                        <p className="text-green-400 font-medium mb-1">👑 Admin 模式</p>
                                        <p>使用服务端的 .env 配置，无需手动设置。</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-xs text-white/40 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06] space-y-1">
                                            <p>使用 Google AI Studio 的免费 API Key 即可体验。</p>
                                            <p>① <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">前往获取免费 API Key <ExternalLink className="w-3 h-3" /></a></p>
                                            <p>② 将下方端点和 Key 填入，点击保存即可</p>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium text-white/50 mb-1.5">
                                                <Globe className="w-3.5 h-3.5" /> API 端点
                                            </label>
                                            <input
                                                type="url"
                                                value={baseUrl}
                                                onChange={(e) => setBaseUrl(e.target.value)}
                                                placeholder="https://generativelanguage.googleapis.com/v1beta/openai"
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium text-white/50 mb-1.5">
                                                <Key className="w-3.5 h-3.5" /> API Key
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showKey ? 'text' : 'password'}
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    placeholder="AIzaSy..."
                                                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                                />
                                                <button onClick={() => setShowKey(!showKey)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60">
                                                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-medium text-white/50 mb-1.5">
                                                <Cpu className="w-3.5 h-3.5" /> 模型名称
                                            </label>
                                            <input
                                                type="text"
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                placeholder="gemini-2.0-flash-exp"
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isAdmin && (
                                <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-3">
                                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/70 hover:bg-white/5 transition-all">取消</button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading || !baseUrl.trim() || !apiKey.trim()}
                                        className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {saved ? '✓ 已保存' : loading ? '保存中...' : '保存'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
