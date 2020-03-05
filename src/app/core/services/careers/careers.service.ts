import { CardItem } from '../../models/card';

export class CareersService {
  linkedinUrl: string;

  public getCareers(): CardItem[] {
    this.linkedinUrl = 'https://www.linkedin.com/in/raffacabofrio/';

    const careers: CardItem[] = [
      {
        image: 'assets/img/contribute-project/business_plan.jpg',
        title: 'Business Plan',
        text: 'Estratégia, motivação, liderança.<br/><br/><br/>',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      },
      {
        image: 'assets/img/contribute-project/marketing.jpg',
        title: 'Marketing',
        text: 'Divulgação, patrocínio, parcerias, fidelização.<br/><br/>',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      },
      {
        image: 'assets/img/contribute-project/vendas.jpg',
        title: 'Vendas',
        text: 'Tudo é venda, mesmo que não seja comercial. Ideias, engajamento.',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      },
      {
        image: 'assets/img/contribute-project/rh.jpg',
        title: 'RH',
        text: 'Engajamento do time. Motivação.<br/><br/><br/>',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      },
      {
        image: 'assets/img/contribute-project/juridico.jpg',
        title: 'Jurídico',
        text: 'Que cuidados devemos tomar?',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      },
      {
        image: 'assets/img/contribute-project/cientista_dados.jpg',
        title: 'Data Science',
        text: 'Explorar. Apresentar. Prever.',
        links: [{ url: this.linkedinUrl, content: 'Linkedin' }]
      }
    ];

    return careers;
  }
}
