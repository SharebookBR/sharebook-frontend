import { CardItem } from '../../models/card';

export class CareersService {
  linkedinUrl: string;

  public getCareers(): CardItem[] {

    this.linkedinUrl = 'https://www.linkedin.com/in/raffacabofrio/';

    const careers: CardItem[] = [
      {
        image: 'assets/img/apoie-projeto/business_plan.jpg',
        title: 'Business Plan',
        text: 'Estratégia, motivação, liderança.<br/><br/><br/>',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      },
      {
        image: 'assets/img/apoie-projeto/marketing.jpg',
        title: 'Marketing',
        text: 'Divulgação, patrocínio, parcerias, fidelização.<br/><br/>',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      },
      {
        image: 'assets/img/apoie-projeto/vendas.jpg',
        title: 'Vendas',
        text: 'Tudo é venda, mesmo que não seja comercial. Ideias, engajamento.',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      },
      {
        image: 'assets/img/apoie-projeto/rh.jpg',
        title: 'RH',
        text: 'Engajamento do time. Motivação.<br/><br/><br/>',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      },
      {
        image: 'assets/img/apoie-projeto/juridico.jpg',
        title: 'Jurídico',
        text: 'Que cuidados devemos tomar?',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      },
      {
        image: 'assets/img/apoie-projeto/cientista_dados.jpg',
        title: 'Data Science',
        text: 'Explorar. Apresentar. Prever.',
        links: [
          {url: this.linkedinUrl, content: 'Linkedin'}
        ]
      }
    ];

    return careers;
  }
}
