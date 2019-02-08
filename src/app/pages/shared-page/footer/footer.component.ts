import { RepositoriesUrls } from './../../../core/models/RepositoriesUrls';
import { Link } from './../../../core/models/link';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  repositoriesLinks: Link[] = [
    {url: RepositoriesUrls.BACKEND, content: 'Backend'},
    {url: RepositoriesUrls.FRONTEND, content: 'Frontend'},
    {url: RepositoriesUrls.QA, content: 'QA'},
    {url: RepositoriesUrls.MOBILE, content: 'Mobile'}
  ];

  constructor() {}

  ngOnInit() {}

}
