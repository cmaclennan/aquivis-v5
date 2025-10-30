# Error Tracking Setup

Aquivis uses Sentry for error tracking and monitoring in production.

## Sentry Integration

### Installation

```bash
npm install @sentry/nextjs --workspace=apps/web
```

### Configuration

1. **Initialize Sentry** in `apps/web/sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
});
```

2. **Server Configuration** in `apps/web/sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === 'production',
});
```

3. **Edge Configuration** in `apps/web/sentry.edge.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});
```

4. **Next.js Config** - Update `next.config.ts`:
```typescript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // ... existing config
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
```

### Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

### Manual Error Reporting

For caught errors:
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // ... code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## Alternative: Custom Error Logging

If not using Sentry, implement custom error logging:

1. Create error logging API route
2. Log to database or external service
3. Send alerts for critical errors

## Production Recommendations

- Enable Sentry only in production (`NODE_ENV === 'production'`)
- Set appropriate `tracesSampleRate` (1.0 = 100%, 0.1 = 10%)
- Filter sensitive data (passwords, tokens) from error reports
- Set up alerts for critical error thresholds

