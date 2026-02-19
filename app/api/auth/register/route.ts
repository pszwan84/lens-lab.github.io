import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken, setAuthCookie, isAdminEmail } from '@/lib/auth';
import { findUserByEmail, createUser } from '@/lib/users';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 });
        }

        const existing = findUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);
        const user = createUser({
            id: crypto.randomUUID(),
            email: email.toLowerCase(),
            username,
            passwordHash,
            createdAt: new Date().toISOString(),
        });

        const isAdmin = isAdminEmail(email);
        const token = signToken({ userId: user.id, email: user.email, isAdmin });
        await setAuthCookie(token);

        return NextResponse.json({
            user: { id: user.id, email: user.email, username: user.username, isAdmin },
        });
    } catch (err: unknown) {
        console.error('[Register]', err);
        return NextResponse.json({ error: '注册失败' }, { status: 500 });
    }
}
