import { TestBed, inject } from '@angular/core/testing';

import { MenuNavigationService } from './menu-navigation.service';

describe('MenuNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuNavigationService]
    });
  });

  it('should be created', inject([MenuNavigationService], (service: MenuNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
