# Monitoring & Logging Strategy

## Logging Levels

### Production Logging

1. **Error Level**: Unexpected errors, exceptions, failures
   - API route errors
   - Database query failures
   - External service failures (Stripe, Resend)

2. **Warn Level**: Recoverable issues, deprecated usage
   - Failed email sends (non-critical)
   - Rate limit warnings
   - Missing optional data

3. **Info Level**: Important events, state changes
   - User signups
   - Subscription changes
   - Team member invites/removals

4. **Debug Level**: Detailed information for troubleshooting (dev only)

### Log Structure

Structured logging format:
```typescript
{
  level: 'error' | 'warn' | 'info' | 'debug',
  message: string,
  timestamp: string,
  context: {
    userId?: string,
    companyId?: string,
    route?: string,
    error?: Error,
    metadata?: Record<string, any>
  }
}
```

## Implementation

### API Route Logging

Create `apps/web/lib/logger.ts`:

```typescript
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  userId?: string;
  companyId?: string;
  route?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

export function log(level: LogLevel, message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'production') {
    // In production, send to external logging service
    // Example: Log to Supabase, CloudWatch, or logging service
    console.log(JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    }));
  } else {
    // In development, use console with formatting
    console[level](`[${level.toUpperCase()}] ${message}`, context);
  }
}

export const logger = {
  error: (message: string, context?: LogContext) => log('error', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};
```

### Usage in API Routes

```typescript
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    // ... logic
    logger.info('Team member invited', {
      userId: session.user.id,
      companyId: profile.company_id,
      route: '/api/team/invite',
    });
  } catch (error) {
    logger.error('Failed to invite team member', {
      userId: session.user.id,
      route: '/api/team/invite',
      error: error instanceof Error ? error : new Error(String(error)),
    });
    throw error;
  }
}
```

## Performance Monitoring

### Key Metrics to Track

1. **API Response Times**
   - TTFB (Time to First Byte)
   - Total request duration
   - Database query time

2. **Database Performance**
   - Slow queries (> 400ms)
   - Unindexed scans
 tích  - Connection pool usage

3. **External Service Calls**
   - Stripe API latency
   - Resend email delivery time
   - Supabase API response time

### Implementation

Add performance middleware:

```typescript
// apps/web/lib/performance.ts
export function trackPerformance(route: string, startTime: number) {
  const duration = Date.now() - startTime;
  
  if (duration > 1000) {
    logger.warn('Slow API route', {
      route,
      duration,
      metadata: { threshold: 1000 },
    });
  }
  
  // Log to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics/monitoring service
  }
}
```

## Health Checks

### `/api/health` Endpoint

Already implemented. Monitors:
- Database connectivity
- API availability
- External service status (optional)

### Recommended Enhancements

1. **Database Health**: Test query execution
2. **Storage Health**: Verify Supabase Storage access
3. **External Services**: Check Stripe/Resend connectivity

## Alerting

### Critical Alerts

- Database connection failures
- High error rate (> 5% of requests)
- Payment processing failures
- Authentication system failures

### Warning Alerts

- Slow API responses (p95 > 1s)
- Failed email deliveries
- RLS policy errors

### Implementation Options

1. **Supabase Logs**: Monitor dashboard for errors
2. **Vercel Analytics**: Built-in monitoring
3. **Sentry**: Error tracking with alerts
4. **Custom Webhooks**: Send alerts to Slack/Discord

## Log Retention

- **Production Logs**: Retain 30 days minimum
- **Error Logs**: Retain 90 days
- **Audit Trails**: Retain indefinitely (compliance)

## Best Practices

1. **Never log sensitive data**: Passwords, tokens, full credit card numbers
2. **Structured logging**: Use JSON format for parsing
3. **Context-rich logs**: Include userId, companyId, route in all logs
4. **Correlation IDs**: Track requests across services
5. **Log levels appropriate**: Don't log debug info in production

