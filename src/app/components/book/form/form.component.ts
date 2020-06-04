import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ImageResult } from 'ng2-imageupload';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../core/services/seo/seo.service';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];
  facilitators: User[] = [];
  isSaved: Boolean;

  userProfile: string;
  buttonSaveLabel: string;
  pageTitle: string;
  isLoading: Boolean = false;
  isLoadingMessage: string;
  itsEditMode: Boolean = false;
  isImageLoaded: Boolean = false;
  canApprove: Boolean = false;
  status = '';

  src: string;

  shareBookUser = new User();

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private _scUser: UserService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    private _ng2ImgMaxService: Ng2ImgMaxService,
    private _seo: SeoService
  ) {
    /*  Inicializa o formGroup defatult por que é obrigatório  */
    this.createFormGroup();
  }

  ngOnInit() {
    this._seo.generateTags({
      title: 'Doe um livro.',
      description:
        'Doe um livro e você vai ficar emocionado com a experiência. Nossos usuários tem relatado que eh emocionante. ' +
        'Apesar de ser no anonimato vc se envolve com muitas histórias incríveis. ' +
        'Vc não faz ideia de como tem pessoas que realmente precisam. ' +
        'E da força transformadora que um simples livro causa na vida de uma pessoa. ' +
        'E que você ao escolher um ganhador, passa a fazer parte dessa história.',
      slug: 'doar-livro',
    });

    this.findProfile();

    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.shareBookUser = this._scUser.getLoggedUserFromLocalStorage();
    }

    this._scBook
      .getFreightOptions()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((data) => (this.freightOptions = data));

    this._scCategory
      .getAll()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((data) => (this.categories = data));
  }

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      id: '',
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      categoryId: ['', [Validators.required]],
      userIdFacilitator: [''],
      userId: ['', [Validators.required]],
      freightOption: ['', [Validators.required]],
      imageBytes: [''],
      imageName: [''], // , this.userProfile === 'User' && [Validators.required]],
      approve: [''],
      imageUrl: '',
      imageSlug: '',
      synopsis: ['', [Validators.maxLength(2000)]],
      agreeToTerms: ['', Validators.requiredTrue],
    });
  }

  findProfile() {
    this._scUser
      .getProfile()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(({ profile }) => {
        this.userProfile = profile;
        this.createFormGroup();
        this.getBookSaved();
        this.buildFormsLabels();
      });
  }

  buildFormsLabels() {
    if (this.userProfile === 'User' || !this.itsEditMode) {
      this.buttonSaveLabel = 'Doar este livro';
      this.pageTitle = 'Quero doar um livro';
    } else {
      this.buttonSaveLabel = 'Salvar';
      this.pageTitle = 'Editar livro';
    }
  }

  getBookSaved() {
    let id = '';
    this._activatedRoute.params
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((param) => (id = param.id));
    this.itsEditMode = !!id;

    if (this.userProfile === 'Administrator' && id) {
      this._scBook
        .getById(id)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe((book) => {
          this.status = book.status;
          this.canApprove = book.status === BookDonationStatus.WAITING_APPROVAL;
          const bookForUpdate = {
            id: book.id,
            title: book.title,
            author: book.author,
            categoryId: book.categoryId,
            userIdFacilitator: !!book.userIdFacilitator
              ? book.userIdFacilitator
              : null,
            userId: book.userId,
            freightOption: this.freightOptions.find(
              (e) => e.text === book.freightOption
            ).value,
            imageBytes: '',
            imageName: null,
            imageUrl: book.imageUrl,
            imageSlug: book.imageSlug,
            synopsis: !!book.synopsis ? book.synopsis : '',
            agreeToTerms: true,
            approve: false,
          };
          this.formGroup
            .get('userIdFacilitator')
            .setValidators([Validators.required]); // Facilitador obrigatório para edição do admin
          this.formGroup.setValue(bookForUpdate);
          this.getAllFacilitators();
        });
    }

    // ao doar um livro, o userId é do usuário logado.
    if (!this.itsEditMode) {
      this.formGroup.get('userId').setValue(this.shareBookUser['userId']);
      this.getAllFacilitators();
    }
  }

  onAddBook() {
    if (!this.formGroup.valid) {
      return false;
    }

    if (this.userProfile === 'User' && !this.isImageLoaded) {
      this._toastr.error('Selecionar imagem da capa do livro.');
      return false;
    }

    this.isLoading = true;
    this.isLoadingMessage = 'Aguarde...';
    if (!this.formGroup.value.id) {
      if (!this.formGroup.value.imageName) {
        this.formGroup.value.imageName = 'iPhone-image.jpg'; // Para iphone o mesmo não envia o nome da imagem
      }

      this._scBook
        .create(this.formGroup.value)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe((resp) => {
          if (resp.success) {
            this.isSaved = true;
            this._toastr.success('Livro cadastrado com sucesso!');
            this.pageTitle = 'Obrigado por ajudar.';
          } else {
            this._toastr.error(resp.messages[0]);
          }
          this.isLoading = false;
        });
    } else {
      this._scBook
        .update(this.formGroup.value)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe((resp) => {
          if (!this.formGroup.value.approve) {
            this.happyEnd();
          } else {
            this.approve();
          }
        });
    }
  }

  onChangeFieldFreightOption(freightOption: string, p) {
    this.formGroup.controls['freightOption'].setValue(freightOption);

    if (freightOption === 'WithoutFreight') {
      p.open();
    } else {
      p.close();
    }
  }

  onConvertImageToBase64(imageResult: ImageResult) {
    if (!imageResult.error) {
      this.isLoading = true;
      this.isLoadingMessage = 'Processando imagem...';
      this.isImageLoaded = true;

      this._ng2ImgMaxService
        .resize([imageResult.file], 600, 10000)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe((result) => {
          const reader = new FileReader();
          reader.readAsDataURL(result);

          reader.onload = (event) => {
            this.src = <string>reader.result;
            const img = this.src.split(',');
            this.formGroup.controls['imageBytes'].setValue(img[1]);
            this.isLoading = false;
          };
        });
    } else {
      this.formGroup.controls['imageName'].setErrors({
        InvalidExtension: true,
      });
      this.formGroup.controls['imageBytes'].setValue('');
      this.isImageLoaded = false;
    }
  }

  getAllFacilitators() {
    this._scUser
      .getAllFacilitators(this.formGroup.get('userId').value)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((data) => (this.facilitators = data));
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  approve() {
    this._scBook
      .approve(this.formGroup.value.id)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((resp) => {
        this.happyEnd();
      });
  }

  happyEnd() {
    this.isSaved = true;
    this.pageTitle = 'Registro atualizado';
    this.isLoading = false;
  }
}
