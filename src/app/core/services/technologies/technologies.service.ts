import { CardItem } from '../../models/card';
import { TrelloUrls } from '../../models/TrelloUrls';
import { RepositoriesUrls } from '../../models/RepositoriesUrls';
import { Injectable } from '@angular/core';

@Injectable()
export class TechnologiesService {
  public getTechnologies(): CardItem[] {
    const technologies: CardItem[] = [
      {
        image: 'assets/img/contribute-project/dotnet.jpg',
        title: 'Backend',
        text: '.Net 6, C#, SQL Server, AWS SQS',
        links: [{ url: RepositoriesUrls.BACKEND, content: 'Github' }, { url: TrelloUrls.SHAREBOOK, content: 'Trello' }]
      },
      {
        image: 'assets/img/contribute-project/angular.jpg',
        title: 'Frontend',
        text: 'Angular 13+, Typescript 4, Material Design, HTML 5',
        links: [{ url: RepositoriesUrls.FRONTEND, content: 'Github' }, { url: TrelloUrls.FRONTEND, content: 'Trello' }]
      },
      {
        image: 'assets/img/contribute-project/ionic.jpg',
        title: 'Mobile',
        text: 'Cordova, Ionic 3, Angular<br/>',
        links: [{ url: RepositoriesUrls.MOBILE, content: 'Github' }, { url: TrelloUrls.MOBILE, content: 'Trello' }]
      },
      {
        image: 'assets/img/contribute-project/ui-ux.jpg',
        title: 'UI/UX Design',
        text: 'Personas, User Stories, MockFlow, Figma',
        links: [{ url: RepositoriesUrls.UIUX, content: 'Figma' }]
      }
    ];

    return technologies;
  }
}
