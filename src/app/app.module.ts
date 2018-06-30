import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormComponent as BookFormComponent} from './components/book/form/form.component';
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'

import { AuthGuard } from './core/guards/auth.guard'
import { BookService } from './core/services/book/book.service';
import { CategoryService } from './core/services/category/category.service';
import { UserService } from './core/services/user/user.service'

@NgModule({
  declarations: [
    AppComponent,
    BookFormComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    BookService,
    CategoryService,
    UserService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
