import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: string;
    apiBaseUrl?: string;
    apiKey?: string;
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
}

function readUsers(): User[] {
    ensureDataDir();
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch {
        return [];
    }
}

function writeUsers(users: User[]) {
    ensureDataDir();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUserByEmail(email: string): User | undefined {
    return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
    return readUsers().find((u) => u.id === id);
}

export function createUser(user: User): User {
    const users = readUsers();
    users.push(user);
    writeUsers(users);
    return user;
}

export function updateUserApiConfig(id: string, apiBaseUrl: string, apiKey: string) {
    const users = readUsers();
    const user = users.find((u) => u.id === id);
    if (user) {
        user.apiBaseUrl = apiBaseUrl;
        user.apiKey = apiKey;
        writeUsers(users);
    }
}
