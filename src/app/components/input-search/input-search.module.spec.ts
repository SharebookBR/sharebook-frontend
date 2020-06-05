import { InputSearchModule } from './input-search.module';

describe('InputSearchModule', () => {
  let inputSearchModule: InputSearchModule;

  beforeEach(() => {
    inputSearchModule = new InputSearchModule();
  });

  it('should create an instance', () => {
    expect(inputSearchModule).toBeTruthy();
  });
});
