import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorModalComponent } from './donor-modal.component';

describe('DonorModalComponent', () => {
  let component: DonorModalComponent;
  let fixture: ComponentFixture<DonorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorModalComponent ]
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
