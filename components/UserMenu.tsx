'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
    user: { username: string; email: string; isAdmin: boolean };
    onOpenSettings: () => void;
    onLogout: () => void;
}

export default function UserMenu({ user, onOpenSettings, onLogout }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const initials = user.username.slice(0, 2).toUpperCase();

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
            >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {initials}
                </div>
                <span className="text-xs text-white/60 hidden sm:inline">{user.username}</span>
                {user.isAdmin && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">Admin</span>
                )}
                <ChevronDown className="w-3 h-3 text-white/30" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900/95 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                            <p className="text-xs font-medium text-white/80">{user.username}</p>
                            <p className="text-[10px] text-white/30">{user.email}</p>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={() => { setOpen(false); onOpenSettings(); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
                            >
                                <Settings className="w-3.5 h-3.5" /> API 设置
                            </button>
                            <button
                                onClick={() => { setOpen(false); onLogout(); }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
                            >
                                <LogOut className="w-3.5 h-3.5" /> 退出登录
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
