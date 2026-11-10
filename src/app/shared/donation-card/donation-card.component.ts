import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ActionButtonAppearance, ActionButtonVariant } from 'src/app/shared/action-button/action-button.component';

export interface DonationCardDetail {
  label?: string;
  icon?: string;
  value: string | number | null | undefined;
}

export interface DonationCardProgress {
  label: string;
  percentage: number;
  value: number;
  max: number;
  ariaLabel: string;
}

export interface DonationCardAction {
  id: string;
  label: string;
  icon: string;
  variant: ActionButtonVariant;
  appearance?: ActionButtonAppearance;
}

export interface DonationCardViewModel {
  title: string;
  author?: string;
  isDigital: boolean;
  statusLabel: string;
  statusClass: string;
  releaseDate?: string | null;
  decisionNotice?: string;
  details: DonationCardDetail[];
  progress?: DonationCardProgress;
  actions: DonationCardAction[];
}

@Component({
  selector: 'app-donation-card',
  templateUrl: './donation-card.component.html',
  styleUrls: ['./donation-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DonationCardComponent {
  @Input({ required: true }) card!: DonationCardViewModel;

  @Output() action = new EventEmitter<string>();

  public selectAction(actionId: string): void {
    this.action.emit(actionId);
  }
}
