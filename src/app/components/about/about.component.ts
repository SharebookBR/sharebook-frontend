import { Component, OnInit } from '@angular/core';

import { Contributor } from 'src/app/core/models/contributor';
import { ContributorsService } from 'src/app/core/services/contributors/contributors.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [
    ContributorsService
  ]
})
export class AboutComponent implements OnInit {

  contributors: Contributor[] = [];

  constructor(private contributorsService: ContributorsService) { }

  ngOnInit() {
    this.contributors = this.contributorsService.getContributors();
  }

}
