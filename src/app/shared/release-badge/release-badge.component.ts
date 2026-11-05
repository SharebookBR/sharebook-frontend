import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { releaseBadgeLabel } from 'src/app/core/utils/release-date';

@Component({
  selector: 'app-release-badge',
  templateUrl: './release-badge.component.html',
  styleUrls: ['./release-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ReleaseBadgeComponent {
  @Input() releaseDate?: string | null;

  public get label(): string {
    return releaseBadgeLabel(this.releaseDate);
  }
}
