import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-data-anonymization-info',
    templateUrl: './data-anonymization-info.component.html',
    styleUrls: ['./data-anonymization-info.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DataAnonymizationInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}