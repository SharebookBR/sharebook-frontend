import { PLATFORM_ID, TransferState } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BookService } from './book.service';
import { SsrCacheService } from 'src/app/core/services/ssr-cache/ssr-cache.service';
import { APP_CONFIG } from 'src/app/app-config.module';

describe('BookService', () => {
  const config = { apiEndpoint: 'http://api.test' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        SsrCacheService,
        TransferState,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: APP_CONFIG, useValue: config },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  describe('CRUD básico', () => {
    it('getAll: GETs the fixed high-page-size listing endpoint', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getAll().subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/1/9999`);
        expect(req.request.method).toBe('GET');
        req.flush({});
      }
    ));

    it('getById: GETs /book/:id', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getById('42').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/42`);
        expect(req.request.method).toBe('GET');
        req.flush({});
      }
    ));

    it('getBySlug: GETs /book/Slug/:slug', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getBySlug('meu-livro').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/Slug/meu-livro`);
        expect(req.request.method).toBe('GET');
        req.flush({});
      }
    ));

    it('create: POSTs the book to /book', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        const book = { title: 'Dom Casmurro' } as any;
        service.create(book).subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe(book);
        req.flush({});
      }
    ));

    it('update: PUTs the book to /book/:id', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        const book = { id: '9', title: 'Dom Casmurro' } as any;
        service.update(book).subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/9`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(book);
        req.flush({});
      }
    ));

    it('delete: DELETEs /book/:id', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.delete('9').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/9`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
      }
    ));
  });

  describe('transições de status', () => {
    it('requestBook: POSTs BookId/Reason to /book/Request/', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.requestBook('7', 'quero muito ler').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/Request/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ BookId: '7', Reason: 'quero muito ler' });
        req.flush({});
      }
    ));

    it('cancelRequest: POSTs to /book/CancelRequest/:requestId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.cancelRequest('req-1').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/CancelRequest/req-1`);
        expect(req.request.method).toBe('POST');
        req.flush({ success: true, value: true });
      }
    ));

    it('approve: POSTs an empty body to /book/Approve/:bookId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.approve('7').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/Approve/7`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush({});
      }
    ));

    it('donateBookUser: PUTs the donation payload to /book/Donate/:bookId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        const payload = { userId: '3' } as any;
        service.donateBookUser('7', payload).subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/Donate/7`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(payload);
        req.flush({});
      }
    ));

    it('cancelDonation: POSTs to /book/cancel/:bookId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.cancelDonation('7').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/cancel/7`);
        expect(req.request.method).toBe('POST');
        req.flush({});
      }
    ));

    it('markAsDelivered: POSTs to /book/MarkAsDelivered/:bookId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.markAsDelivered('7').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/MarkAsDelivered/7`);
        expect(req.request.method).toBe('POST');
        req.flush({});
      }
    ));

    it('renewChooseDate: PUTs a null body to /book/RenewChooseDate/:bookId', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.renewChooseDate('7').subscribe();
        const req = httpMock.expectOne(`${config.apiEndpoint}/book/RenewChooseDate/7`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBeNull();
        req.flush({});
      }
    ));
  });

  describe('getAdminBooks: montagem condicional de query params', () => {
    it('envia só page/pageSize quando os filtros opcionais não são informados', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getAdminBooks(1, 20).subscribe();
        const req = httpMock.expectOne(
          (r) => r.url === `${config.apiEndpoint}/book/Admin`
        );
        expect(req.request.params.get('page')).toBe('1');
        expect(req.request.params.get('pageSize')).toBe('20');
        expect(req.request.params.has('search')).toBeFalse();
        expect(req.request.params.has('status')).toBeFalse();
        expect(req.request.params.has('bucket')).toBeFalse();
        expect(req.request.params.has('type')).toBeFalse();
        req.flush({});
      }
    ));

    it('inclui search/status/type quando informados, mas omite bucket="all"', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getAdminBooks(2, 10, 'harry potter', 'Available', 'all', 'Physical').subscribe();
        const req = httpMock.expectOne(
          (r) => r.url === `${config.apiEndpoint}/book/Admin`
        );
        expect(req.request.params.get('search')).toBe('harry potter');
        expect(req.request.params.get('status')).toBe('Available');
        expect(req.request.params.has('bucket')).toBeFalse();
        expect(req.request.params.get('type')).toBe('Physical');
        req.flush({});
      }
    ));

    it('inclui bucket quando informado e diferente de "all"', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        service.getAdminBooks(1, 10, undefined, undefined, 'ebooks').subscribe();
        const req = httpMock.expectOne(
          (r) => r.url === `${config.apiEndpoint}/book/Admin`
        );
        expect(req.request.params.get('bucket')).toBe('ebooks');
        req.flush({});
      }
    ));
  });

  it('getCategoriesShowcase: busca da API na primeira chamada e serve do cache na segunda, sem novo HTTP', inject(
    [HttpTestingController, BookService],
    (httpMock: HttpTestingController, service: BookService) => {
      const data = [{ id: '1', name: 'Ficção' }] as any;

      let firstResult: any;
      service.getCategoriesShowcase().subscribe((r) => (firstResult = r));
      const req = httpMock.expectOne(`${config.apiEndpoint}/home/categories-showcase`);
      expect(req.request.method).toBe('GET');
      req.flush(data);
      expect(firstResult).toEqual(data);

      let secondResult: any;
      service.getCategoriesShowcase().subscribe((r) => (secondResult = r));
      httpMock.expectNone(`${config.apiEndpoint}/home/categories-showcase`);
      expect(secondResult).toEqual(data);
    }
  ));

  describe('createWithProgress', () => {
    it('repassa progresso de upload e emite o corpo da resposta ao final', inject(
      [HttpTestingController, BookService],
      (httpMock: HttpTestingController, service: BookService) => {
        const progressUpdates: number[] = [];
        const emissions: any[] = [];

        service.createWithProgress({ title: 'Livro' } as any, (p) => progressUpdates.push(p)).subscribe((r) => {
          if (r !== null) emissions.push(r);
        });

        const req = httpMock.expectOne(`${config.apiEndpoint}/book`);
        expect(req.request.method).toBe('POST');
        expect(req.request.reportProgress).toBeTrue();

        req.event({ type: HttpEventType.UploadProgress, loaded: 50, total: 100 } as any);
        expect(progressUpdates).toEqual([50]);

        req.event(new HttpResponse({ body: { id: '1' } }));

        expect(progressUpdates).toEqual([50, 100]);
        expect(emissions).toEqual([{ id: '1' }]);
      }
    ));
  });
});
