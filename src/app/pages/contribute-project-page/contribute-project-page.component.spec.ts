import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeProjectPageComponent } from './contribute-project-page.component';

describe('ContributeProjectPageComponent', () => {
  let component: ContributeProjectPageComponent;
  let fixture: ComponentFixture<ContributeProjectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributeProjectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributeProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
