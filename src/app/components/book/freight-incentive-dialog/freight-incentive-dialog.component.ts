import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-freight-incentive-dialog',
  templateUrl: './freight-incentive-dialog.component.html',
  styleUrls: ['./freight-incentive-dialog.component.css']
})
export class FreightIncentiveDialogComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
  }

  AbrirRegistroModico(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://www.linkedin.com/feed/update/urn:li:activity:6447871003954540544');
    }
  }
}
