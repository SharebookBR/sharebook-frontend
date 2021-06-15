import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { TrackingComponent } from './tracking.component';
import { AppConfigModule } from '../../../app-config.module';

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AppConfigModule,
        HttpClientTestingModule,
      ],
      providers: [MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
