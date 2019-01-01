import { Component, OnInit } from '@angular/core';

import { Contributor } from 'src/app/core/models/contributor';
import { ContributorsService } from 'src/app/core/services/contributors/contributors.service';

@Component({
  selector: 'app-quem-somos',
  templateUrl: './quem-somos.component.html',
  styleUrls: ['./quem-somos.component.css'],
  providers: [
    ContributorsService
  ]
})
export class QuemSomosComponent implements OnInit {

  contributors: Contributor[] = [];

  constructor(private contributorsService: ContributorsService) { }

  ngOnInit() {
    this.contributors = this.contributorsService.getContributors();
  }

}
