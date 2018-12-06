import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { DonationsComponent } from './donations.component';

import { AppConfigModule } from '../../../app-config.module';

describe('DonationsComponent', () => {
  let component: DonationsComponent;
  let fixture: ComponentFixture<DonationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DonationsComponent
      ],
      imports: [
        Ng2SmartTableModule,
        AppConfigModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
