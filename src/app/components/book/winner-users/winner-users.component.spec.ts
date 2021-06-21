import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfigModule } from '../../../app-config.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { WinnerUsersComponent } from './winner-users.component';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('WinnerUsersComponent', () => {
  let component: WinnerUsersComponent;
  let fixture: ComponentFixture<WinnerUsersComponent>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WinnerUsersComponent],
      imports: [HttpClientTestingModule, AppConfigModule, BrowserAnimationsModule],
      providers: [MatDialogModule],
    }).compileComponents();
  }));

  TestBed.overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [WinnerUsersComponent]
    }
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(WinnerUsersComponent, {
      data: {}
    });

    expect(dialogRef.componentInstance instanceof WinnerUsersComponent).toBe(true);
  });
});
