import { AppConfigModule } from './../../../app-config.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainUsersComponent } from './main-users.component';

describe('MainUsersComponent', () => {
  let component: MainUsersComponent;
  let fixture: ComponentFixture<MainUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainUsersComponent],
      imports: [HttpClientTestingModule, AppConfigModule],
      providers: [NgbActiveModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
