import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { RecaptchaComponent } from 'src/app/core/recaptcha/recaptcha.component';
import { RECAPTCHA_SETTINGS } from 'src/app/core/recaptcha/recaptcha-settings';

import { AppConfigModule } from 'src/app/app-config.module';
import { UserService } from 'src/app/core/services/user/user.service';
import { AddressService } from 'src/app/core/services/address/address.service';
import { GoogleAnalyticsService } from 'src/app/core/services/analytics/google-analytics.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let debugElement: DebugElement;
  let addressService: AddressService;

  const googleAnalyticsMock = {
    sendEvent: jasmine.createSpy('sendEvent'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [RegisterComponent, RecaptchaComponent],
    imports: [FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        RouterTestingModule,
        AppConfigModule,
        ToastrModule.forRoot(),
        NoopAnimationsModule],
    providers: [
        UserService,
        AddressService,
        { provide: GoogleAnalyticsService, useValue: googleAnalyticsMock },
        { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: 'test-site-key' } },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    addressService = TestBed.inject(AddressService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('confirmPassword field validity', () => {
    const password = component.formGroup.controls['password'];
    const confirmPassword = component.formGroup.controls['confirmPassword'];
    expect(confirmPassword.valid).toBeFalsy();

    confirmPassword.setValue('');
    expect(confirmPassword.hasError('required')).toBeTruthy();

    password.setValue('A'.repeat(6));
    confirmPassword.setValue('A');
    expect(confirmPassword.valid).toBeFalsy();

    confirmPassword.setValue('A'.repeat(6));
    expect(confirmPassword.hasError('MatchPassword')).toBeFalsy();
  });

  it('postalCode with invalid value', () => {
    spyOn(addressService, 'getAddressByPostalCode').and.returnValue(
      of({ erro: true }).pipe(map((data) => addressService.convertResponseToAddress(data)))
    );
    fixture.detectChanges();

    const postalCode = debugElement.query(By.css('#postalCode')).nativeElement;
    postalCode.dispatchEvent(new Event('blur'));

    expect(addressService.getAddressByPostalCode).toHaveBeenCalled();
    expect(debugElement.query(By.css('#street')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#complement')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#neighborhood')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#city')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#state')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#country')).nativeElement.value).toBe('');
  });

  it('postalCode with valid value', () => {
    spyOn(addressService, 'getAddressByPostalCode').and.returnValue(
      of({
        cep: '01310-940',
        logradouro: 'Avenida Paulista 900',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
        unidade: '',
        ibge: '3550308',
        gia: '1004',
      }).pipe(map((data) => addressService.convertResponseToAddress(data)))
    );
    fixture.detectChanges();

    const postalCode = debugElement.query(By.css('#postalCode')).nativeElement;
    postalCode.dispatchEvent(new Event('blur'));

    expect(addressService.getAddressByPostalCode).toHaveBeenCalled();
    expect(debugElement.query(By.css('#street')).nativeElement.value).toBe('Avenida Paulista 900');
    expect(debugElement.query(By.css('#complement')).nativeElement.value).toBe('');
    expect(debugElement.query(By.css('#neighborhood')).nativeElement.value).toBe('Bela Vista');
    expect(debugElement.query(By.css('#city')).nativeElement.value).toBe('São Paulo');
    expect(debugElement.query(By.css('#state')).nativeElement.value).toBe('SP');
    expect(debugElement.query(By.css('#country')).nativeElement.value).toBe('Brasil');
  });
});
