import { of } from 'rxjs';

import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  it('uses the public search result without filtering statuses on the client', () => {
    const books = [
      { id: 'available', status: 'Available' },
      { id: 'other-status', status: 'WaitingSend' },
    ] as any;
    const bookService = jasmine.createSpyObj('BookService', ['getFullSearch']);
    const analytics = jasmine.createSpyObj('GoogleAnalyticsService', ['sendEvent']);
    bookService.getFullSearch.and.returnValue(of({ items: books }));

    const component = new SearchResultsComponent(
      {} as any,
      {} as any,
      bookService,
      analytics
    );
    component.criteria = 'clean code';

    component.searchBooks();

    expect(component.books).toEqual(books);
    expect(analytics.sendEvent).toHaveBeenCalledWith('search', {
      search_term: 'clean code',
      results_count: 2,
    });
  });
});
