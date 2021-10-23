import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-freight-incentive-dialog',
  templateUrl: './freight-incentive-dialog.component.html',
  styleUrls: ['./freight-incentive-dialog.component.css']
})
export class FreightIncentiveDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  AbrirRegistroModico(): void {
    window.open('https://www.linkedin.com/feed/update/urn:li:activity:6447871003954540544');
  }
}
