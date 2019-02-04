import { CardItem } from '../../models/card';
import { TrelloUrls } from '../../models/TrelloUrls';
import { RepositoriesUrls } from '../../models/RepositoriesUrls';

export class TechnologiesService {
  public getTechnologies(): CardItem[] {
    const technologies: CardItem[] = [
      {
        image: 'assets/img/contribute-project/dotnet.jpg',
        title: 'Backend',
        text: '.Net core 2.x, C#, SQL Server, Web api',
        links: [
          {url: RepositoriesUrls.BACKEND, content: 'Github'},
          {url: TrelloUrls.SHAREBOOK, content: 'Trello'}
        ]
      },
      {
        image: 'assets/img/contribute-project/angular.jpg',
        title: 'Frontend',
        text: 'Angular 6, Bootstrap 4, HTML 5',
        links: [
          {url: RepositoriesUrls.FRONTEND, content: 'Github'},
          {url: TrelloUrls.SHAREBOOK, content: 'Trello'}
        ]
      },
      {
        image: 'assets/img/contribute-project/ionic.jpg',
        title: 'Mobile',
        text: 'Cordova, Ionic, Angular<br/>',
        links: [
          {url: RepositoriesUrls.MOBILE, content: 'Github'},
          {url: TrelloUrls.MOBILE, content: 'Trello'}
        ]
      },
      {
        image: 'assets/img/contribute-project/qa.jpg',
        title: 'QA',
        text: 'C#, xUnit, Selenium<br/><br/>',
        links: [
          {url: RepositoriesUrls.QA, content: 'Github'},
          {url: TrelloUrls.SHAREBOOK, content: 'Trello'}
        ]
      }
    ];

    return technologies;
  }
}
