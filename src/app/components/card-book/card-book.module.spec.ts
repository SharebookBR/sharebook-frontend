import { CardBookModule } from './card-book.module';

describe('CardBookModule', () => {
  let cardBookModule: CardBookModule;

  beforeEach(() => {
    cardBookModule = new CardBookModule();
  });

  it('should create an instance', () => {
    expect(cardBookModule).toBeTruthy();
  });
});
