import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  slug?: string;
  path?: string;
  ogType?: 'article' | 'website';
}

const SITE_URL = 'https://www.sharebook.com.br';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private dom
  ) {}

  public generateTags(config: SeoConfig) {
    // default values
    const defaultConfig = {
      title: 'ShareBook - Doe ou ganhe livros.',
      description:
        'Sharebook é um projeto social gratuito para conectar pessoas por meio da doação de livros. Doe um livro, acompanhe a jornada e transforme histórias junto com quem recebe.',
      image: 'https://www.sharebook.com.br/assets/img/sharebook-share.png',
      slug: '',
      path: '',
      ogType: 'article' as const,
    };

    config = { ...defaultConfig, ...config };

    const pageTitle = config.title === defaultConfig.title ? config.title : `${config.title} | ShareBook`;
    const configuredPath = config.path
      ? (config.path.startsWith('/') ? config.path : `/${config.path}`)
      : '';
    const pagePath = configuredPath || (config.slug ? `/livros/${config.slug}` : '/');
    const pageUrl = `${SITE_URL}${pagePath}`;

    this.titleService.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: config.description });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@sharebook' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: config.ogType });
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
