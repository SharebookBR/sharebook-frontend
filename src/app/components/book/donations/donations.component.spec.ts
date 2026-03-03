import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

import { DonationsComponent } from './donations.component';

import { AppConfigModule } from '../../../app-config.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookService } from 'src/app/core/services/book/book.service';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';

describe('DonationsComponent', () => {
  let component: DonationsComponent;
  let fixture: ComponentFixture<DonationsComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;

  const makeDonation = (overrides: any = {}) => ({
    id: '1',
    title: 'Livro',
    author: 'Autor',
    status: BookDonationStatus.WAITING_APPROVAL,
    type: 'Physical',
    totalInterested: 0,
    downloadCount: 0,
    trackingNumber: '',
    chooseDate: new Date('2026-03-01'),
    creationDate: new Date('2026-03-01'),
    slug: 'livro',
    ...overrides,
  });

  beforeEach(waitForAsync(() => {
    bookServiceSpy = jasmine.createSpyObj<BookService>('BookService', [
      'getDonatedBooks',
      'renewChooseDate',
      'cancelDonation',
      'setTrackingNumber',
      'markAsDelivered',
      'getMainUsers',
      'getBySlug'
    ]);
    bookServiceSpy.getDonatedBooks.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [DonationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        AppConfigModule,
        MatSortModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: BookService, useValue: bookServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default filter to needsAction', () => {
    expect(component.selectedFilter).toBe('needsAction');
  });

  it('should filter only donations that need action', () => {
    component.allDonatedBooks = [
      makeDonation({ id: '1', status: BookDonationStatus.WAITING_DECISION }),
      makeDonation({ id: '2', status: BookDonationStatus.WAITING_SEND }),
      makeDonation({ id: '3', status: BookDonationStatus.RECEIVED }),
    ] as any;

    component.setFilter('needsAction');

    expect(component.donatedBooks.length).toBe(2);
    expect(component.donatedBooks.every(x =>
      x.status === BookDonationStatus.WAITING_DECISION || x.status === BookDonationStatus.WAITING_SEND
    )).toBeTrue();
  });

  it('should filter digital donations', () => {
    component.allDonatedBooks = [
      makeDonation({ id: '1', type: 'Eletronic' }),
      makeDonation({ id: '2', type: 'Physical' }),
    ] as any;

    component.setFilter('digital');

    expect(component.donatedBooks.length).toBe(1);
    expect(component.donatedBooks[0].type).toBe('Eletronic');
  });

  it('should allow tracking only for waiting send and sent physical books', () => {
    const waitingSend = makeDonation({ status: BookDonationStatus.WAITING_SEND, type: 'Physical' }) as any;
    const sent = makeDonation({ status: BookDonationStatus.SENT, type: 'Physical' }) as any;
    const received = makeDonation({ status: BookDonationStatus.RECEIVED, type: 'Physical' }) as any;
    const ebook = makeDonation({ status: BookDonationStatus.WAITING_SEND, type: 'Eletronic' }) as any;

    expect(component.canTrack(waitingSend)).toBeTrue();
    expect(component.canTrack(sent)).toBeTrue();
    expect(component.canTrack(received)).toBeFalse();
    expect(component.canTrack(ebook)).toBeFalse();
  });
});
