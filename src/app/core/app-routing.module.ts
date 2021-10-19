
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardUser } from './guards/auth.guard.user';
import { AuthGuardAdmin } from './guards/auth.guard.admin';

import { HomeComponent } from '../components/home/home.component';
import { FormComponent as BookFormComponent } from '../components/book/form/form.component';
import { ListComponent as BookListComponent } from '../components/book/list/list.component';
import { DetailsComponent as BookDetailComponent } from '../components/book/details/details.component';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from '../components/login/login.component';
import { PanelComponent } from '../components/panel/panel.component';
import { AccountComponent } from '../components/account/account.component';
import { ContributeProjectComponent } from '../components/contribute-project/contribute-project.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { RequestedsComponent } from '../components/book/requesteds/requesteds.component';
import { DonationsComponent } from '../components/book/donations/donations.component';
import { AboutComponent } from '../components/about/about.component';
import { DonatePageComponent } from '../components/book/donate-page/donate-page.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from '../components/terms-of-use/terms-of-use.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
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
    path: 'book/search',
    loadChildren: () => import('../components/book/search-results/search-results.module').then(m => m.SearchResultsModule)
  },
  {
    path: 'book/donate/:id',
    component: DonatePageComponent,
    canActivate: [AuthGuardUser]
  },
  {
    path: 'livros/:slug',
    component: BookDetailComponent
  },
  {
    path: 'quem-somos',
    component: AboutComponent
  },
  {
    path: 'apoie-projeto',
    component: ContributeProjectComponent
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
    component: ContactUsComponent
  },
  {
    path: 'politica-privacidade',
    component: PrivacyPolicyComponent
  },
  {
    path: 'termos-de-uso',
    component: TermsOfUseComponent
  },
  // otherwise redirect to home
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
