import {Injectable} from '@angular/core';
import {Meta} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta: Meta) {
  }

  public generateTags(config) {
    // default values
    config = {
      title: 'ShareBook - Doe ou ganhe livros.',
      description: 'Sharebook é um projeto social. Um app livre e gratuito para ajudar as pessoas a doar ou ganhar livros.' +
        ' Doe um único livro para você sentir a experiência. Do início ao fim. Nossos usuários tem relatado que é emocionante.' +
        ' Apesar de ser no anonimato você se envolve com muitas histórias incríveis.' +
        ' Você não faz ideia de como tem pessoas que realmente precisam.' +
        ' E da força transformadora que um simples livro causa na vida de uma pessoa.' +
        ' E que você ao escolher um ganhador, passa a fazer parte dessa história.',
      image: 'https://www.sharebook.com.br/assets/img/sharebook-share.png',
      slug: '',
      ...config
    };

    this.meta.updateTag({name: 'twitter:card', content: 'summary'});
    this.meta.updateTag({name: 'twitter:site', content: '@sharebook'});
    this.meta.updateTag({name: 'twitter:title', content: config.title});
    this.meta.updateTag({name: 'twitter:description', content: config.description});
    this.meta.updateTag({name: 'twitter:image', content: config.image});

    this.meta.updateTag({property: 'og:type', content: 'article'});
    this.meta.updateTag({property: 'og:site_name', content: 'ShareBook'});
    this.meta.updateTag({property: 'og:title', content: config.title});
    this.meta.updateTag({property: 'og:description', content: config.description});
    this.meta.updateTag({property: 'og:image', content: config.image});
    this.meta.updateTag({property: 'og:url', content: `https://www.sharebook.com.br/${config.slug}`});
  }
}
