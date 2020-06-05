import { Contributor } from '../../models/contributor';

export class ContributorsService {
  public getContributors(): Contributor[] {
    const contributors: Contributor[] = [
      {
        image: 'assets/img/top_contributors/raffa.jpg',
        name: 'Raffaello Damgaard',
        position: 'Product Owner',
        links: [
          {
            url: 'https://www.linkedin.com/in/raffacabofrio/',
            content: 'Linkedin',
          },
          { url: 'https://www.github.com/raffacabofrio/', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/vagner.jpg',
        name: 'Vagner Nunes',
        position: 'Product Advisor',
        links: [
          { url: 'https://www.linkedin.com/in/vnunes/', content: 'Linkedin' },
        ],
      },
      {
        image: 'assets/img/top_contributors/antero.jpg',
        name: 'William Pavei Antero',
        position: 'Leader Frontend Developer',
        links: [
          { url: 'https://www.linkedin.com/in/wantero/', content: 'Linkedin' },
          { url: 'https://github.com/wantero', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/max.jpg',
        name: 'Max Gomes',
        position: 'Leader Mobile Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/maxgomes92/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/maxgomes92', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/daniel.jpg',
        name: 'Daniel Aloísio',
        position: 'Backend Developer/ Architect',
        links: [
          {
            url:
              'https://www.linkedin.com/in/daniel-alo%C3%ADsio-oliveira-da-silva-06242291/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/danielaloisio', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/walter.jpg',
        name: 'Walter Vinicius',
        position: 'Fullstack Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/walter-cardoso-aab682a8/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/walter-lopes', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/pedro_moreira.jpg',
        name: 'Pedro Moreira',
        position: 'Designer',
        links: [
          {
            url: 'https://www.linkedin.com/in/pedro-moreira-91369933/',
            content: 'Linkedin',
          },
        ],
      },
      {
        image: 'assets/img/top_contributors/everton.jpg',
        name: 'Everton de Jesus',
        position: 'FrontEnd Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/everton-de-jesus-01295413b/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/Everton1982', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/erisvaldo.jpg',
        name: 'Erisvaldo Correia',
        position: 'FrontEnd Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/erisvaldo-correia-46574850/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/ErisvaldoCorreia', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/ratton.jpg',
        name: 'Marcelo Ratton',
        position: 'Technical Advisor',
        links: [
          { url: 'https://www.linkedin.com/in/rattones/', content: 'Linkedin' },
        ],
      },
      {
        image: 'assets/img/top_contributors/montanha.jpg',
        name: 'Roberto Montanha',
        position: 'Facilitador',
        links: [
          {
            url: 'https://www.linkedin.com/in/robertomontanha/',
            content: 'Linkedin',
          },
        ],
      },
      {
        image: 'assets/img/top_contributors/manoel-jr.jpg',
        name: 'Manoel Júnior',
        position: 'Facilitador',
        links: [
          { url: 'https://www.linkedin.com/in/msjunior/', content: 'Linkedin' },
        ],
      },
      {
        image: 'assets/img/top_contributors/rodrigo-silva.jpg',
        name: 'Rodrigo Silva',
        position: 'Facilitador',
        links: [
          {
            url: 'https://www.linkedin.com/in/rodrigoesilva/',
            content: 'Linkedin',
          },
        ],
      },
      {
        image: 'assets/img/top_contributors/abraao.jpeg',
        name: 'Abraão Allysson',
        position: 'Fullstack Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/abraaohonorio/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/AbraaoHonorio', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/kalil-ventura.jpeg',
        name: 'Kalil Ventura',
        position: 'Backend Developer',
        links: [
          {
            url: 'https://www.linkedin.com/in/kalilventura/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/kalilventura', content: 'Github' },
        ],
      },
      {
        image: 'assets/img/top_contributors/flavio-landes.jpeg',
        name: 'Flávio Landes',
        position: 'Backend Developer',
        links: [
          {
            url:
              'https://www.linkedin.com/in/fl%C3%A1vio-barreiro-landes-5a0231157/',
            content: 'Linkedin',
          },
          { url: 'https://github.com/FlavioLandes', content: 'Github' },
        ],
      },
    ];

    return contributors;
  }
}
