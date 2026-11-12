import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-analises-hub',
  templateUrl: './analises-hub.component.html',
  styleUrls: ['./analises-hub.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  imports: [RouterLink]
})
export class AnalisesHubComponent {}
