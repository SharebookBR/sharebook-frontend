import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RequestedsComponent } from './requesteds.component';

import { AppConfigModule } from '../../../app-config.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DonorModalComponent } from '../donor-modal/donor-modal.component';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('RequestedsComponent', () => {
  let component: RequestedsComponent;
  let fixture: ComponentFixture<RequestedsComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestedsComponent],
      imports: [
        MatTableModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatInputModule,
        AppConfigModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatDialogModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    }).compileComponents();
  }));

  TestBed.overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [DonorModalComponent]
    }
  });


  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;

      fixture = TestBed.createComponent(RequestedsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(DonorModalComponent,
      {
        minWidth: 450
      });

    expect(dialogRef.componentInstance instanceof DonorModalComponent).toBe(true);
  });

});
