import { HomePageModule } from './home-page.module';

describe('HomePageModule', () => {
  let homePageModule: HomePageModule;

  beforeEach(() => {
    homePageModule = new HomePageModule();
  });

  it('should create an instance', () => {
    expect(homePageModule).toBeTruthy();
  });
});
