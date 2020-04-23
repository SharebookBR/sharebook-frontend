import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieconsentComponent } from './cookieconsent.component';

describe('CookieconsentComponent', () => {
  let component: CookieconsentComponent;
  let fixture: ComponentFixture<CookieconsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieconsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieconsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
