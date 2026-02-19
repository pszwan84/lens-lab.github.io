import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken, isAdminEmail } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export async function GET() {
    const token = await getAuthToken();
    if (!token) {
        return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return NextResponse.json({ user: null });
    }

    const user = findUserById(payload.userId);
    if (!user) {
        return NextResponse.json({ user: null });
    }

    const isAdmin = isAdminEmail(user.email);

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin,
            hasApiConfig: isAdmin || !!(user.apiBaseUrl && user.apiKey),
        },
    });
}
