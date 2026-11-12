import {
  isDegradingApiError,
  isSsrDegraded,
  markSsrDegraded,
  respondBookNotLoaded,
  SSR_DEGRADED_RETRY_AFTER_SECONDS,
} from './ssr-degraded';

describe('ssr-degraded', () => {
  const fakeResponse = () => {
    const res = {
      locals: {} as Record<string, unknown>,
      status: jasmine.createSpy('status'),
      set: jasmine.createSpy('set'),
    };
    return res;
  };

  describe('isDegradingApiError', () => {
    it('trata timeout, falha de rede e 5xx como erro de infraestrutura', () => {
      expect(isDegradingApiError({ name: 'TimeoutError' })).toBeTrue();
      expect(isDegradingApiError({ status: 0 })).toBeTrue();
      expect(isDegradingApiError({ status: 500 })).toBeTrue();
      expect(isDegradingApiError({ status: 503 })).toBeTrue();
    });

    it('não trata 4xx como degradação (livro inexistente é 404 de verdade)', () => {
      expect(isDegradingApiError({ status: 404 })).toBeFalse();
      expect(isDegradingApiError({ status: 401 })).toBeFalse();
      expect(isDegradingApiError(null)).toBeFalse();
    });
  });

  describe('markSsrDegraded', () => {
    it('marca a resposta da requisição e ignora ausência de resposta (navegador)', () => {
      const res = fakeResponse();
      expect(isSsrDegraded(res)).toBeFalse();

      markSsrDegraded(res);

      expect(isSsrDegraded(res)).toBeTrue();
      expect(() => markSsrDegraded(null)).not.toThrow();
    });
  });

  describe('respondBookNotLoaded', () => {
    it('responde 404 quando o livro realmente não existe', () => {
      const res = fakeResponse();

      respondBookNotLoaded(res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.set).not.toHaveBeenCalled();
    });

    it('responde 503 com Retry-After quando a API falhou na renderização', () => {
      const res = fakeResponse();
      markSsrDegraded(res);

      respondBookNotLoaded(res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.set).toHaveBeenCalledWith('Retry-After', String(SSR_DEGRADED_RETRY_AFTER_SECONDS));
    });
  });
});
