'use client';

import { Settings } from 'lucide-react';
import UserMenu from './UserMenu';

interface UserInfo {
    username: string;
    email: string;
    isAdmin: boolean;
}

interface HeaderProps {
    user?: UserInfo | null;
    onOpenSettings: () => void;
    onLogout?: () => void;
}

export default function Header({ user, onOpenSettings, onLogout }: HeaderProps) {
    return (
        <header className="w-full px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-sm">🔮</span>
                </div>
                <h1 className="text-lg font-semibold text-white/90 tracking-tight">
                    LensLab
                </h1>
                <span className="text-[10px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Beta
                </span>
            </div>

            {/* User Menu or Settings */}
            {user ? (
                <UserMenu
                    user={user}
                    onOpenSettings={onOpenSettings}
                    onLogout={onLogout || (() => { })}
                />
            ) : (
                <button
                    onClick={onOpenSettings}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                    title="API Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
            )}
        </header>
    );
}
