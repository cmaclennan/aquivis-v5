# Monitoring and Logging Strategy

This document outlines the monitoring and logging approach for the Aquivis platform.

## Error Tracking

### Sentry Integration

**Status**: ✅ Integrated

- **Service**: Sentry (https://sentry.io)
- **DSN**: Configured via `NEXT_PUBLIC_SENTRY_DSN` environment variable
- **Coverage**: Client-side and server-side errors

**Configuration**:
- Client-side: `sentry.client.config.ts`
- Server-side: `sentry.server.config.ts`
- Edge runtime: `sentry.edge.config.ts`
- Instrumentation: `instrumentation.ts`

**Features Enabled**:
- Error tracking and alerting
- Performance monitoring (traces)
- Session replay (10% sample rate, 100% on errors)
- Source maps for better stack traces
- Automatic instrumentation for Next.js

### Error Reporting

All unhandled errors are automatically sent to Sentry:
- React component errors (via ErrorBoundary)
- API route errors
- Client-side JavaScript errors
- Unhandled promise rejections

## Application Logging

### Log Levels

1. **Error**: Critical issues requiring immediate attention
   - Failed API requests
   - Authentication failures
   - Database errors
   - External service failures (Stripe, Resend)

2. **Warn**: Non-critical issues worth monitoring
   - Failed email sends (non-blocking)
   - Rate limit warnings
   - Validation failures

3. **Info**: Important operational events
   - Successful authentication
   - Successful payments
   - Arbitrary updates
   - Team invitations sent

4. **Debug**: Detailed diagnostic information
   - Query execution times
   - Cache hits/misses
   - Detailed request/response data

### Logging Locations

**Server-side (API Routes)**:
- Console logging for development
- Sentry for error tracking
- Consider structured logging service for production (e.g., Logtail, Datadog)

**Client-side**:
- Console logging for development
- Sentry for error tracking
- Avoid logging sensitive data (passwords, tokens)

### Logging Best Practices

✅ **DO**:
- Log errors with context (user ID, company ID, request details)
- Include stack traces for exceptions
- Log important business events (payments, signups, etc.)
- Use structured logging when possible

❌ **DON'T**:
- Log sensitive data (passwords, API keys, tokens)
- Log excessive information in production
- Log credit card numbers or PII
- Log at debug level in production

## Health Checks

### Endpoint

**URL**: `/api/health`

**Returns**:
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2025-01-28T12:00:00Z",
  "checks": {
    "database": "healthy" | "unhealthy",
    "api": "healthy" | "degraded"
  }
}
```

**Usage**:
- Monitoring services (e.g., UptimeRobot, Pingdom)
- Load balancer health checks
- Kubernetes liveness/readiness probes

## Performance Monitoring

### Metrics to Track

1. **API Response Times**
   - Target: p95 < 400ms (per performance budgets)
   - Monitor via Sentry Performance
   - Alert on p95 > 600ms

2. **Database Query Performance**
   - Monitor slow queries in Supabase Dashboard
   - Target: No unindexed scans
   - Alert on queries > 1s

3. **Page Load Times**
   - Target: TTFB < 300ms (list views)
   - Monitor via Lighthouse CI or Sentry

4. **Error Rates**
   - Target: < 0.1% error rate
   - Monitor via Sentry
   - Alert on error rate > 1%

### Monitoring Tools

**Sentry Performance**:
- Tracks API route performance
- Identifies slow database queries
- Provides performance traces

**Supabase Dashboard**:
- Database query performance
- Connection pool status
- Storage usage

**Vercel Analytics** (if deployed on Vercel):
- Web Vitals
- Real User Monitoring (RUM)

## Alerting Strategy

### Critical Alerts (Immediate Response)

1. **Application Down**
   - Health check endpoint returns non-200
   - Uptime monitoring alerts

2. **High Error Rate**
   - Error rate > 1% in 5 minutes
   - Sentry alerts

3. **Database Connection Issues**
   - Health check shows database unhealthy
   - Supabase status page

4. **Payment Processing Failures**
   - Stripe webhook failures
   - Checkout session creation failures

### Warning Alerts (Monitor & Investigate)

1. **Slow Response Times**
   - p95 API response time > 600ms
   - Page load time degradation

2. **External Service Issues**
   - Resend email delivery failures
   - Stripe API errors

3. **Storage Issues**
   - Storage bucket near capacity
   - Storage upload failures

## Log Retention

### Recommended Retention Periods

- **Error Logs**: 90 days (Sentry)
- **Performance Metrics**: 30 days (detailed), 90 days (缩放)
- **Application Logs**: 30 days
- **Audit Trail**: Indefinite (in database)

## Dashboards

### Recommended Dashboards

1. **Operational Dashboard**
   - Error rate
   - Response times
   - Health check status
   - Active users

2. **Business Metrics Dashboard**
   - Signups per day
   - Active subscriptions
   - Payment success rate
   - Team invitations sent

3. **Infrastructure Dashboard**
   - Database performance
   - API response times
   - Storage usage
   - External service status

## Future Enhancements

- [ ] Structured logging service (Logtail, Datadog)
- [ ] Custom metrics dashboard
- [ ] Automated anomaly detection
- [ ] Log aggregation and search
- [ ] Real-time alerting via Slack/email

