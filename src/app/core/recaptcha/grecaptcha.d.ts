interface GrecaptchaRenderParameters {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

interface Window {
  grecaptcha?: {
    render(container: string | HTMLElement, parameters: GrecaptchaRenderParameters): number;
    reset(widgetId?: number): void;
    getResponse(widgetId?: number): string;
  };
}
