import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// used to create fake backend
import { fakeBackendProvider } from './core/helpers';

import { HomeComponent } from './components/home/home.component';
import { QuemSomosComponent } from './components/quem-somos/quem-somos.component';
import { ApoieProjetoComponent } from './components/apoie-projeto/apoie-projeto.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormComponent as BookFormComponent } from './components/book/form/form.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AlertComponent } from './core/directives/alert/alert.component';
import { PanelComponent } from './components/panel/panel.component';
import { AccountComponent } from './components/account/account.component';
import { AuthGuard } from './core/guards/auth.guard';
import { JwtInterceptor, ErrorInterceptor } from './core/helpers';
import { BookService } from './core/services/book/book.service';
import { CategoryService } from './core/services/category/category.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { UserService } from './core/services/user/user.service';
import { AlertService } from './core/services/alert/alert.service';

import { AppConfigModule } from './app-config.module';
import { ListComponent } from './components/book/list/list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  declarations: [
    AppComponent,
    BookFormComponent,
    HomeComponent,
    QuemSomosComponent,
    ApoieProjetoComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AlertComponent,
    ListComponent,
    PanelComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppConfigModule,
    Ng2SmartTableModule
  ],
  providers: [
    AuthGuard,
    BookService,
    CategoryService,
    AlertService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
