import { CardItem } from '../../models/card';
import { TrelloUrls } from '../../models/TrelloUrls';
import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {
  public getTools(): CardItem[] {
    const tools: CardItem[] = [
      {
        image: 'assets/img/contribute-project/slack.jpg',
        title: 'Slack',
        text: 'Comunicação, colaboração e integração. Uma das ferramentas favoritas dos devs.',
        links: [
          {
            url: `https://join.slack.com/t/sharebookworkspace/shared_invite/enQtMzQ2Nzc5OTk3MDc4L
          TZlMmJlMjA3NGE1NDczN2QxYzc2ZWZhM2UxMzFkMDIyYjliMGI3YzdlYzg2ZjZhYjQ2YWY1ZTUyZGViNzViOWQ`,
            content: 'Convite Slack'
          }
        ]
      },
      {
        image: 'assets/img/contribute-project/trello.jpg',
        title: 'Trello',
        text: 'Chegou a hora de contribuir! Peque uma tarefa, coloque no seu nome e mova pra DOING.',
        links: [{ url: TrelloUrls.INVITATION, content: 'Convite' }, { url: TrelloUrls.SHAREBOOK, content: 'Quadro' }]
      },
      {
        image: 'assets/img/contribute-project/github.jpg',
        title: 'Git Hub',
        text: 'Aqui nós temos o cuidado de ter um histórico educativo, onde cada commit conta uma estória.',
        links: [{ url: 'https://github.com/SharebookBR', content: 'Website' }]
      },
      {
        image: 'assets/img/contribute-project/appveyor.jpg',
        title: 'AppVeyor',
        text: 'Solução fácil e amigável para integração e deploy contínuo. Integrado com Slack.',
        links: [{ url: 'https://www.appveyor.com/', content: 'Website' }]
      },
      {
        image: 'assets/img/contribute-project/smarteraspnet.jpg',
        title: 'Smarter ASP.NET',
        text: 'Hospedagem boa e barata pro seu App. Usando o link abaixo vc ajuda nosso projeto.',
        links: [{ url: 'http://www.SmarterASP.NET/index?r=raffacabofrio', content: 'Website' }]
      }
    ];

    return tools;
  }
}
