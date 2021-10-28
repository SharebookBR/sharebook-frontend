import { DialogWHoAccessedComponent } from './../dialog-who-accessed/dialog-who-accessed.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './../../core/services/user/user.service';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  isAdmin: boolean;
  personalData:any;
  fileContent:any;
  convertedData:any;
  whoAccessedList:any;
  private _destroySubscribes$ = new Subject<void>();

  constructor(private _scUser: UserService,public dialog: MatDialog) { }

  ngOnInit() {
    this._scUser.getProfile()
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe(profile => (this.isAdmin = profile.profile === 'Administrator' ? true : false));
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
  download(){
  this._scUser.downloadData().subscribe(data => {
    this.fileContent = JSON.stringify(data);
    this.convertedData = this.fileContent.toString()
    this.convertedData = this.convertedData.replace(/[\[\]"]+/g, '');
    this.convertedData = this.convertedData.replaceAll("street:", '');
    this.convertedData = this.convertedData.replaceAll("{", '');
    this.convertedData = this.convertedData.replaceAll("}", '');
    this.convertedData = this.convertedData.replaceAll(":", ':\t');
    this.convertedData = this.convertedData.replaceAll(",", '\n');
    this.convertedData = this.convertedData.replaceAll("name:", 'Nome:');
    this.convertedData = this.convertedData.replaceAll("email:", 'E-mail:');
    this.convertedData = this.convertedData.replaceAll("phone:", 'Telefone:');
    this.convertedData = this.convertedData.replaceAll("address:", 'Endereco:');
    this.convertedData = this.convertedData.replaceAll("linkedin:", 'LinkedIn:');
    this.convertedData = this.convertedData.replaceAll("city:", 'Cidade:');
    this.convertedData = this.convertedData.replaceAll("state:", 'Estado:');
    this.convertedData = this.convertedData.replaceAll("postalCode:", 'CEP:');
    this.convertedData = this.convertedData.replaceAll("country:", 'Pais:');
    this.convertedData = this.convertedData.replaceAll("number:", 'Numero:');
    this.convertedData = this.convertedData.replaceAll("complement:", 'Complemento:');
    this.convertedData = this.convertedData.replaceAll("neighborhood:", 'Bairro:');
    this.convertedData = this.convertedData.replaceAll("creationDate:", 'Data de Criacao:');
    this.convertedData = this.convertedData.replaceAll("allowSendingEmail:", 'Autorizacao de envio de email:');
   this.saveAsProject()
  });

  }
  saveAsProject(){

    this.writeContents(this.convertedData, 'Meus dados'+'.xls', 'sheet/xls');
  }
  writeContents(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  whoAccessed(){
    this._scUser.whoAccessed().subscribe(data => {

      this.whoAccessedList = data;
      this.dialog.open(DialogWHoAccessedComponent,{data:this.whoAccessedList,width:'100%'});

    })

  }

}
