import { AppConfigModule } from './../../../app-config.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainUsersComponent } from './main-users.component';

describe('MainUsersComponent', () => {
  let component: MainUsersComponent;
  let fixture: ComponentFixture<MainUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainUsersComponent],
      imports: [HttpClientTestingModule, AppConfigModule],
      providers: [MatDialogModule],
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
