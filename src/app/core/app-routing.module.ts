import { MyaccountComponent } from '../features/account/myaccount/myaccount.component';

import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuardUser } from './guards/auth.guard.user';
import { authGuardAdmin } from './guards/auth.guard.admin';

import { HomeComponent } from '../components/home/home.component';
import { FormComponent as BookFormComponent } from '../features/book/form/form.component';
import { ListComponent as BookListComponent } from '../features/book/list/list.component';
import { DetailsComponent as BookDetailComponent } from '../features/book/details/details.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { LoginComponent } from '../features/auth/login/login.component';
import { PanelComponent } from '../components/panel/panel.component';
import { AccountComponent } from '../features/account/account/account.component';
import { ContributeProjectComponent } from '../features/static-pages/contribute-project/contribute-project.component';
import { ChangePasswordComponent } from '../features/account/change-password/change-password.component';
import { ResetPasswordComponent } from '../features/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '../features/auth/forgot-password/forgot-password.component';
import { ParentAprovalComponent } from '../features/auth/parent-aproval/parent-aproval.component';
import { ContactUsComponent } from '../features/contact/contact-us/contact-us.component';
import { RequestedsComponent } from '../features/book/requesteds/requesteds.component';
import { DonationsComponent } from '../features/book/donations/donations.component';
import { AboutComponent } from '../features/static-pages/about/about.component';
import { DonatePageComponent } from '../features/book/donate-page/donate-page.component';
import { PrivacyPolicyComponent } from '../features/static-pages/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from '../features/static-pages/terms-of-use/terms-of-use.component';
import { DataAnonymizationInfoComponent } from '../features/static-pages/data-anonymization-info/data-anonymization-info.component';
import { SearchResultsComponent } from '../components/search-results/search-results.component';
import { CategoryBooksComponent } from '../features/category/category-books/category-books.component';
import { CategoriesListComponent } from '../features/category/categories-list/categories-list.component';
import { SettingsComponent } from '../features/account/settings/settings.component';
import { UnsubscribeComponent } from '../features/auth/unsubscribe/unsubscribe.component';
import { EbookRecentComponent } from '../components/ebook-recent/ebook-recent.component';
import { NotFoundComponent } from '../features/static-pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'book/form',
    component: BookFormComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'livros/doar',
    component: BookFormComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'book/form/:id',
    component: BookFormComponent,
    canActivate: [authGuardAdmin],
  },
  {
    path: 'book/list',
    component: BookListComponent,
    canActivate: [authGuardAdmin],
  },
  {
    path: 'admin/jobs',
    loadComponent: () =>
      import('../features/admin/jobs-dashboard/jobs-dashboard.component').then(
        (m) => m.JobsDashboardComponent
      ),
    canActivate: [authGuardAdmin],
  },
  {
    path: 'admin/importer',
    loadComponent: () =>
      import('../features/admin/importer-dashboard/importer-dashboard.component').then(
        (m) => m.ImporterDashboardComponent
      ),
    canActivate: [authGuardAdmin],
  },
  {
    path: 'admin/analytics',
    loadComponent: () =>
      import('../features/admin/analytics-dashboard/analytics-dashboard.component').then(
        (m) => m.AnalyticsDashboardComponent
      ),
    canActivate: [authGuardAdmin],
  },
  {
    path: 'admin/download-logs',
    loadComponent: () =>
      import('../features/admin/download-logs-dashboard/download-logs-dashboard.component').then(
        (m) => m.DownloadLogsDashboardComponent
      ),
    canActivate: [authGuardAdmin],
  },
  {
    path: 'book/requesteds',
    component: RequestedsComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'book/donations',
    component: DonationsComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'book/donate/:id',
    component: DonatePageComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'livros/:slug',
    component: BookDetailComponent,
  },
  {
    path: 'buscar/:criteria',
    component: SearchResultsComponent,
  },
  {
    path: 'livros',
    component: CategoriesListComponent,
  },
  {
    path: 'categorias',
    component: CategoriesListComponent,
  },
  {
    path: 'categorias/:parentSlug/:slug',
    component: CategoryBooksComponent,
  },
  {
    path: 'categorias/:slug',
    component: CategoryBooksComponent,
  },
  {
    path: 'livros-digitais/novidades',
    component: EbookRecentComponent,
  },
  {
    path: 'quem-somos',
    component: AboutComponent,
  },
  {
    path: 'apoie-projeto',
    component: ContributeProjectComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'panel',
    component: PanelComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'myaccount',
    component: MyaccountComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuardUser],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'ForgotPassword/:hashCodePassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'consentimento-dos-pais/:hashCode',
    component: ParentAprovalComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'dev-tools',
    component: SettingsComponent,
  },
  {
    path: 'politica-privacidade',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'termos-de-uso',
    component: TermsOfUseComponent,
  },
  {
    path: 'anonimizacao-info',
    component: DataAnonymizationInfoComponent,
  },
  {
    path: 'descadastrar',
    component: UnsubscribeComponent,
  },
  // otherwise show 404 page
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
