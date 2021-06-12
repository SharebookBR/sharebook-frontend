import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DonorModalComponent } from './donor-modal.component';
import { AppConfigModule } from '../../../app-config.module';

describe('DonorModalComponent', () => {
  let component: DonorModalComponent;
  let fixture: ComponentFixture<DonorModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DonorModalComponent],
      imports: [
        HttpClientTestingModule,
        AppConfigModule
      ],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
