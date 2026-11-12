import { isCrawlerUserAgent, parsePositiveInt, SsrRenderLimiter } from './ssr-render-limiter';

describe('SsrRenderLimiter', () => {
  it('recusa quando o total de renderizações simultâneas é atingido', () => {
    const limiter = new SsrRenderLimiter(2, 1);

    expect(limiter.tryAcquire(false)).not.toBeNull();
    expect(limiter.tryAcquire(false)).not.toBeNull();
    expect(limiter.tryAcquire(false)).toBeNull();
  });

  it('limita bots a um teto menor e deixa vaga reservada para humanos', () => {
    const limiter = new SsrRenderLimiter(3, 1);

    expect(limiter.tryAcquire(true)).not.toBeNull();
    expect(limiter.tryAcquire(true)).toBeNull();
    expect(limiter.tryAcquire(false)).not.toBeNull();
    expect(limiter.tryAcquire(false)).not.toBeNull();
  });

  it('libera a vaga ao terminar e ignora liberação dupla', () => {
    const limiter = new SsrRenderLimiter(1, 1);
    const release = limiter.tryAcquire(true)!;

    expect(limiter.tryAcquire(false)).toBeNull();

    release();
    release();

    expect(limiter.snapshot().inFlight).toBe(0);
    expect(limiter.snapshot().inFlightBots).toBe(0);
    expect(limiter.tryAcquire(false)).not.toBeNull();
  });

  it('registra o pico de renderizações simultâneas', () => {
    const limiter = new SsrRenderLimiter(5, 5);
    const releases = [limiter.tryAcquire(false)!, limiter.tryAcquire(false)!, limiter.tryAcquire(true)!];
    releases.forEach(release => release());

    expect(limiter.snapshot().peakInFlight).toBe(3);
    expect(limiter.snapshot().inFlight).toBe(0);
  });
});

describe('isCrawlerUserAgent', () => {
  it('identifica crawlers conhecidos e User-Agent vazio', () => {
    expect(isCrawlerUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBeTrue();
    expect(isCrawlerUserAgent('meta-externalagent/1.1')).toBeTrue();
    expect(isCrawlerUserAgent('Mozilla/5.0 (compatible; SemrushBot/7~bl)')).toBeTrue();
    expect(isCrawlerUserAgent(undefined)).toBeTrue();
    expect(isCrawlerUserAgent('')).toBeTrue();
  });

  it('não trata navegador comum como bot', () => {
    expect(
      isCrawlerUserAgent(
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
      )
    ).toBeFalse();
  });
});

describe('parsePositiveInt', () => {
  it('usa o valor válido e cai no padrão quando inválido', () => {
    expect(parsePositiveInt('12', 30)).toBe(12);
    expect(parsePositiveInt(undefined, 30)).toBe(30);
    expect(parsePositiveInt('abc', 30)).toBe(30);
    expect(parsePositiveInt('0', 30)).toBe(30);
    expect(parsePositiveInt('-4', 30)).toBe(30);
  });
});
