import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RESPONSE } from 'src/express.tokens';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent (SSR)', () => {
  const render = (initialStatus: number) => {
    const response = {
      statusCode: initialStatus,
      status: jasmine.createSpy('status').and.callFake((code: number) => {
        response.statusCode = code;
        return response;
      }),
    };

    TestBed.configureTestingModule({
      declarations: [NotFoundPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: RESPONSE, useValue: response },
        { provide: SeoService, useValue: { generateTags: () => {} } },
      ],
    });
    const fixture = TestBed.createComponent(NotFoundPageComponent);
    fixture.detectChanges();
    return { response, text: fixture.nativeElement.textContent as string };
  };

  it('responde 404 e mostra "não encontrada" em uma página que realmente não existe', () => {
    const { response, text } = render(200);

    expect(response.statusCode).toBe(404);
    expect(text).toContain('Página não encontrada');
  });

  it('não transforma em 404 um 503 já definido porque a API falhou, e avisa da instabilidade', () => {
    const { response, text } = render(503);

    expect(response.statusCode).toBe(503);
    expect(response.status).not.toHaveBeenCalled();
    expect(text).toContain('instabilidade');
    expect(text).not.toContain('Página não encontrada');
  });
});
