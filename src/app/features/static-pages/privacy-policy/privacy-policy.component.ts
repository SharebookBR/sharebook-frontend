import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PrivacyPolicyComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
