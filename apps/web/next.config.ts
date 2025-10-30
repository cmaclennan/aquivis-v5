import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const sentryIngest = 'https://o'.concat(String(process.env.SENTRY_ORG || ''), '.ingest.sentry.io');
const stripeJs = 'https://js.stripe.com';
const stripeApi = 'https://api.stripe.com';

const cspDirectives = [
  "default-src 'self'",
  // Scripts: self + Stripe + Sentry tunnel + allow inline via nonce/hash only in future enforcement
  `script-src 'self' ${stripeJs}`,
  // Styles: self and unsafe-inline only if needed; aim to remove once all styles are hashed
  "style-src 'self' 'unsafe-inline'",
  // Images: self, data URIs, and remote assets (Supabase storage/public if used)
  `img-src 'self' data: blob: ${supabaseUrl}`,
  // Fonts
  "font-src 'self' data:",
  // Connections: API, Supabase, Sentry tunnel route, Stripe
  `connect-src 'self' ${appUrl} ${supabaseUrl} ${stripeApi}`,
  // Frames: restrict to Stripe Checkout/Portal
  `frame-src 'self' ${stripeJs} ${stripeApi}`,
  // Disallow all other embedding
  "frame-ancestors 'none'",
  // Workers and media if needed
  "media-src 'self'",
  "object-src 'none'",
  // Upgrade to HTTPS
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Report-Only first; switch to enforcing `Content-Security-Policy` after validation
          { key: 'Content-Security-Policy-Report-Only', value: cspDirectives },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
          // HSTS should be enabled at the edge/proxy; setting here for completeness
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  // Note: Source maps are hidden by default in production builds

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
