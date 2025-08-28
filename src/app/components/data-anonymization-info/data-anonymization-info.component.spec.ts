import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAnonymizationInfoComponent } from './data-anonymization-info.component';

describe('DataAnonymizationInfoComponent', () => {
  let component: DataAnonymizationInfoComponent;
  let fixture: ComponentFixture<DataAnonymizationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAnonymizationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnonymizationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});