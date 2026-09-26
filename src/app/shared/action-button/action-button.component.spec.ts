import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ActionButtonModule } from './action-button.module';

@Component({
  template: `
    <app-action-button id="as-button" appearance="stroked">Compartilhar com amigos</app-action-button>
    <app-action-button id="as-href" appearance="stroked" href="https://example.com">Comprar na Amazon</app-action-button>
    <app-action-button id="as-router" appearance="stroked" [routerLink]="['/book/form', 'b1']">Editar livro</app-action-button>
  `,
  standalone: false,
})
class HostComponent {}

describe('ActionButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonModule],
      declarations: [HostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  function inner(id: string): HTMLElement {
    return fixture.nativeElement.querySelector(`#${id} .app-action-button`);
  }

  it('projects the label in button, href and routerLink modes', () => {
    expect(inner('as-button').textContent).toContain('Compartilhar com amigos');
    expect(inner('as-href').textContent).toContain('Comprar na Amazon');
    expect(inner('as-router').textContent).toContain('Editar livro');
  });

  it('keeps stroked primary text visible on a transparent background', () => {
    const style = getComputedStyle(inner('as-button'));

    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe('rgb(41, 171, 226)');
  });
});
