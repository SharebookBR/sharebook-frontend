import { UserService } from 'src/app/core/services/user/user.service';
import { AuthenticationService } from './../../../core/services/authentication/authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [HeaderComponent],
  providers: [
    UserService,
    AuthenticationService
  ]
})
export class HeaderModule { }
