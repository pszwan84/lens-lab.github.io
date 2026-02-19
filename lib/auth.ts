import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'lenslab-dev-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@lenslab.local';

export interface JwtPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function isAdminEmail(email: string): boolean {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
    });
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
}

export function getUserFromRequest(req: NextRequest): JwtPayload | null {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}
