import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RESPONSE } from 'src/express.tokens';
import { SeoService } from 'src/app/core/services/seo/seo.service';
import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent (SSR)', () => {
  const render = (initialStatus: number) => {
    const response = {
      statusCode: initialStatus,
      status: jasmine.createSpy('status').and.callFake(function (this: any, code: number) {
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
    TestBed.createComponent(NotFoundPageComponent).detectChanges();
    return response;
  };

  it('responde 404 em uma página que realmente não existe', () => {
    expect(render(200).statusCode).toBe(404);
  });

  it('não transforma em 404 um 503 já definido porque a API falhou', () => {
    const response = render(503);

    expect(response.statusCode).toBe(503);
    expect(response.status).not.toHaveBeenCalled();
  });
});
