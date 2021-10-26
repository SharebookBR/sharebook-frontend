import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterComponent } from './register.component';

import { AppConfigModule } from '../../app-config.module';
import { UserService } from '../../core/services/user/user.service';
import { AddressService } from '../../core/services/address/address.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let debugElement: DebugElement;
  let addressService: AddressService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        RouterTestingModule,
        AppConfigModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [UserService, AddressService],
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

  it('should render title in h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Registro');
  });

  it('form invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('name field validity', () => {
    const name = component.formGroup.controls['name'];
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();

    name.setValue('A');
    expect(name.hasError('minlength')).toBeTruthy();

    name.setValue('A'.repeat(201));
    expect(name.hasError('maxlength')).toBeTruthy();

    name.setValue('A'.repeat(5));
    expect(name.valid).toBeTruthy();
  });

  it('email field validity', () => {
    const email = component.formGroup.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('email@email');
    expect(email.hasError('pattern')).toBeTruthy();

    email.setValue('email@email.com');
    expect(email.valid).toBeTruthy();
  });

  it('password field validity', () => {
    const password = component.formGroup.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('A');
    expect(password.hasError('minlength')).toBeTruthy();

    password.setValue('A'.repeat(33));
    expect(password.hasError('maxlength')).toBeTruthy();

    password.setValue('A'.repeat(6));
    expect(password.valid).toBeTruthy();
  });

  it('confirmPassword field validity', () => {
    const password = component.formGroup.controls['password'];
    const confirmPassword = component.formGroup.controls['confirmPassword'];
    expect(confirmPassword.valid).toBeFalsy();

    confirmPassword.setValue('');
    expect(confirmPassword.hasError('required')).toBeTruthy();

    confirmPassword.setValue('A');
    expect(confirmPassword.hasError('MatchPassword')).toBeTruthy();

    password.setValue('A'.repeat(6));
    confirmPassword.setValue('A'.repeat(6));
    expect(confirmPassword.valid).toBeTruthy();
  });

  it('phone field validity', () => {
    const phone = component.formGroup.controls['phone'];
    expect(phone.valid).toBeFalsy();

    phone.setValue('');
    expect(phone.hasError('required')).toBeTruthy();

    phone.setValue('A');
    expect(phone.hasError('pattern')).toBeTruthy();

    phone.setValue('999999999');
    expect(phone.hasError('pattern')).toBeTruthy();

    phone.setValue('99999999999');
    expect(phone.valid).toBeFalsy();

    phone.setValue('(99) 99999-9999');
    expect(phone.valid).toBeTruthy();
  });

  it('postalCode field validity', () => {
    const postalCode = component.formGroup.controls['postalCode'];
    expect(postalCode.valid).toBeFalsy();

    postalCode.setValue('');
    expect(postalCode.hasError('required')).toBeTruthy();

    postalCode.setValue('A');
    expect(postalCode.hasError('pattern')).toBeTruthy();

    postalCode.setValue('99999');
    expect(postalCode.hasError('pattern')).toBeTruthy();

    postalCode.setValue('99999999');
    expect(postalCode.valid).toBeFalsy();

    postalCode.setValue('99999-999');
    expect(postalCode.valid).toBeTruthy();
  });

  it('postalCode with invalid value', () => {
    spyOn(addressService, 'getAddressByPostalCode').and.returnValue(
      of({
        erro: true,
      }).pipe(map((data) => {
        return addressService.convertResponseToAddress(data);
      }))
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
      }).pipe(map((data) => {
        return addressService.convertResponseToAddress(data);
      }))
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

  it('street field validity', () => {
    const street = component.formGroup.controls['street'];
    expect(street.valid).toBeFalsy();

    street.setValue('');
    expect(street.hasError('required')).toBeTruthy();

    street.setValue('street');
    expect(street.valid).toBeTruthy();
  });

  it('number field validity', () => {
    const number = component.formGroup.controls['number'];
    expect(number.valid).toBeFalsy();

    number.setValue('');
    expect(number.hasError('required')).toBeTruthy();

    number.setValue('999');
    expect(number.valid).toBeTruthy();
  });

  it('complement field validity', () => {
    const complement = component.formGroup.controls['complement'];
    expect(complement.valid).toBeTruthy();
  });

  it('neighborhood field validity', () => {
    const neighborhood = component.formGroup.controls['neighborhood'];
    expect(neighborhood.valid).toBeFalsy();

    neighborhood.setValue('');
    expect(neighborhood.hasError('required')).toBeTruthy();

    neighborhood.setValue('neighborhood');
    expect(neighborhood.valid).toBeTruthy();
  });

  it('city field validity', () => {
    const city = component.formGroup.controls['city'];
    expect(city.valid).toBeFalsy();

    city.setValue('');
    expect(city.hasError('required')).toBeTruthy();

    city.setValue('city');
    expect(city.valid).toBeTruthy();
  });

  it('state field validity', () => {
    const state = component.formGroup.controls['state'];
    expect(state.valid).toBeFalsy();

    state.setValue('');
    expect(state.hasError('required')).toBeTruthy();

    state.setValue('state');
    expect(state.valid).toBeTruthy();
  });

  it('country field validity', () => {
    const country = component.formGroup.controls['country'];
    expect(country.valid).toBeFalsy();

    country.setValue('');
    expect(country.hasError('required')).toBeTruthy();

    country.setValue('country');
    expect(country.valid).toBeTruthy();
  });

  it('allowSendingEmail field validity', () => {
    const allowSendingEmail = component.formGroup.controls['allowSendingEmail'];
    expect(allowSendingEmail.valid).toBeTruthy();
  });

  it('acceptTermOfUse field validity', () => {
    const acceptTermOfUse = component.formGroup.controls['acceptTermOfUse'];
    expect(acceptTermOfUse.valid).toBeFalsy();
  });
});
