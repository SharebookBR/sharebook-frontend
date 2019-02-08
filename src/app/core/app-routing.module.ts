import { HomePageComponent } from './../pages/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardUser } from './guards/auth.guard.user';
import { AuthGuardAdmin } from './guards/auth.guard.admin';

import { FormComponent as BookFormComponent } from '../components/book/form/form.component';
import { ListComponent as BookListComponent } from '../components/book/list/list.component';
import { DetailsComponent as BookDetailComponent } from '../components/book/details/details.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { PanelComponent } from '../components/panel/panel.component';
import { AccountComponent } from '../components/account/account.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { RequestedsComponent } from '../components/book/requesteds/requesteds.component';
import { DonationsComponent } from '../components/book/donations/donations.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'book/form',
    component: BookFormComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'livros/doar',
    component: BookFormComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'book/form/:id',
    component: BookFormComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'book/list',
    component: BookListComponent,
    canActivate: [AuthGuardAdmin]
  },
  {
    path: 'book/requesteds',
    component: RequestedsComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'book/donations',
    component: DonationsComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'livros/:slug',
    component: BookDetailComponent
  },
  {
    path: 'quem-somos',
    loadChildren: '../pages/about-page/about-page.module#AboutPageModule'
  },
  {
    path: 'apoie-projeto',
    loadChildren: '../pages/contribute-project-page/contribute-project-page.module#ContributeProjectPageModule'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'panel',
    component: PanelComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'ForgotPassword/:hashCodePassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'contact-us',
    loadChildren: '../pages/contact-us-page/contact-us-page.module#ContactUsPageModule'
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
