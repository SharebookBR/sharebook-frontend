import { Link } from './link';

export class Card {
  image: string;
  links: Link[];
}

export class CardItem extends Card {
  title: string;
  text: string;
}
