import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import https from 'https';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

const SITE_URL = 'https://www.sharebook.com.br';
const API_URL = process.env['API_URL'] || 'https://api.sharebook.com.br/api';

interface SitemapBook {
  slug: string;
  lastModifiedAt?: string;
}

interface SitemapCategory {
  name: string;
  parentCategoryName?: string;
  lastModifiedAt?: string;
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const fetchJson = <T>(url: string): Promise<T> =>
  new Promise((resolve, reject) => {
    const transport = url.startsWith('https:') ? https : http;
    const request = transport.get(url, response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Sitemap API returned HTTP ${response.statusCode} for ${url}`));
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        try {
          resolve(JSON.parse(body) as T);
        } catch (error) {
          reject(error);
        }
      });
    });

    request.setTimeout(10000, () => request.destroy(new Error('Sitemap API timed out')));
    request.on('error', reject);
  });

const categorySlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const lastModifiedTag = (lastModifiedAt?: string): string =>
  lastModifiedAt
    ? `<lastmod>${escapeXml(new Date(lastModifiedAt).toISOString())}</lastmod>`
    : '';

export const buildSitemap = (books: SitemapBook[], categories: SitemapCategory[] = []): string => {
  const staticPaths = [
    '',
    '/livros',
    '/categorias',
    '/livros-digitais/novidades',
    '/quem-somos',
    '/apoie-projeto',
    '/politica-privacidade',
    '/termos-de-uso',
  ];

  const staticUrls = staticPaths.map(path =>
    `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`
  );
  const bookUrls = books.map(book => {
    const location = escapeXml(`${SITE_URL}/livros/${encodeURIComponent(book.slug)}`);
    return `  <url><loc>${location}</loc>${lastModifiedTag(book.lastModifiedAt)}</url>`;
  });
  const categoryUrls = categories.map(category => {
    const path = category.parentCategoryName
      ? `/categorias/${categorySlug(category.parentCategoryName)}/${categorySlug(category.name)}`
      : `/categorias/${categorySlug(category.name)}`;
    const location = escapeXml(`${SITE_URL}${path}`);
    return `  <url><loc>${location}</loc>${lastModifiedTag(category.lastModifiedAt)}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...categoryUrls,
    ...bookUrls,
    '</urlset>',
  ].join('\n');
};

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

  server.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const [books, categories] = await Promise.all([
        fetchJson<SitemapBook[]>(`${API_URL}/book/Sitemap`),
        fetchJson<SitemapCategory[]>(`${API_URL}/category/Sitemap`),
      ]);
      res
        .status(200)
        .set('Content-Type', 'application/xml; charset=utf-8')
        .set('Cache-Control', 'public, max-age=3600, stale-if-error=86400')
        .send(buildSitemap(books, categories));
    } catch (error) {
      console.error('Unable to generate sitemap', error);
      res.status(503).send('Sitemap temporarily unavailable');
    }
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: RESPONSE, useValue: res },
      ],
    });
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
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
