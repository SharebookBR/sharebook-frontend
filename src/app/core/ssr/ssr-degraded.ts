/**
 * Renderização SSR degradada: alguma chamada à API falhou (timeout, 5xx ou rede) durante a
 * renderização, então a página saiu incompleta (ex.: sem recomendações).
 *
 * - página degradada não entra no cache SSR de 30 min nem pode ser servida como definitiva;
 * - se o dado essencial (o livro) falhar por esse motivo, o certo é 503, nunca 404: um 404
 *   falso diz ao Google que o livro não existe.
 *
 * O sinal viaja em `res.locals`, que é por requisição e já está acessível via token RESPONSE.
 */

/** Tempo máximo que o SSR espera por uma chamada GET à API. */
export const SSR_API_TIMEOUT_MS = 4000;

/** Quanto tempo pedimos ao cliente (ex.: Googlebot) para tentar de novo quando a API falhou. */
export const SSR_DEGRADED_RETRY_AFTER_SECONDS = 30;

const SSR_DEGRADED_LOCAL = 'ssrDegraded';

interface ResponseWithLocals {
  locals?: Record<string, unknown>;
}

interface ResponseLike extends ResponseWithLocals {
  status(code: number): unknown;
  set?(name: string, value: string): unknown;
}

export const markSsrDegraded = (res: ResponseWithLocals | null | undefined): void => {
  if (res?.locals) {
    res.locals[SSR_DEGRADED_LOCAL] = true;
  }
};

export const isSsrDegraded = (res: ResponseWithLocals | null | undefined): boolean =>
  res?.locals?.[SSR_DEGRADED_LOCAL] === true;

/** Erro de infraestrutura (a API não conseguiu responder), e não "não encontrado" ou "sem permissão". */
export const isDegradingApiError = (err: unknown): boolean => {
  const error = err as { name?: string; status?: number } | null;
  return error?.name === 'TimeoutError' || error?.status === 0 || (error?.status ?? 0) >= 500;
};

/** Livro não carregou: 404 se de fato não existe; 503 se a API falhou durante a renderização. */
export const respondBookNotLoaded = (res: ResponseLike | null | undefined): void => {
  if (!res) {
    return;
  }

  if (isSsrDegraded(res)) {
    res.status(503);
    res.set?.('Retry-After', String(SSR_DEGRADED_RETRY_AFTER_SECONDS));
    return;
  }

  res.status(404);
};
