import { BookToAdminProfile } from './../../../core/models/BookToAdminProfile';
import { Category } from './../../../core/models/category';
import { User } from './../../../core/models/user';
import { CategoryService } from './../../../core/services/category/category.service';
import { BookService } from './../../../core/services/book/book.service';
import { UserService } from './../../../core/services/user/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { ImageToDataUrlModule } from 'ngx-image2dataurl';
import { By, BrowserTransferStateModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FormComponent } from './form.component';

import { AppConfigModule } from '../../../app-config.module';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

let component: FormComponent;
let fixture: ComponentFixture<FormComponent>;
let userService: UserService;
let bookService: BookService;
let categoryService: CategoryService;

const userArray: User[] = [
  {
    id: '54338afc-7674-46a3-9e35-1f8babd99d6b',
    name: 'Cussa (3)',
    email: null,
    linkedin: null,
    phone: null,
    address: null,
  },
  {
    id: '41de867c-b1b6-413d-b8b0-5427d907ef0d',
    name: 'Vagner (1)',
    email: null,
    linkedin: null,
    phone: null,
    address: null,
  },
];

const validForm = {
  title: 'Book Title',
  author: 'Book Author',
  categoryId: '95f5dc4a-1dff-4f70-92e1-e1c8a150886b',
  userId: '5b6f7ded-6163-4915-9ff8-d96a9b802220',
  freightOption: 'WithoutFreight',
  synopsis: 'Book Synopsis',
  agreeToTerms: true,
};

const freightOptionsArray = [
  { value: 'City', text: 'Cidade' },
  { value: 'State', text: 'Estado' },
  { value: 'Country', text: 'País' },
  { value: 'World', text: 'Mundo' },
  { value: 'WithoutFreight', text: 'Não' },
];

const categoryServiceArray: Category[] = [
  { id: '1', name: 'Administração' },
  { id: '2', name: 'Artes' },
  { id: '3', name: 'Aventura' },
  { id: '4', name: 'Ciências Biológicas' },
  { id: '5', name: 'Direito' },
  { id: '6', name: 'Engenharia' },
  { id: '7', name: 'Geografia e História' },
  { id: '8', name: 'Informática' },
  { id: '9', name: 'Medicina' },
  { id: '10', name: 'Psicologia' },
];


function setFormValues(formData) {
  component.formGroup.controls['userId'].setValue(formData.userId);
  component.formGroup.controls['title'].setValue(formData.title);
  component.formGroup.controls['author'].setValue(formData.author);
  component.formGroup.controls['categoryId'].setValue(formData.categoryId);
  component.formGroup.controls['userIdFacilitator'].setValue(formData.userIdFacilitator);
  component.formGroup.controls['imageName'].setValue(formData.imageName);
  component.formGroup.controls['freightOption'].setValue(formData.freightOption);
  component.formGroup.controls['synopsis'].setValue(formData.synopsis);
  component.formGroup.controls['agreeToTerms'].setValue(formData.agreeToTerms);
  component.formGroup.controls['approve'].setValue(formData.approve);
}

describe('FormComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatAutocompleteModule,
        RouterTestingModule,
        AppConfigModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        ImageToDataUrlModule,
        BrowserTransferStateModule,
        NoopAnimationsModule
      ],
      providers: [
        UserService,
        BookService,
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    bookService = TestBed.inject(BookService);
    categoryService = TestBed.inject(CategoryService);
    spyOn(userService, 'getProfile').and.returnValue(of({ profile: 'User' }));
    spyOn(userService, 'getLoggedUserFromLocalStorage').and.returnValue({
      authenticated: true,
      created: '2020-06-16T14:38:45.5301947-07:00',
      expiration: '2020-06-17T14:38:45.5301947-07:00',
      accessToken: 'myToken',
      name: 'William Dev',
      email: 'william+dev@gmail.com',
      userId: '5b6f7ded-6163-4915-9ff8-d96a9b802220',
      profile: 'User',
      message: 'OK',
    });
    spyOn(bookService, 'getFreightOptions').and.returnValue(of(freightOptionsArray));
    spyOn(categoryService, 'getAll').and.returnValue(of(categoryServiceArray as any));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add book', () => {
    spyOn(bookService, 'create').and.returnValue(
      of({
        value: null,
        messages: [],
        successMessage: 'Livro cadastrado com sucesso! Aguarde aprovação.',
        success: true,
      })
    );
    fixture.detectChanges();

    setFormValues(validForm);
    component.isImageLoaded = true;
    const compiled = fixture.debugElement.nativeElement;
    const getForm = fixture.debugElement.query(By.css('#formGroup'));
    expect(getForm.triggerEventHandler('submit', compiled)).toBeUndefined();
    expect(component.pageTitle).toBe('Obrigado por ajudar.');
  });
});

describe('FormComponent Editing book', () => {
  const bookToAdminProfile: BookToAdminProfile = {
    author: 'teste',
    category: 'Administração',
    categoryId: '7f6cd8dd-bc79-40b6-9b41-47ffe71e2d34',
    downloadCount: 0,
    chooseDate: null,
    city: 'Cabo Frio',
    creationDate: new Date('2021-06-17T12:55:40.7898738'),
    daysInShowcase: 0,
    daysLate: 0,
    donor: 'VAGNER',
    eBookDownloadLink: null,
    eBookPdfPath: null,
    facilitator: null,
    facilitatorNotes: null,
    freightOption: 'WithoutFreight',
    id: 'e2260775-b46e-4cd4-4651-08d931a7c4de',
    imageSlug: 'o-orfanato-da-srta-peregrine-para-criancas-pe_copy3.jpeg',
    imageUrl: 'https://dev.sharebook.com.br/Images/Books/o-orfanato-da-srta-peregrine-para-criancas-pe_copy3.jpeg',
    phoneDonor: '(22) 22222-2222',
    slug: 'o-orfanato-da-srta-peregrine-para-criancas-pe_copy3',
    state: 'RJ',
    status: 'WaitingApproval',
    synopsis: '',
    title: 'O Orfanato da Srta. Peregrine Para Crianças Peculiares',
    totalInterested: 0,
    trackingNumber: null,
    type: 'Printed',
    userId: '29152b79-effd-4827-8002-0394ffa735e3',
    userIdFacilitator: null,
    winner: '',
  };


  const bookObject = {
    id: '1c31d9c2-54e6-4d69-094d-08d80b184d9b',
    title: 'TESTE AWS DEV',
    author: 'test',
    winner: '',
    donor: 'Vagner',
    userIdFacilitator: '54338afc-7674-46a3-9e35-1f8babd99d6b',
    facilitator: 'Cussa',
    facilitatorNotes: null,
    phoneDonor: '(22) 98831-7391',
    daysInShowcase: 5,
    totalInterested: 0,
    status: 'Available',
    trackingNumber: null,
    creationDate: '2020-06-07T12:23:48.3085349',
    chooseDate: '2020-06-16T00:00:00',
    freightOption: 'World',
    categoryId: '15395d99-6077-4cce-ba00-e99beffc628e',
    category: 'Informática',
    imageSlug: 'teste-aws-dev.jpeg',
    imageUrl: 'https://dev.sharebook.com.br/Images/Books/teste-aws-dev.jpeg',
    city: 'São Paulo',
    state: 'SP',
    synopsis: 'Livro de teste sobre AWS.',
    slug: 'teste-aws-dev',
    userId: '41de867c-b1b6-413d-b8b0-5427d907ef0d',
  };

  const validUpdateForm = {
    bookId: bookObject.id,
    title: bookObject.title,
    author: bookObject.author,
    categoryId: bookObject.categoryId,
    userId: '41de867c-b1b6-413d-b8b0-5427d907ef0d',
    userIdFacilitator: bookObject.userIdFacilitator,
    freightOption: bookObject.freightOption,
    synopsis: bookObject.synopsis,
    agreeToTerms: true,
    approve: true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        AppConfigModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        ImageToDataUrlModule,
        MatDialogModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatAutocompleteModule,
        BrowserTransferStateModule,
        NoopAnimationsModule
      ],
      providers: [
        UserService,
        BookService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'f4816313-523b-4d61-89f1-08d80b14fdaf' }),
          },
        },
        CategoryService,
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    bookService = TestBed.inject(BookService);
    categoryService = TestBed.inject(CategoryService);
    spyOn(userService, 'getProfile').and.returnValue(of({ profile: 'Administrator' }));
    spyOn(userService, 'getLoggedUserFromLocalStorage').and.returnValue({
      authenticated: true,
      created: '2020-06-16T14:36:22.5820099-07:00',
      expiration: '2020-06-17T14:36:22.5820099-07:00',
      accessToken: 'token',
      name: 'Vagner',
      email: 'vagner@sharebook.com',
      userId: '41de867c-b1b6-413d-b8b0-5427d907ef0d',
      profile: 'Administrator',
      message: 'OK',
    });
    spyOn(userService, 'getAllFacilitators').and.returnValue(of(userArray));
    spyOn(bookService, 'getFreightOptions').and.returnValue(of(freightOptionsArray));
    spyOn(categoryService, 'getAll').and.returnValue(of(categoryServiceArray as any));
    spyOn(bookService, 'getById').and.returnValue(of(bookToAdminProfile));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should form has book values', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(component.formGroup.controls['userId'].value).toBe(bookToAdminProfile.userId);
    expect(component.formGroup.controls['title'].value).toBe(bookToAdminProfile.title);
    expect(component.formGroup.controls['author'].value).toBe(bookToAdminProfile.author);
    expect(component.formGroup.controls['categoryId'].value).toBe(bookToAdminProfile.categoryId);
    expect(component.formGroup.controls['userIdFacilitator'].value).toBe(bookToAdminProfile.userIdFacilitator);
    expect(compiled.querySelector('#buttonSave').textContent).toContain('Salvar');
  });

  it('should update book', () => {
    spyOn(bookService, 'update').and.returnValue(
      of({ value: null, messages: [], successMessage: 'Livro alterado com sucesso!', success: true })
    );
    spyOn(bookService, 'approve').and.returnValue(
      of({ value: null, messages: [], successMessage: 'Livro aprovado com sucesso.', success: true })
    );
    fixture.detectChanges();

    setFormValues(validUpdateForm);
    component.isImageLoaded = true;
    const compiled = fixture.debugElement.nativeElement;
    const getForm = fixture.debugElement.query(By.css('#formGroup'));
    expect(getForm.triggerEventHandler('submit', compiled)).toBeUndefined();
    expect(component.pageTitle).toBe('Registro atualizado');
  });
});
