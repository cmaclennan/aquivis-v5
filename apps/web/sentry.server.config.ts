import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  debug: false,
  beforeSend(event) {
    // Redact common sensitive fields
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    if (event.request?.data && typeof event.request.data === 'object') {
      for (const key of Object.keys(event.request.data)) {
        if (/password|token|secret|authorization/i.test(key)) {
          (event.request.data as any)[key] = '[REDACTED]';
        }
      }
    }
    return event;
  },
});

