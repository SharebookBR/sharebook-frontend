import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TermsOfUseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
