import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta, private titleService: Title, @Inject(DOCUMENT) private dom) {}

  public generateTags(config) {
    // default values
    const defaultConfig = {
      title: 'ShareBook - Doe ou ganhe livros.',
      description:
        'Sharebook é um projeto social. Um app livre e gratuito para ajudar as pessoas a doar ou ganhar livros.' +
        ' Doe um único livro para você sentir a experiência. Do início ao fim. Nossos usuários tem relatado que é emocionante.' +
        ' Apesar de ser no anonimato você se envolve com muitas histórias incríveis.' +
        ' Você não faz ideia de como tem pessoas que realmente precisam.' +
        ' E da força transformadora que um simples livro causa na vida de uma pessoa.' +
        ' E que você ao escolher um ganhador, passa a fazer parte dessa história.',
      image: 'https://www.sharebook.com.br/assets/img/sharebook-share.png',
      slug: ''
    };

    config = { ...defaultConfig, ...config };

    const pageTitle = config.title === defaultConfig.title ? config.title : `${config.title} | ShareBook`;
    const pageUrl = config.slug ? `https://www.sharebook.com.br/livros/${config.slug}` : `https://www.sharebook.com.br/`;

    this.titleService.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: config.description });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@sharebook' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'ShareBook' });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });

    this.updateCanonicalUrl(pageUrl);
  }

  private updateCanonicalUrl(url: string) {
    let head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLLinkElement = this.dom.querySelector(`link[rel='canonical']`) || null;
    if (element == null) {
      element = this.dom.createElement('link');
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);
  }

  public addStructuredData(data: any) {
    const script = this.dom.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'structured-data';

    const oldScript = this.dom.getElementById('structured-data');
    if (oldScript) {
      oldScript.remove();
    }

    this.dom.head.appendChild(script);
  }
}
