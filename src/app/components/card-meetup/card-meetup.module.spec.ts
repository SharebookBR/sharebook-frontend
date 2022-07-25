import { CardMeetupModule } from './card-meetup.module';

describe('CardBookModule', () => {
  let cardBookModule: CardMeetupModule;

  beforeEach(() => {
    cardBookModule = new CardMeetupModule();
  });

  it('should create an instance', () => {
    expect(cardBookModule).toBeTruthy();
  });
});
