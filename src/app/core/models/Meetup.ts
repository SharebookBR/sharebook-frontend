export class Meetup {
  id: string;
  creationDate: Date;
  symplaEventId: number;
  title: string;
  description: string;
  startDate: string;
  cover: string;
  youtubeUrl: string;
  symplaEventUrl: string;
}

export class MeetupList {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: Meetup[];
}
