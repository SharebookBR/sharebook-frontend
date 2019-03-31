import { TestBed, async } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppConfigModule } from './app-config.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AlertComponent } from './core/directives/alert/alert.component';
import { FooterComponent } from './components/footer/footer.component';

import { UserService } from './core/services/user/user.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { AlertService } from './core/services/alert/alert.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        AlertComponent,
        FooterComponent
      ],
      imports: [
        RouterTestingModule,
        AppConfigModule
      ],
      providers: [
        UserService,
        AuthenticationService,

        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  /*it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular!');
  }));*/
});
