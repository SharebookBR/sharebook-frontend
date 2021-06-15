import { AppConfigModule } from '../../../app-config.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WinnerUsersComponent } from './winner-users.component';

describe('WinnerUsersComponent', () => {
  let component: WinnerUsersComponent;
  let fixture: ComponentFixture<WinnerUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WinnerUsersComponent],
      imports: [HttpClientTestingModule, AppConfigModule],
      providers: [MatDialogModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
