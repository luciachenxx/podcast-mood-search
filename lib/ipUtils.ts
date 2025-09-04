import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
    const headers = 'headers' in request ? request.headers : new Headers();
    return headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || 'unknown';
}

const suspiciousIPs = new Set<string>();
const ipAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function isIPSuspicious(ip: string): boolean {
    return suspiciousIPs.has(ip);
}

export function recordFailedAttempt(ip: string) {
    const current = ipAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    current.count++;
    current.lastAttempt = Date.now();
    ipAttempts.set(ip, current);

    if (current.count > 20) {
        suspiciousIPs.add(ip);
    }
}
