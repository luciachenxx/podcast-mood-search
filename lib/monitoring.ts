interface SecurityEvent {
    type: 'rate_limit_exceeded' | 'suspicious_input' | 'api_abuse' | 'blocked_ip';
    ip: string;
    timestamp: number;
    details: any;
}

const securityEvents: SecurityEvent[] = [];

export function logSecurityEvent(event: SecurityEvent) {
    securityEvents.push(event);
    console.warn(`🚨 安全事件: ${event.type} - IP: ${event.ip}`);

    // 清理舊事件
    const oneHour = 60 * 60 * 1000;
    const cutoff = Date.now() - oneHour;
    const filtered = securityEvents.filter((e) => e.timestamp > cutoff);
    securityEvents.length = 0;
    securityEvents.push(...filtered);
}
