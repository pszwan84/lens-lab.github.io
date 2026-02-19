import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, mimeType, prompt } = await req.json();

        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });

        let apiKey: string;
        let baseUrl: string;
        const model = process.env.MODEL_NAME || 'gemini-2.0-flash-exp';

        if (user.isAdmin) {
            apiKey = process.env.API_KEY || '';
            baseUrl = process.env.API_BASE_URL || '';
        } else {
            const dbUser = findUserById(user.userId);
            if (!dbUser?.apiBaseUrl || !dbUser?.apiKey) {
                return NextResponse.json({ error: '请先在设置中配置 API' }, { status: 403 });
            }
            apiKey = dbUser.apiKey;
            baseUrl = dbUser.apiBaseUrl;
        }

        if (!apiKey || !baseUrl) {
            return NextResponse.json({ error: '未配置 API' }, { status: 401 });
        }
        if (!imageBase64 || !prompt) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const systemPrompt = `You are an image transformation engine. Output ONLY a transformed image.
RULES: Keep EXACT same composition/perspective/layout. Transform STYLE only. No text/watermarks.`;

        const url = `${baseUrl}/chat/completions`;
        const payload = {
            model,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } },
                    { type: 'text', text: `${systemPrompt}\n\nTransformation: ${prompt}` },
                ],
            }],
        };

        console.log(`[LensLab] POST ${url} | model=${model} | user=${user.email}`);

        let response: Response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify(payload),
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            return NextResponse.json({ error: `无法连接 API: ${msg}` }, { status: 502 });
        }

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            let errMsg = `API 错误 (${response.status})`;
            try { const d = JSON.parse(errText); errMsg = d?.error?.message || d?.detail || errMsg; } catch { /* */ }
            return NextResponse.json({ error: errMsg }, { status: response.status });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) return NextResponse.json({ error: '响应中没有内容' }, { status: 500 });

        // Extract base64 image
        const b64Match = content.match(/data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=\s]+)/);
        if (b64Match) {
            return NextResponse.json({ image: b64Match[2].replace(/\s/g, ''), mimeType: `image/${b64Match[1]}` });
        }

        // URL image
        const urlMatch = content.match(/https?:\/\/[^\s)"']+\.(png|jpg|jpeg|webp)/i);
        if (urlMatch) {
            try {
                const imgRes = await fetch(urlMatch[0]);
                if (imgRes.ok) {
                    const buf = await imgRes.arrayBuffer();
                    return NextResponse.json({ image: Buffer.from(buf).toString('base64'), mimeType: `image/${urlMatch[1]}` });
                }
            } catch { /* fallthrough */ }
        }

        // Pure base64
        if (/^[A-Za-z0-9+/=\s]{100,}$/.test(content.trim())) {
            return NextResponse.json({ image: content.trim().replace(/\s/g, ''), mimeType: 'image/png' });
        }

        return NextResponse.json({ error: `模型返回了文本而非图片` }, { status: 500 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Internal error';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
