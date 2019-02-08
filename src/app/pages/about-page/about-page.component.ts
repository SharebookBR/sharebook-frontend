import { Component, OnInit } from '@angular/core';


import { ContributorsService } from 'src/app/core/services/contributors/contributors.service';
import { Contributor } from './../../core/models/contributor';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {

  contributors: Contributor[] = [];

  constructor(private contributorsService: ContributorsService) { }

  ngOnInit() {
    this.contributors = this.contributorsService.getContributors();
  }

}
