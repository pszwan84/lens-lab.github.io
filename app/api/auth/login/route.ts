import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signToken, setAuthCookie, isAdminEmail } from '@/lib/auth';
import { findUserByEmail } from '@/lib/users';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        const isAdmin = isAdminEmail(email);
        const token = signToken({ userId: user.id, email: user.email, isAdmin });
        await setAuthCookie(token);

        return NextResponse.json({
            user: { id: user.id, email: user.email, username: user.username, isAdmin },
        });
    } catch (err: unknown) {
        console.error('[Login]', err);
        return NextResponse.json({ error: '登录失败' }, { status: 500 });
    }
}
