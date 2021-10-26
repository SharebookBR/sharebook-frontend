
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-dialog-who-accessed',
  templateUrl: './dialog-who-accessed.component.html',
  styleUrls: ['./dialog-who-accessed.component.css']
})
export class DialogWHoAccessedComponent implements OnInit {
quem: any =[{

}]
displayedColumns: string[] = ['Data', 'Hora', 'Usuário', 'Perfil'];
resultsLength = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  this.formataDados(this.data);
  }

  formataDados(data){
    this.quem.pop()
   for(let i = 0; i < data.length; i++){
    this.quem.push({
      date:(data[i].visitingDay.substring(10,0)),
      time:data[i].visitingDay.substring(11,19),
      name:data[i].visitorName,
      profile:data[i].profile
    })
   }
    for (let i = 0; i < this.quem.length; i++) {
      this.quem[i].profile = this.quem[i].profile.replace('Donor', 'Doador');
      this.quem[i].profile = this.quem[i].profile.replace('Undefined', 'Não Definido');
      this.quem[i].profile = this.quem[i].profile.replace('Winner', 'Ganhador');

    }
   }



}

