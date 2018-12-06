import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { BookService } from './book.service';

import { AppConfigModule } from '../../../app-config.module';

describe('BookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookService,
        HttpClient,
        HttpHandler
      ],
      imports: [
        AppConfigModule
      ]
    });
  });

  it('should be created', inject([BookService], (service: BookService) => {
    expect(service).toBeTruthy();
  }));
});
