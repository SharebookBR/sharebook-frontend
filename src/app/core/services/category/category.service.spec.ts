import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { CategoryService } from './category.service';
import { AppConfigModule } from '../../../app-config.module';

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppConfigModule
      ],
      providers: [
        CategoryService,
        HttpClient,
        HttpHandler
      ]
    });
  });

  it('should be created', inject([CategoryService], (service: CategoryService) => {
    expect(service).toBeTruthy();
  }));
});
