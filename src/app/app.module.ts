import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { APP_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageToDataUrlModule } from 'ngx-image2dataurl';
import { ImageCropperModule } from 'ngx-image-cropper';

// modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// Angular CDK
import { LayoutModule } from '@angular/cdk/layout';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './features/static-pages/about/about.component';
import { ContributeProjectComponent } from './features/static-pages/contribute-project/contribute-project.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookieconsent/cookieconsent.component';
import { FormComponent as BookFormComponent } from './features/book/form/form.component';
import { DetailsComponent as BookDetailComponent } from './features/book/details/details.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { PanelComponent } from './components/panel/panel.component';
import { AccountComponent } from './features/account/account/account.component';
import { ChangePasswordComponent } from './features/account/change-password/change-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ParentAprovalComponent } from './features/auth/parent-aproval/parent-aproval.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { RequestedsComponent } from './features/book/requesteds/requesteds.component';
import { DonationsComponent } from './features/book/donations/donations.component';
import { ContactUsComponent } from './features/contact/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './features/static-pages/privacy-policy/privacy-policy.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

import { CardMeetupComponent } from './components/card-meetup/card-meetup.component';
import { BookCardModule } from './shared/book-card/book-card.module';
import { BookShelfModule } from './shared/book-shelf/book-shelf.module';
import { ActionButtonModule } from './shared/action-button/action-button.module';


import { jwtInterceptor, errorInterceptor, transferStateInterceptor } from './core/helpers';
import { BookService } from './features/book/services/book.service';
import { CategoryService } from './features/category/services/category.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { UserService } from './core/services/user/user.service';
import { GoogleAnalyticsService } from './core/services/analytics/google-analytics.service';
import { AddressService } from './core/services/address/address.service';
import { ContactUsService } from './features/contact/services/contact-us.service';
import { MeetupService } from './core/services/meetup/meetup.service';

import { AppConfigModule } from './app-config.module';
import { ListComponent } from './features/book/list/list.component';
import { DonateComponent } from './features/book/donate/donate.component';
import { RecaptchaComponent } from './core/recaptcha/recaptcha.component';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from './core/recaptcha/recaptcha-settings';
import { NgxMaskModule } from 'ngx-mask';
import { RequestComponent } from './features/book/request/request.component';
import { TrackingComponent } from './features/book/tracking/tracking.component';
import { FacilitatorNotesComponent } from './features/book/facilitator-notes/facilitator-notes.component';
import { MainUsersComponent } from './features/book/main-users/main-users.component';
import { WinnerUsersComponent } from './features/book/winner-users/winner-users.component';
import { ConfirmationDialogComponent } from './core/directives/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './core/router/custom-reuse-strategy';
import { InputSearchModule } from './components/input-search/input-search.module';
import { DonatePageComponent } from './features/book/donate-page/donate-page.component';
import { TermsOfUseComponent } from './features/static-pages/terms-of-use/terms-of-use.component';
import { DataAnonymizationInfoComponent } from './features/static-pages/data-anonymization-info/data-anonymization-info.component';
import { DonorModalComponent } from './features/book/donor-modal/donor-modal.component';
import { FreightIncentiveDialogComponent } from './features/book/freight-incentive-dialog/freight-incentive-dialog.component';
import { CropImageDialogComponent } from './features/book/crop-image-dialog/crop-image-dialog.component';
import { MyaccountComponent } from './features/account/myaccount/myaccount.component';
import { DialogWHoAccessedComponent } from './features/account/dialog-who-accessed/dialog-who-accessed.component';
import { DialogAnonymizeComponent } from './features/account/dialog-anonymize/dialog-anonymize.component';
import { CategoryBooksComponent } from './features/category/category-books/category-books.component';
import { CategoriesListComponent } from './features/category/categories-list/categories-list.component';
import { DevModeBannerComponent } from './components/dev-mode-banner/dev-mode-banner.component';
import { SettingsComponent } from './features/account/settings/settings.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { MaisSheetComponent } from './components/mais-sheet/mais-sheet.component';
import { UnsubscribeComponent } from './features/auth/unsubscribe/unsubscribe.component';
import { JobsDashboardComponent } from './features/admin/jobs-dashboard/jobs-dashboard.component';
import { ImporterDashboardComponent } from './features/admin/importer-dashboard/importer-dashboard.component';
import { AnalyticsDashboardComponent } from './features/admin/analytics-dashboard/analytics-dashboard.component';
import { DownloadLogsDashboardComponent } from './features/admin/download-logs-dashboard/download-logs-dashboard.component';
import { EbookRecentComponent } from './components/ebook-recent/ebook-recent.component';
import { NotFoundComponent } from './features/static-pages/not-found/not-found.component';
import { NotFoundPageComponent } from './features/static-pages/not-found-page/not-found-page.component';

@NgModule({ declarations: [
        AppComponent,
        RecaptchaComponent,
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
        ParentAprovalComponent,
        ForgotPasswordComponent,
        DonateComponent,
        ContactUsComponent,
        RequestComponent,
        RequestedsComponent,
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
        DataAnonymizationInfoComponent,
        DonorModalComponent,
        FreightIncentiveDialogComponent,
        CropImageDialogComponent,
        MyaccountComponent,
        DialogWHoAccessedComponent,
        DialogAnonymizeComponent,
        CardMeetupComponent,
        SearchResultsComponent,
        CategoryBooksComponent,
        CategoriesListComponent,
        DevModeBannerComponent,
        SettingsComponent,
        BottomNavComponent,
        MaisSheetComponent,
        UnsubscribeComponent,
        JobsDashboardComponent,
        ImporterDashboardComponent,
        AnalyticsDashboardComponent,
        DownloadLogsDashboardComponent,
        EbookRecentComponent,
        NotFoundComponent,
        NotFoundPageComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AppConfigModule,
        NgxMaskModule.forRoot(),
        InputSearchModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ImageToDataUrlModule,
        ImageCropperModule,
        LayoutModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatDialogModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatAutocompleteModule,
        MatIconModule,
        MatBottomSheetModule,
        MatListModule,
        MatDividerModule,
        BookCardModule,
        BookShelfModule,
        ActionButtonModule], providers: [
        BookService,
        CategoryService,
        AuthenticationService,
        ContactUsService,
        GoogleAnalyticsService,
        AddressService,
        UserService,
        MeetupService,
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: '6LcxaXAUAAAAAGM8zgwQvgMuykwiBPgMr0P7sNL3',
            } as RecaptchaSettings,
        },
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        provideHttpClient(withXhr(), withInterceptors([jwtInterceptor, errorInterceptor, transferStateInterceptor])),
        provideClientHydration(withEventReplay()),
        { provide: APP_ID, useValue: 'angular' },
    ] })
export class AppModule {
  constructor(protected _googleAnalyticsService: GoogleAnalyticsService) {} // <-- We inject the service here to keep it alive whole time
}
