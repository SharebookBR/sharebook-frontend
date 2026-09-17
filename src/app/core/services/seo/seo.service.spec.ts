import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let document: Document;
  let meta: Meta;
  let service: SeoService;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    document = TestBed.inject(DOCUMENT);
    meta = TestBed.inject(Meta);
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
  });

  it('should generate complete metadata for a public path', () => {
    service.generateTags({
      title: 'Tecnologia > IA - Livros',
      description: 'Livros de inteligência artificial disponíveis no ShareBook.',
      path: '/categorias/tecnologia/ia',
      ogType: 'website',
    });

    expect(title.getTitle()).toBe('Tecnologia > IA - Livros | ShareBook');
    expect(meta.getTag("name='description'")?.content)
      .toBe('Livros de inteligência artificial disponíveis no ShareBook.');
    expect(meta.getTag("name='twitter:description'")?.content)
      .toBe('Livros de inteligência artificial disponíveis no ShareBook.');
    expect(meta.getTag("property='og:description'")?.content)
      .toBe('Livros de inteligência artificial disponíveis no ShareBook.');
    expect(meta.getTag("name='twitter:title'")?.content)
      .toBe('Tecnologia > IA - Livros | ShareBook');
    expect(meta.getTag("property='og:type'")?.content).toBe('website');
    expect(meta.getTag("property='og:url'")?.content)
      .toBe('https://www.sharebook.com.br/categorias/tecnologia/ia');
    expect(document.querySelector("link[rel='canonical']")?.getAttribute('href'))
      .toBe('https://www.sharebook.com.br/categorias/tecnologia/ia');
  });

  it('should preserve the PDP URL contract when a slug is provided', () => {
    service.generateTags({
      title: 'Livro de teste',
      description: 'Descrição de teste.',
      slug: 'livro-de-teste',
    });

    expect(meta.getTag("property='og:type'")?.content).toBe('article');
    expect(meta.getTag("property='og:url'")?.content)
      .toBe('https://www.sharebook.com.br/livros/livro-de-teste');
    expect(document.querySelector("link[rel='canonical']")?.getAttribute('href'))
      .toBe('https://www.sharebook.com.br/livros/livro-de-teste');
  });
});
