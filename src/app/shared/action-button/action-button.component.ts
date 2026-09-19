import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

export type ActionButtonVariant = 'primary' | 'accent' | 'success' | 'danger' | 'ghost' | 'yellow' | 'info' | 'neutral';
export type ActionButtonAppearance = 'flat' | 'stroked';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ActionButtonComponent {
  @Input() variant: ActionButtonVariant = 'primary';
  @Input() appearance: ActionButtonAppearance = 'flat';
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() target?: string;
  @Input() rel?: string;

  @Output() action = new EventEmitter<void>();

  get materialColor(): 'primary' | 'accent' | undefined {
    return this.variant === 'primary' || this.variant === 'accent' ? this.variant : undefined;
  }

  get hostClasses(): string {
    return [
      'app-action-button',
      `app-action-button--${this.variant}`,
      this.appearance === 'stroked' ? 'app-action-button--outlined' : ''
    ].filter(Boolean).join(' ');
  }

  onClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.action.emit();
  }
}
