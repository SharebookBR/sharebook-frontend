import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { DialogWHoAccessedComponent } from './dialog-who-accessed.component';

describe('DialogWHoAccessedComponent', () => {
  let component: DialogWHoAccessedComponent;
  let fixture: ComponentFixture<DialogWHoAccessedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogWHoAccessedComponent],
      imports: [MatDialogModule, MatTableModule, MatSortModule, MatPaginatorModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: [{ visitingDay: '2026-03-04T10:20:30', visitorName: 'Test User', profile: 'Donor' }],
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWHoAccessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
