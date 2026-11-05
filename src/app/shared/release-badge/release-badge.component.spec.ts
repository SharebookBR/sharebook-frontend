import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseBadgeComponent } from './release-badge.component';

describe('ReleaseBadgeComponent', () => {
  let fixture: ComponentFixture<ReleaseBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReleaseBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseBadgeComponent);
  });

  it('uses the shared upcoming-release label', () => {
    fixture.componentInstance.releaseDate = '2999-01-11';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Em breve ·');
  });
});
