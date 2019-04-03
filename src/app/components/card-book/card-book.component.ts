import { Component, OnInit, Input } from '@angular/core';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-card-book',
  templateUrl: './card-book.component.html',
  styleUrls: ['./card-book.component.css']
})
export class CardBookComponent implements OnInit {

  @Input()
  public content: any;
  private isApprovedBadge: string;
  private isApprovedText: string;

  constructor() { }

  ngOnInit() {

    if ( this.content.approved ) {
      this.isApprovedBadge = 'badge badge-success mr-auto';
      this.isApprovedText  = 'Disponível';
    } else {
      this.isApprovedBadge = 'badge badge-danger mr-auto';
      this.isApprovedText  = 'Não Disponível';
    }
  }

}
