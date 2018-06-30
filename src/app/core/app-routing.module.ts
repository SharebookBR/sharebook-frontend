import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { FormComponent as BookFormComponent} from '../components/book/form/form.component';
import { RegisterComponent } from '../components/register/register.component'
import { LoginComponent } from '../components/login/login.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'book/form',
    component: BookFormComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
