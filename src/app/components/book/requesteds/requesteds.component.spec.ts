import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedsComponent } from './requesteds.component';

describe('RequestedsComponent', () => {
  let component: RequestedsComponent;
  let fixture: ComponentFixture<RequestedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedsComponent ]
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
