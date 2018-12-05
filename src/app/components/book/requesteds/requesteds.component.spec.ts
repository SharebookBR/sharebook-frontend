import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RequestedsComponent } from './requesteds.component';

import { AppConfigModule } from '../../../app-config.module';

describe('RequestedsComponent', () => {
  let component: RequestedsComponent;
  let fixture: ComponentFixture<RequestedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestedsComponent
      ],
      imports: [
        Ng2SmartTableModule,
        AppConfigModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
