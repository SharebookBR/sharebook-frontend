import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageToDataUrlModule } from 'ngx-image2dataurl';

// modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// used to create fake backend
import { fakeBackendProvider } from './core/helpers';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContributeProjectComponent } from './components/contribute-project/contribute-project.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookieconsent/cookieconsent.component';
import { FormComponent as BookFormComponent } from './components/book/form/form.component';
import { DetailsComponent as BookDetailComponent } from './components/book/details/details.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PanelComponent } from './components/panel/panel.component';
import { AccountComponent } from './components/account/account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RequestedsComponent } from './components/book/requesteds/requesteds.component';
import { DonationsComponent } from './components/book/donations/donations.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

import { AuthGuardUser } from './core/guards/auth.guard.user';
import { AuthGuardAdmin } from './core/guards/auth.guard.admin';

import { JwtInterceptor, ErrorInterceptor } from './core/helpers';
import { BookService } from './core/services/book/book.service';
import { CategoryService } from './core/services/category/category.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { UserService } from './core/services/user/user.service';
import { GoogleAnalyticsService } from './core/services/analytics/google-analytics.service';
import { AddressService } from './core/services/address/address.service';
import { ContactUsService } from './core/services/contact-us/contact-us.service';

import { AppConfigModule } from './app-config.module';
import { ListComponent } from './components/book/list/list.component';
import { DonateComponent } from './components/book/donate/donate.component';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
  RecaptchaFormsModule
} from 'ng-recaptcha';
import { NgxMaskModule } from 'ngx-mask';
import { RequestComponent } from './components/book/request/request.component';
import { TrackingComponent } from './components/book/tracking/tracking.component';
import { FacilitatorNotesComponent } from './components/book/facilitator-notes/facilitator-notes.component';
import { MainUsersComponent } from './components/book/main-users/main-users.component';
import { WinnerUsersComponent } from './components/book/winner-users/winner-users.component';
import { ConfirmationDialogComponent } from './core/directives/confirmation-dialog/confirmation-dialog.component';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './core/router/custom-reuse-strategy';
import { InputSearchModule } from './components/input-search/input-search.module';
import { DonatePageComponent } from './components/book/donate-page/donate-page.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { DonorModalComponent } from './components/book/donor-modal/donor-modal.component';
import { FreightIncentiveDialogComponent } from './components/book/freight-incentive-dialog/freight-incentive-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BookFormComponent,
    BookDetailComponent,
    HomeComponent,
    AboutComponent,
    ContributeProjectComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ListComponent,
    PanelComponent,
    AccountComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    DonateComponent,
    ContactUsComponent,
    RequestComponent,
    RequestedsComponent,
    ContactUsComponent,
    DonationsComponent,
    DonatePageComponent,
    ConfirmationDialogComponent,
    TrackingComponent,
    FacilitatorNotesComponent,
    MainUsersComponent,
    WinnerUsersComponent,
    PrivacyPolicyComponent,
    CookieConsentComponent,
    TermsOfUseComponent,
    DonorModalComponent,
    FreightIncentiveDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppConfigModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxMaskModule.forRoot(),
    InputSearchModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ImageToDataUrlModule,

    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,

    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [
    AuthGuardUser,
    BookService,
    CategoryService,
    AuthenticationService,
    ContactUsService,
    GoogleAnalyticsService,
    AddressService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LcxaXAUAAAAAGM8zgwQvgMuykwiBPgMr0P7sNL3',
      } as RecaptchaSettings,
    },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    AuthGuardAdmin,
    // provider used to create fake backend
    // fakeBackendProvider
  ],
  entryComponents: [
    DonateComponent,
    RequestComponent,
    ConfirmationDialogComponent,
    TrackingComponent,
    FacilitatorNotesComponent,
    MainUsersComponent,
    WinnerUsersComponent,
    DonorModalComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(protected _googleAnalyticsService: GoogleAnalyticsService) { } // <-- We inject the service here to keep it alive whole time
}
