/**
 * Limite de renderizações SSR simultâneas.
 *
 * Sob rajada (crawler), cada renderização dispara várias chamadas à API e ao
 * Postgres. Sem limite, as requisições se acumulam, ficam presas por dezenas de
 * segundos e derrubam a API. Aqui recusamos na hora, em vez de esperar.
 *
 * Só conta quem de fato renderiza: cache HIT, estáticos e requisições
 * coalescidas (que reaproveitam uma renderização em andamento) não passam por aqui.
 */

export const DEFAULT_MAX_CONCURRENT_RENDERS = 30;
export const DEFAULT_MAX_CONCURRENT_BOT_RENDERS = 18;

export interface SsrRenderLimiterSnapshot {
  inFlight: number;
  inFlightBots: number;
  peakInFlight: number;
  maxTotal: number;
  maxBots: number;
}

const CRAWLER_USER_AGENT =
  /bot|crawl|spider|slurp|facebookexternalhit|meta-externalagent|bingpreview|semrush|ahrefs|mj12|petalbot|bytespider|yandex|baidu|duckduck|gptbot|claude|perplexity|python-requests|curl\/|wget|go-http-client|headless/i;

/** UA vazio conta como bot: navegador de gente sempre manda User-Agent. */
export const isCrawlerUserAgent = (userAgent: string | undefined): boolean =>
  !userAgent || CRAWLER_USER_AGENT.test(userAgent);

export const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export class SsrRenderLimiter {
  private inFlight = 0;
  private inFlightBots = 0;
  private peakInFlight = 0;

  constructor(
    private readonly maxTotal: number = DEFAULT_MAX_CONCURRENT_RENDERS,
    private readonly maxBots: number = DEFAULT_MAX_CONCURRENT_BOT_RENDERS
  ) {}

  /**
   * Tenta ocupar uma vaga. Devolve a função que a libera (idempotente) ou `null`
   * se estourou o limite. O teto de bots é menor que o total, então sempre
   * sobra vaga reservada para humanos.
   */
  tryAcquire(isBot: boolean): (() => void) | null {
    if (this.inFlight >= this.maxTotal || (isBot && this.inFlightBots >= this.maxBots)) {
      return null;
    }

    this.inFlight++;
    if (isBot) {
      this.inFlightBots++;
    }
    this.peakInFlight = Math.max(this.peakInFlight, this.inFlight);

    let released = false;
    return () => {
      if (released) {
        return;
      }
      released = true;
      this.inFlight--;
      if (isBot) {
        this.inFlightBots--;
      }
    };
  }

  snapshot(): SsrRenderLimiterSnapshot {
    return {
      inFlight: this.inFlight,
      inFlightBots: this.inFlightBots,
      peakInFlight: this.peakInFlight,
      maxTotal: this.maxTotal,
      maxBots: this.maxBots,
    };
  }
}
