import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import express, { Express, Request, Response } from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

type CacheEntry = {
  body: string;
  expiresAt: number;
};

const SSR_CACHE_TTL_MS = 30 * 60 * 1000;
const SSR_CACHE_MAX_ENTRIES = 500;
const ssrHtmlCache = new Map<string, CacheEntry>();
const PUBLIC_ROUTE_PREFIXES = [
  '/',
  '/livros/',
  '/buscar/',
  '/categorias',
  '/livros-digitais/novidades',
  '/quem-somos',
  '/apoie-projeto',
  '/contact-us',
  '/politica-privacidade',
  '/termos-de-uso',
];
const PRIVATE_ROUTE_PREFIXES = [
  '/api',
  '/admin',
  '/book/',
  '/panel',
  '/myaccount',
  '/account',
  '/change-password',
  '/login',
  '/register',
  '/dev-tools',
];
const SENSITIVE_QUERY_KEYS = [
  'token',
  'hashcode',
  'hashcodepassword',
  'userid',
  'email',
  'access_token',
  'code',
];

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

function isPrivateRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname).toLowerCase();
  return PRIVATE_ROUTE_PREFIXES.some(prefix => {
    const normalizedPrefix = normalizePath(prefix).toLowerCase();
    return normalized === normalizedPrefix || normalized.startsWith(`${normalizedPrefix}/`);
  });
}

function isPublicCacheableRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname).toLowerCase();
  return PUBLIC_ROUTE_PREFIXES.some(prefix => {
    const normalizedPrefix = normalizePath(prefix).toLowerCase();
    if (normalizedPrefix === '/') {
      return normalized === '/';
    }
    return normalized === normalizedPrefix || normalized.startsWith(`${normalizedPrefix}/`);
  });
}

function hasSensitiveQuery(req: Request): boolean {
  return Object.keys(req.query).some(key => SENSITIVE_QUERY_KEYS.includes(key.toLowerCase()));
}

function isAuthenticatedRequest(req: Request): boolean {
  const authorization = req.header('authorization');
  const cookie = req.header('cookie');

  return Boolean(
    authorization ||
    (cookie && (
      cookie.includes('shareBookUser') ||
      cookie.includes('accessToken') ||
      cookie.includes('token=')
    ))
  );
}

function shouldBypassSsrCache(req: Request): boolean {
  if (req.method !== 'GET') return true;
  if (isAuthenticatedRequest(req)) return true;
  if (isPrivateRoute(req.path)) return true;
  if (hasSensitiveQuery(req)) return true;
  if (!isPublicCacheableRoute(req.path)) return true;
  return false;
}

function getCacheKey(req: Request): string {
  return req.originalUrl || req.url;
}

function pruneExpiredCacheEntries(now: number): void {
  for (const [key, entry] of ssrHtmlCache.entries()) {
    if (entry.expiresAt <= now) {
      ssrHtmlCache.delete(key);
    }
  }
}

function enforceCacheSizeLimit(): void {
  while (ssrHtmlCache.size > SSR_CACHE_MAX_ENTRIES) {
    const oldestKey = ssrHtmlCache.keys().next().value;
    if (!oldestKey) break;
    ssrHtmlCache.delete(oldestKey);
  }
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*', express.static(distFolder, {
    maxAge: '1y'
  }));
  server.get('/assets/*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    if (shouldBypassSsrCache(req)) {
      res.setHeader('Cache-Control', 'private, no-store');
      return res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
    }

    const now = Date.now();
    pruneExpiredCacheEntries(now);

    const cacheKey = getCacheKey(req);
    const cached = ssrHtmlCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      res.setHeader('X-SSR-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=1800');
      return res.send(cached.body);
    }

    res.setHeader('X-SSR-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=1800');

    const originalSend = res.send.bind(res);
    res.send = ((body?: any) => {
      if (res.statusCode === 200 && typeof body === 'string') {
        ssrHtmlCache.set(cacheKey, {
          body,
          expiresAt: now + SSR_CACHE_TTL_MS,
        });
        enforceCacheSizeLimit();
      }
      return originalSend(body);
    }) as typeof res.send;

    return res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
