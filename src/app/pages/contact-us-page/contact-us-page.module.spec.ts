import { ContactUsPageModule } from './contact-us-page.module';

describe('ContactUsPageModule', () => {
  let contactUsPageModule: ContactUsPageModule;

  beforeEach(() => {
    contactUsPageModule = new ContactUsPageModule();
  });

  it('should create an instance', () => {
    expect(contactUsPageModule).toBeTruthy();
  });
});
