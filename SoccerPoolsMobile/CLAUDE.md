# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start          # Start Expo dev server
npm run android        # Start with Android
npm run ios            # Start with iOS
npm run web            # Start with web

# EAS Build (requires eas-cli)
eas build --profile development --platform android   # Dev build
eas build --profile preview --platform android       # Preview build
eas build --profile production --platform android    # Production build
```

## Architecture Overview

This is a **React Native Expo** (SDK 52) soccer prediction app using **Expo Router v4** for file-based routing and **React Query v5** for server state management.

### Routing Structure

- `app/_layout.tsx` - Root layout with providers (QueryClient, Toast)
- `app/index.tsx` - Landing page with auth/league redirect logic
- `app/home/_layout.tsx` - Drawer navigation for authenticated users
- Dynamic routes use `[param].tsx` convention (e.g., `[leagueSlug].tsx`)

### State Management

**Server State (React Query)**
- All data fetching uses hooks in `/hooks` that wrap React Query
- Pattern: Service function → Hook wrapper → Component usage
- Query keys: `['entityName', ...params]`
- Mutations invalidate related queries on success

**Token Management**
- AsyncStorage stores `accessToken`, `refreshToken`, `FCMToken`
- Managed via `utils/storeToken.ts`
- API interceptor auto-attaches tokens and handles 401 refresh

### API Layer (`services/`)

- `api.ts` - Axios instance with auth interceptor and token refresh logic
- Each domain has a service file (authService, userService, leagueService, etc.)
- Services take token as explicit parameter
- Base URL from `process.env.API_URL`

### Platform-Specific Code

Use file suffixes for platform variants:
- `.native.tsx` - Android/iOS only
- `.web.tsx` - Web only
- Metro bundler resolves automatically

Examples: `components/ads/Ads.native.tsx`, `utils/analytics/initializeAnalytics.web.ts`

### Responsive Design

```typescript
import { useBreakpoint } from '../hooks/useBreakpoint';
const { isMobile, isTablet } = useBreakpoint();
```

Breakpoints defined in `constants.ts`: sm(550), md(768), lg(1024), xl(1280), xxl(1550)

### Internationalization

- i18next with `expo-localization` for device language detection
- Translations in `/locales/{en,es}/translation.json`
- Usage: `const {t} = useTranslation(); t('key')`

## Key Patterns

**Adding new data fetching:**
1. Create service function in `services/`
2. Create React Query hook in `hooks/`
3. Hook fetches token from AsyncStorage before API call

**Component structure:**
- Reusable UI in `components/`
- Modal components in `modals/`
- Screen-specific contexts in `app/home/contexts/`

## Environment Variables

Configured via `.env` and loaded through `babel-plugin-inline-dotenv`:
- `API_URL` - Backend API base URL
- `TEST_ADS` - Disables Sentry in test mode
- `SENTRY_URL`, `SENTRY_KEY` - Error tracking

## TypeScript

- Path aliases configured: `components/*`, `utils/*`
- Types in `types.ts` (UserProps, MatchProps, etc.)
- Type aliases: `Slug`, `ISO8601DateString`, `Email`
