import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialog-who-accessed',
  templateUrl: './dialog-who-accessed.component.html',
  styleUrls: ['./dialog-who-accessed.component.css'],
})
export class DialogWHoAccessedComponent implements OnInit {
  who: any = [{}];

  displayedColumns: string[] = ['Data', 'Hora', 'Usuário', 'Perfil'];
  resultsLength = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    this.formatData(this.data);
  }

  formatData(data) {
    this.who.pop();
    for (const item of data) {
      this.who.push({
        date: item.visitingDay.substring(10, 0),
        time: item.visitingDay.substring(11, 19),
        name: item.visitorName,
        profile: item.profile
          .replace('Donor', 'Doador')
          .replace('Undefined', 'Não Definido')
          .replace('Winner', 'Ganhador'),
      });
    }
  }
}
