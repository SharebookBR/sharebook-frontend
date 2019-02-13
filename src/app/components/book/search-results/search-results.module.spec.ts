import { SearchResultsModule } from './search-results.module';

describe('SearchResultsModule', () => {
  let searchResultsModule: SearchResultsModule;

  beforeEach(() => {
    searchResultsModule = new SearchResultsModule();
  });

  it('should create an instance', () => {
    expect(searchResultsModule).toBeTruthy();
  });
});
