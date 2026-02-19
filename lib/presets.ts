export interface Preset {
  id: string;
  name: string;
  emoji: string;
  prompt: string;
  color: string;
  category: 'style' | 'scene' | 'fun';
}

export const CATEGORIES = [
  { id: 'style' as const, name: '🎨 艺术风格', description: '改变画风，保持构图' },
  { id: 'scene' as const, name: '🏠 场景变换', description: '实用场景转换' },
  { id: 'fun' as const, name: '🎲 趣味玩法', description: '好玩的创意变换' },
];

export const PRESETS: Preset[] = [
  // ── 艺术风格 ──
  {
    id: 'cyberpunk',
    name: 'Night City',
    emoji: '🌃',
    category: 'style',
    prompt: 'Transform this image into a cyberpunk scene. Neon lights, rain-slicked surfaces, holographic signs, futuristic vibes. Dark and moody with vivid neon glows in pink, cyan, and purple. Maintain exact same composition.',
    color: 'from-cyan-500 to-purple-600',
  },
  {
    id: 'ghibli',
    name: 'Anime Sky',
    emoji: '🍃',
    category: 'style',
    prompt: 'Transform this image into a Studio Ghibli-inspired anime illustration. Lush, painterly colors, soft hand-painted textures, fluffy cumulus clouds, warm golden-hour lighting. Maintain exact same composition.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    emoji: '✏️',
    category: 'style',
    prompt: 'Transform into a highly detailed charcoal pencil sketch on rough textured paper. Black and white only, with expressive cross-hatching. Maintain exact same composition. Fine art quality.',
    color: 'from-zinc-400 to-zinc-600',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    emoji: '🎨',
    category: 'style',
    prompt: 'Transform into a beautiful loose watercolor painting. Soft washes of color bleeding into each other, visible paper texture, gentle brush strokes. Dreamy and artistic. Same composition.',
    color: 'from-pink-400 to-orange-400',
  },
  {
    id: 'lego',
    name: 'Brick World',
    emoji: '🧱',
    category: 'style',
    prompt: 'Transform this entire scene into a world made of plastic toy building bricks (like LEGO). Every surface and object should be constructed from colorful interlocking bricks. Keep vibrant colors. Same composition.',
    color: 'from-yellow-400 to-red-500',
  },
  {
    id: 'scifi',
    name: 'Sci-Fi World',
    emoji: '🚀',
    category: 'style',
    prompt: 'Transform into a futuristic sci-fi environment. Sleek metallic surfaces, floating holographic interfaces, advanced technology. Cool blue and silver tones with glowing energy accents. Same composition.',
    color: 'from-blue-500 to-indigo-600',
  },

  // ── 场景变换 ──
  {
    id: 'interior-nordic',
    name: '北欧简约',
    emoji: '🏠',
    category: 'scene',
    prompt: 'Redesign this room interior in Scandinavian/Nordic minimalist style. White walls, light wood furniture, minimal decor, cozy textiles, natural light. Keep the exact same room layout, windows, and dimensions.',
    color: 'from-amber-200 to-orange-300',
  },
  {
    id: 'interior-modern',
    name: '现代豪华',
    emoji: '✨',
    category: 'scene',
    prompt: 'Redesign this room interior in luxury modern style. Marble surfaces, designer furniture, statement lighting, rich textures (velvet, leather), muted gold accents. Keep the exact same room layout and dimensions.',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'interior-chinese',
    name: '新中式',
    emoji: '🏮',
    category: 'scene',
    prompt: 'Redesign this room in modern Chinese style (新中式). Dark wood furniture with clean lines, ink wash art on walls, bamboo accents, paper lanterns, jade-green and crimson accents. Keep same room layout.',
    color: 'from-red-500 to-amber-600',
  },
  {
    id: 'time-retro',
    name: '复古年代',
    emoji: '🕰️',
    category: 'scene',
    prompt: 'Transport this scene back to the 1920s-1930s era. Vintage architecture, old cars, period-appropriate clothing, sepia-warm tones, art deco details. Keep exact same composition and perspective.',
    color: 'from-amber-700 to-yellow-900',
  },
  {
    id: 'time-future',
    name: '2080 未来',
    emoji: '🔮',
    category: 'scene',
    prompt: 'Transform this scene into the year 2080. Flying vehicles, holographic advertisements, advanced architecture with organic curves, lush vertical gardens on buildings, clean energy tech. Same composition.',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'season-winter',
    name: '冬日雪景',
    emoji: '❄️',
    category: 'scene',
    prompt: 'Transform this scene to a beautiful winter version. Heavy snowfall, snow covering all surfaces, frosted windows, icicles, warm light glowing from inside buildings. Peaceful and magical feel. Same composition.',
    color: 'from-blue-200 to-sky-400',
  },

  // ── 趣味玩法 ──
  {
    id: 'pet-human',
    name: '宠物拟人',
    emoji: '🐱',
    category: 'fun',
    prompt: 'Transform this pet/animal into a humanoid character portrait. Keep the animal\'s distinct features (fur color, markings, eyes) but give them a human body wearing stylish clothes. Professional portrait style, detailed, artistic.',
    color: 'from-orange-400 to-pink-500',
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    emoji: '⛏️',
    category: 'fun',
    prompt: 'Transform this entire scene into Minecraft voxel style. Everything should be made of blocky cubes. Pixelated textures, blocky trees, square sun. Maintain the same composition and layout. Authentic Minecraft look.',
    color: 'from-green-500 to-lime-400',
  },
  {
    id: 'gta',
    name: 'GTA 风格',
    emoji: '🎮',
    category: 'fun',
    prompt: 'Transform this image into Grand Theft Auto (GTA) loading screen art style. Bold outlines, saturated colors, slightly exaggerated proportions, comic-book shading. Same composition, game-art quality.',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'pixar',
    name: 'Pixar 动画',
    emoji: '🎬',
    category: 'fun',
    prompt: 'Transform this into a Pixar/Disney 3D animation still frame. Smooth 3D rendering, big expressive eyes on characters, vibrant saturated colors, cinematic lighting, whimsical charm. Same composition.',
    color: 'from-blue-400 to-purple-500',
  },
  {
    id: 'fashion',
    name: '时尚大片',
    emoji: '👗',
    category: 'fun',
    prompt: 'Transform this portrait into a high-fashion magazine editorial photo. Professional studio lighting, glamorous styling, dramatic pose enhancement, luxury fashion wardrobe. Vogue/Harper\'s Bazaar quality. Same person, elevated style.',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 'zombie',
    name: '丧尸末日',
    emoji: '🧟',
    category: 'fun',
    prompt: 'Transform this scene into a post-apocalyptic zombie wasteland. Abandoned vehicles, overgrown vegetation, broken windows, eerie fog, scattered debris. Dark and atmospheric but the same composition.',
    color: 'from-green-700 to-gray-800',
  },
];
