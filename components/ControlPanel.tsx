'use client';

import { useState } from 'react';
import { PRESETS, CATEGORIES, Preset } from '@/lib/presets';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlPanelProps {
    selectedPreset: string | null;
    onSelectPreset: (preset: Preset) => void;
    isProcessing: boolean;
}

export default function ControlPanel({
    selectedPreset,
    onSelectPreset,
    isProcessing,
}: ControlPanelProps) {
    const [activeCategory, setActiveCategory] = useState<string>('style');

    const filteredPresets = PRESETS.filter((p) => p.category === activeCategory);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Category Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-white/10 text-white/90 border border-white/15 shadow-sm'
                                : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Preset Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-3 sm:grid-cols-6 gap-3"
                >
                    {filteredPresets.map((preset, index) => {
                        const isSelected = selectedPreset === preset.id;
                        return (
                            <motion.button
                                key={preset.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                onClick={() => !isProcessing && onSelectPreset(preset)}
                                disabled={isProcessing}
                                className={`
                  relative flex flex-col items-center gap-2 p-3 rounded-xl
                  transition-all duration-200 ease-out
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected
                                        ? 'bg-white/10 border border-white/20 shadow-lg shadow-purple-500/10'
                                        : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12]'
                                    }
                `}
                            >
                                <span className="text-2xl">{preset.emoji}</span>
                                <span className={`text-[10px] font-medium tracking-wide leading-tight text-center ${isSelected ? 'text-white/90' : 'text-white/40'
                                    }`}>
                                    {preset.name}
                                </span>
                                {isSelected && (
                                    <motion.div
                                        layoutId="preset-indicator"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
