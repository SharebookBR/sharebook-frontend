import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';

import { BookService } from 'src/app/features/book/services/book.service';
import { PlatformService } from 'src/app/core/services/platform/platform.service';
import { EbookDownloadUrlService, parsePresignedUrlExpiration } from './ebook-download-url.service';

describe('EbookDownloadUrlService', () => {
  const now = Date.UTC(2026, 9, 4, 12, 0, 0);
  const slug = 'o-banqueiro-anarquista';

  // URL SigV4 assinada "agora", válida por 300s.
  const presignedUrl =
    'https://bucket.s3.sa-east-1.amazonaws.com/ebooks/livro.pdf' +
    '?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20261004T120000Z&X-Amz-Expires=300&X-Amz-Signature=abc';

  let service: EbookDownloadUrlService;
  let bookService: jasmine.SpyObj<BookService>;
  let isBrowser: boolean;

  beforeEach(() => {
    sessionStorage.clear();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(now));
    isBrowser = true;

    bookService = jasmine.createSpyObj<BookService>('BookService', ['createDownloadEbookUrl']);
    bookService.createDownloadEbookUrl.and.returnValue(of({ url: presignedUrl, tracked: true }));

    TestBed.configureTestingModule({
      providers: [
        EbookDownloadUrlService,
        { provide: BookService, useValue: bookService },
        { provide: PlatformService, useValue: { isBrowser: () => isBrowser } },
      ],
    });

    service = TestBed.inject(EbookDownloadUrlService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    sessionStorage.clear();
  });

  it('reusa a URL assinada no segundo clique sem chamar o back', async () => {
    expect(await service.getDownloadUrl(slug)).toBe(presignedUrl);
    expect(await service.getDownloadUrl(slug)).toBe(presignedUrl);

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(1);
  });

  it('chama o back de novo quando a URL entra na margem de expiração', async () => {
    await service.getDownloadUrl(slug);

    jasmine.clock().mockDate(new Date(now + 271_000)); // faltam 29s, dentro da folga de 30s
    await service.getDownloadUrl(slug);

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(2);
  });

  it('ainda reusa a URL pouco antes da margem de expiração', async () => {
    await service.getDownloadUrl(slug);

    jasmine.clock().mockDate(new Date(now + 269_000)); // faltam 31s
    await service.getDownloadUrl(slug);

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(1);
  });

  it('toque duplo: cliques durante a requisição compartilham a mesma resposta', async () => {
    const response$ = new Subject<{ url: string; tracked: boolean }>();
    bookService.createDownloadEbookUrl.and.returnValue(response$);

    const first = service.getDownloadUrl(slug);
    const second = service.getDownloadUrl(slug);
    const third = service.getDownloadUrl(slug);

    response$.next({ url: presignedUrl, tracked: true });
    response$.complete();

    expect(await Promise.all([first, second, third])).toEqual([presignedUrl, presignedUrl, presignedUrl]);
    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(1);
  });

  it('não guarda URL sem expiração (endpoint legado do próprio back)', async () => {
    const legacyUrl = 'https://api.sharebook.com.br/api/book/DownloadEBook/' + slug;
    bookService.createDownloadEbookUrl.and.returnValue(of({ url: legacyUrl, tracked: false }));

    await service.getDownloadUrl(slug);
    await service.getDownloadUrl(slug);

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(2);
  });

  it('cache é por livro', async () => {
    await service.getDownloadUrl(slug);
    await service.getDownloadUrl('outro-livro');

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(2);
  });

  it('erro do back (ex.: 429) propaga e não deixa nada em cache', async () => {
    bookService.createDownloadEbookUrl.and.returnValue(throwError(() => 'limite'));

    await expectAsync(service.getDownloadUrl(slug)).toBeRejected();

    bookService.createDownloadEbookUrl.and.returnValue(of({ url: presignedUrl, tracked: true }));
    expect(await service.getDownloadUrl(slug)).toBe(presignedUrl);
    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(2);
  });

  it('ignora valor corrompido no storage', async () => {
    sessionStorage.setItem('sharebook-ebook-url:' + slug, '{não é json');

    expect(await service.getDownloadUrl(slug)).toBe(presignedUrl);
    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(1);
  });

  it('no SSR não usa storage', async () => {
    isBrowser = false;

    await service.getDownloadUrl(slug);
    await service.getDownloadUrl(slug);

    expect(bookService.createDownloadEbookUrl).toHaveBeenCalledTimes(2);
  });
});

describe('parsePresignedUrlExpiration', () => {
  it('SigV4: soma X-Amz-Expires a X-Amz-Date', () => {
    const url = 'https://b.s3.amazonaws.com/k.pdf?X-Amz-Date=20261004T120000Z&X-Amz-Expires=300&X-Amz-Signature=x';
    expect(parsePresignedUrlExpiration(url)).toBe(Date.UTC(2026, 9, 4, 12, 5, 0));
  });

  it('SigV2: usa Expires em segundos epoch', () => {
    const url = 'https://b.s3.amazonaws.com/k.pdf?AWSAccessKeyId=a&Expires=1791115500&Signature=x';
    expect(parsePresignedUrlExpiration(url)).toBe(1791115500 * 1000);
  });

  it('retorna null para URL sem assinatura', () => {
    expect(parsePresignedUrlExpiration('https://api.sharebook.com.br/api/book/DownloadEBook/x')).toBeNull();
  });

  it('retorna null para X-Amz-Date malformado', () => {
    expect(parsePresignedUrlExpiration('https://b/k?X-Amz-Date=ontem&X-Amz-Expires=300')).toBeNull();
  });

  it('retorna null para URL inválida', () => {
    expect(parsePresignedUrlExpiration('não é url')).toBeNull();
  });
});
