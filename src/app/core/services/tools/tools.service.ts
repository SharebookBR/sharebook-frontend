import { CardItem } from '../../models/card';
import { TrelloUrls } from '../../models/TrelloUrls';
import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {
  public getTools(): CardItem[] {
    const tools: CardItem[] = [
      {
        image: 'assets/img/contribute-project/hostgator.jpg',
        title: 'HostGator',
        text: 'É a hospedagem que mantém o Sharebook no ar. Contratando pelo link abaixo, você ajuda a pagar nosso servidor.',
        links: [
          { url: 'https://indique-um-amigo.hostgator.com.br/raffacabofrio!363b9e2cc0!a?locale=pt', content: 'Website' }
        ]
      },
      {
        image: 'assets/img/contribute-project/slack.jpg',
        title: 'Slack',
        text: 'Comunicação, colaboração e integração. Uma das ferramentas favoritas dos devs.',
        links: [
          {
            url: `https://join.slack.com/t/sharebookworkspace/shared_invite/zt-4fb3uu8m-VPrkhzdI9u3lsOlS1OkVvg`,
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
        title: 'GitHub',
        text: 'Aqui nós temos o cuidado de ter um histórico educativo, onde cada commit conta uma estória.',
        links: [{ url: 'https://github.com/SharebookBR', content: 'Website' }]
      }
    ];

    return tools;
  }
}
