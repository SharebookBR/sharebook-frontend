import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { CategoryService } from './category.service';
import { AppConfigModule } from '../../../app-config.module';

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule, HttpClientTestingModule],
      providers: [CategoryService],
    });
  });

  it('should be created', inject(
    [CategoryService],
    (service: CategoryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
