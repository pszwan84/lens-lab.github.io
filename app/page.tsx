'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import LensView from '@/components/LensView';
import ControlPanel from '@/components/ControlPanel';
import SettingsModal from '@/components/SettingsModal';

import { Preset } from '@/lib/presets';

function getApiConfig() {
  if (typeof window === 'undefined') return null;
  const baseUrl = localStorage.getItem('lenslab_api_base_url');
  const apiKey = localStorage.getItem('lenslab_api_key');
  const model = localStorage.getItem('lenslab_model') || 'gemini-3-pro-image-1x1';
  if (!baseUrl || !apiKey) return null;
  return { baseUrl, apiKey, model };
}

export default function Home() {
  const [image, setImage] = useState<{ file: File; base64: string; mimeType: string; dataUrl: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasApiConfig = typeof window !== 'undefined' && !!getApiConfig();

  const handleImageUpload = useCallback((file: File, dataUrl: string, base64: string, mimeType: string) => {
    setImage({ file, base64, mimeType, dataUrl });
    setGeneratedImage(null);
    setSelectedPreset(null);
    setError(null);
  }, []);

  const handlePresetSelect = useCallback(
    async (preset: Preset) => {
      if (!image || isProcessing) return;

      const config = getApiConfig();
      if (!config) {
        setSettingsOpen(true);
        return;
      }

      setSelectedPreset(preset.id);
      setIsProcessing(true);
      setError(null);
      setGeneratedImage(null);

      const systemPrompt = `You are an image transformation engine. You MUST output ONLY a transformed image. 
CRITICAL RULES:
- Keep the EXACT same composition, perspective, camera angle, and spatial arrangement as the input image.
- Transform the STYLE and APPEARANCE only, never the layout or structure.
- Do NOT add text, watermarks, or extra objects.
- Output a single high-quality image.`;

      try {
        const res = await fetch(`${config.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: { url: `data:${image.mimeType};base64,${image.base64}` },
                },
                {
                  type: 'text',
                  text: `${systemPrompt}\n\nTransformation instruction: ${preset.prompt}`,
                },
              ],
            }],
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          let errMsg = `API 错误 (${res.status})`;
          try {
            const errData = JSON.parse(errText);
            errMsg = errData?.error?.message || errData?.detail || errMsg;
          } catch { /* ignore */ }
          throw new Error(errMsg);
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error('响应中没有内容');

        // Extract base64 image
        const base64Match = content.match(/data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=\s]+)/);
        if (base64Match) {
          setGeneratedImage(`data:image/${base64Match[1]};base64,${base64Match[2].replace(/\s/g, '')}`);
          return;
        }

        // URL image
        const urlMatch = content.match(/https?:\/\/[^\s)"']+\.(png|jpg|jpeg|webp)/i);
        if (urlMatch) {
          try {
            const imgRes = await fetch(urlMatch[0]);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              const reader = new FileReader();
              reader.onload = () => setGeneratedImage(reader.result as string);
              reader.readAsDataURL(blob);
              return;
            }
          } catch { /* fallthrough */ }
        }

        // Pure base64
        if (/^[A-Za-z0-9+/=\s]{100,}$/.test(content.trim())) {
          setGeneratedImage(`data:image/png;base64,${content.trim().replace(/\s/g, '')}`);
          return;
        }

        throw new Error(`模型返回了文本而非图片`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Generation failed');
      } finally {
        setIsProcessing(false);
      }
    },
    [image, isProcessing]
  );

  const handleReset = useCallback(() => {
    setImage(null);
    setGeneratedImage(null);
    setSelectedPreset(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 gap-6 max-w-4xl mx-auto w-full">
        {/* API config nudge */}
        {!hasApiConfig && !image && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="glass rounded-2xl p-6 text-center border border-yellow-500/20 bg-yellow-500/5">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-white/80 mb-2">需要配置 API</h3>
              <p className="text-xs text-white/40 mb-4">
                使用前请先设置 API 端点和 Key
              </p>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
              >
                前往设置
              </button>
            </div>
          </motion.div>
        )}

        {/* Upload or Lens */}
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <UploadZone onImageUploaded={handleImageUpload} />
            </motion.div>
          ) : (
            <motion.div
              key="lens"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <LensView
                originalImage={image.dataUrl}
                generatedImage={generatedImage}
                isProcessing={isProcessing}
              />
              <div className="flex justify-center mt-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 transition-all"
                >
                  ↩ 重新上传
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            <ControlPanel
              selectedPreset={selectedPreset}
              isProcessing={isProcessing}
              onSelectPreset={handlePresetSelect}
            />
          </motion.div>
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
