import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { WinnerUsersComponent } from './winner-users.component';
import { BookService } from 'src/app/core/services/book/book.service';

describe('WinnerUsersComponent', () => {
  let component: WinnerUsersComponent;
  let fixture: ComponentFixture<WinnerUsersComponent>;

  const bookServiceMock = {
    getBySlug: () => of({}),
    getMainUsers: () => of({}),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WinnerUsersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: MatDialogRef, useValue: {} },
      ],
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

  it('hasWhatsappPhone should recognize valid brazilian phones', () => {
    expect(component.hasWhatsappPhone({ phone: '(22) 99999-9999' } as any)).toBeTrue();
    expect(component.hasWhatsappPhone({ phone: '5522999999999' } as any)).toBeTrue();
    expect(component.hasWhatsappPhone({ phone: null } as any)).toBeFalse();
    expect(component.hasWhatsappPhone({ phone: '' } as any)).toBeFalse();
    expect(component.hasWhatsappPhone({ phone: '---' } as any)).toBeFalse();
  });

  it('contactWinnerOnWhatsapp should open wa.me with normalized phone and message', () => {
    spyOn(window, 'open');
    component.bookTitle = 'Meu Livro';
    component.contactWinnerOnWhatsapp({ name: 'Ana', phone: '(22) 99999-9999' } as any);

    const message = `Olá, Ana! Você ganhou o livro "Meu Livro" no Sharebook.`;
    expect(window.open).toHaveBeenCalledWith(
      `https://wa.me/5522999999999?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  });
});
