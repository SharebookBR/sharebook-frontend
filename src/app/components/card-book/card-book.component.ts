import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.css']
})
export class CardBookComponent implements OnInit {

  @Input()
  public content: any;

  constructor() { }

  ngOnInit() {
  }

}
