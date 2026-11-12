import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

import { APP_CONFIG } from '../../app-config.module';
import { SSR_API_TIMEOUT_MS } from '../ssr/ssr-degraded';

/**
 * Durante o SSR, nenhuma chamada GET à API pode segurar a renderização por mais de 4 s.
 * Sem isso, uma API lenta prende a requisição do visitante (e do Googlebot) por dezenas de
 * segundos. Estourou: a chamada falha com TimeoutError, o componente trata como qualquer
 * outro erro (ex.: página de livro sem recomendações) e a renderização é marcada como degradada.
 *
 * Só vale no servidor. No navegador a pessoa já está com a página aberta, e um corte em 4 s
 * quebraria quem está em rede móvel lenta.
 */
export const timeoutInterceptor: HttpInterceptorFn = (request, next) => {
  const platformId = inject(PLATFORM_ID);
  const config = inject(APP_CONFIG);

  if (
    !isPlatformServer(platformId) ||
    request.method !== 'GET' ||
    !request.url.startsWith(`${config.apiEndpoint}/`)
  ) {
    return next(request);
  }

  return next(request).pipe(timeout(SSR_API_TIMEOUT_MS));
};
