import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-hub',
  templateUrl: './analytics-hub.component.html',
  styleUrls: ['./analytics-hub.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterLink, MatIconModule]
})
export class AnalyticsHubComponent {}
