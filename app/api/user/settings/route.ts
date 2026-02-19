import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById, updateUserApiConfig } from '@/lib/users';

export async function GET(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

    if (user.isAdmin) {
        return NextResponse.json({
            apiBaseUrl: process.env.API_BASE_URL || '',
            apiKey: process.env.API_KEY ? '••••••' + process.env.API_KEY.slice(-4) : '',
            model: process.env.MODEL_NAME || 'gemini-2.0-flash-exp',
            isAdmin: true,
        });
    }

    const dbUser = findUserById(user.userId);
    return NextResponse.json({
        apiBaseUrl: dbUser?.apiBaseUrl || '',
        apiKey: dbUser?.apiKey ? '••••••' + dbUser.apiKey.slice(-4) : '',
        model: process.env.MODEL_NAME || 'gemini-2.0-flash-exp',
        isAdmin: false,
    });
}

export async function PUT(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });
    if (user.isAdmin) return NextResponse.json({ error: 'Admin 使用服务端配置' }, { status: 403 });

    const { apiBaseUrl, apiKey } = await req.json();
    if (!apiBaseUrl || !apiKey) {
        return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
    }

    updateUserApiConfig(user.userId, apiBaseUrl, apiKey);
    return NextResponse.json({ ok: true });
}
