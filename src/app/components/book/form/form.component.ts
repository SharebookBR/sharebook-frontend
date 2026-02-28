import { BookToAdminProfile } from './../../../core/models/BookToAdminProfile';
import { Profile } from './../../../core/models/profile';
import { FreightIncentiveDialogComponent } from './../freight-incentive-dialog/freight-incentive-dialog.component';
import { CropImageDialogComponent } from '../crop-image-dialog/crop-image-dialog.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { Options, ImageResult } from 'ngx-image2dataurl';

import { BookService } from '../../../core/services/book/book.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../core/services/seo/seo.service';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';
import { BookType } from 'src/app/core/models/book';

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

  userProfile: Profile;
  buttonSaveLabel: string;
  pageTitle: string;
  isLoading: Boolean = false;
  isLoadingMessage: string;
  itsEditMode: Boolean = false;
  isImageLoaded: Boolean = false;
  isPdfLoaded: Boolean = false;
  canApprove: Boolean = false;
  status = '';

  src: string;
  pdfFileName: string = '';
  uploadProgress: number = 0;

  bookTypeOptions = [
    { value: 'Printed', text: 'Livro Físico' },
    { value: 'Eletronic', text: 'Livro digital (PDF)' }
  ];
  selectedBookType: BookType = 'Printed';

  shareBookUser = new User();

  private _destroySubscribes$ = new Subject<void>();

  options: Options = {
    resize: {
      maxHeight: 10000,
      maxWidth: 600
    },
    allowedExtensions: ['jpg', 'jpeg', 'png']
  };

  public freightStartSubject = new BehaviorSubject<string>('');
  public freightStart$ = this.freightStartSubject.asObservable();

  constructor(
    private _scBook: BookService,
    private _scCategory: CategoryService,
    private _scUser: UserService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    private _seo: SeoService,
    public dialog: MatDialog
  ) {
    /*  Inicializa o formGroup defatult por que é obrigatório  */
    this.createFormGroup();
    this.userProfile = new Profile('');
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
      .pipe(
        takeUntil(this._destroySubscribes$)
      )
      .subscribe((data) => (this.freightOptions = data));

    this._scCategory
      .getAll()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((data) => (this.categories = data));
  }

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      bookId: '',
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
      freightOption: [null],
      imageBytes: [''],
      imageName: [''],
      approve: [''],
      imageUrl: '',
      imageSlug: '',
      synopsis: ['', [Validators.maxLength(2000)]],
      agreeToTerms: [false],
      type: ['Printed'],
      pdfBytes: [null],
      agreeToAntiPiracy: [false],
    });

    this.updateValidators();
  }

  updateValidators() {
    const freightControl = this.formGroup.get('freightOption');
    const pdfControl = this.formGroup.get('pdfBytes');
    const antiPiracyControl = this.formGroup.get('agreeToAntiPiracy');
    const agreeToTermsControl = this.formGroup.get('agreeToTerms');

    if (this.selectedBookType === 'Printed') {
      freightControl.setValidators([Validators.required]);
      agreeToTermsControl.setValidators([Validators.requiredTrue]);
      pdfControl.clearValidators();
      antiPiracyControl.clearValidators();
    } else {
      freightControl.clearValidators();
      agreeToTermsControl.clearValidators();
      if (!this.isPdfLoaded) {
        pdfControl.setValidators([Validators.required]);
      } else {
        pdfControl.clearValidators();
      }
      antiPiracyControl.setValidators([Validators.requiredTrue]);
    }

    freightControl.updateValueAndValidity();
    pdfControl.updateValueAndValidity();
    antiPiracyControl.updateValueAndValidity();
    agreeToTermsControl.updateValueAndValidity();
  }

  findProfile() {
    this._scUser
      .getProfile()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(profile => {
        this.userProfile = profile;
        this.createFormGroup();
        this.getBookSaved();
        this.buildFormsLabels();
      });
  }

  buildFormsLabels() {
    if (this.userProfile.profile === 'User' || !this.itsEditMode) {
      this.buttonSaveLabel = 'Doar este livro';
      this.pageTitle = 'Quero doar um livro';
    } else {
      this.buttonSaveLabel = 'Salvar';
      this.pageTitle = 'Editar livro';
    }
  }

  getBookSaved() {
    let bookId = '';
    this._activatedRoute.params
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((param) => (bookId = param.id));
    this.itsEditMode = !!bookId;
    if (this.userProfile.profile === 'Administrator' && bookId) {
      this._scBook
        .getById(bookId)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe((book: BookToAdminProfile) => {
          this.status = book.status;
          this.canApprove = book.status === BookDonationStatus.WAITING_APPROVAL;
          const bookForUpdate = {
            bookId: book.id,
            title: book.title,
            author: book.author,
            categoryId: book.categoryId,
            userIdFacilitator: !!book.userIdFacilitator
              ? book.userIdFacilitator
              : null,
            userId: book.userId,
            freightOption: book.freightOption,
            imageBytes: '',
            imageName: null,
            imageUrl: book.imageUrl,
            imageSlug: book.imageSlug,
            synopsis: !!book.synopsis ? book.synopsis : '',
            agreeToTerms: true,
            approve: false,
            type: book.type || 'Printed',
            pdfBytes: null,
            agreeToAntiPiracy: true,
          };

          const isEbook = book.type === 'Eletronic' || !!book.eBookPdfPath;
          this.selectedBookType = isEbook ? 'Eletronic' : 'Printed';

          if (book.eBookPdfPath) {
            this.isPdfLoaded = true;
            this.pdfFileName = book.eBookPdfPath;
          }

          this.updateValidators();

          this.formGroup.controls['freightOption'].setValue(book.freightOption);
          const freightOption = this.freightOptions.find(frete => frete.value === book.freightOption);
          if (freightOption) {
            this.freightStartSubject.next(freightOption.text);
          }
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

    if (this.userProfile.profile === 'User' && !this.isImageLoaded) {
      this._toastr.error('Selecionar imagem da capa do livro.');
      return false;
    }

    if (this.selectedBookType === 'Eletronic' && !this.isPdfLoaded) {
      this._toastr.error('Selecione o arquivo PDF do livro digital.');
      return false;
    }

    this.isLoading = true;
    this.uploadProgress = 0;
    this.isLoadingMessage = 'Aguarde...';

    if (!this.formGroup.value.bookId) {
      if (!this.formGroup.value.imageName) {
        this.formGroup.value.imageName = 'iPhone-image.jpg'; // Para iphone o mesmo não envia o nome da imagem
      }

      const bookData = this.prepareBookPayload();

      if (this.selectedBookType === 'Eletronic') {
        this._scBook
          .createWithProgress(bookData, (progress) => {
            this.uploadProgress = progress;
            this.isLoadingMessage = progress < 100 ? `Enviando PDF... ${progress}%` : 'Processando...';
          })
          .pipe(takeUntil(this._destroySubscribes$))
          .subscribe({
            next: (resp) => {
              if (resp.success) {
                this.isSaved = true;
                this._toastr.success('Livro digital cadastrado com sucesso!');
                this.pageTitle = 'Obrigado por ajudar.';
              } else {
                this._toastr.error(resp.messages[0]);
              }
              this.isLoading = false;
              this.uploadProgress = 0;
            },
            error: (err) => {
              this._toastr.error('Erro ao enviar o livro digital. Tente novamente.');
              this.isLoading = false;
              this.uploadProgress = 0;
            }
          });
      } else {
        this._scBook
          .create(bookData)
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
      }
    } else {
      const book = this.formGroup.value;
      book.id = this.formGroup.value.bookId;
      if (book.imageBytes && !book.imageName) {
        book.imageName = 'capa-atualizada.jpg';
      }
      this._scBook
        .update(book)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          (resp) => {
            if (resp['success']) {
              if (!this.formGroup.value.approve) {
                this.happyEnd();
              } else {
                this.approve();
              }
            } else {
              const errorMessages = resp['messages']?.join(' ') || 'Erro inesperado.';
              this._toastr.error(errorMessages);
              this.isLoading = false;
            }
          },
          (error) => {
            console.error('Erro detalhado:', error);
            const errorMessage = error?.error?.messages?.join(' ') || error?.message || 'Erro inesperado.';
            this._toastr.error(errorMessage);
            this.isLoading = false;
          }
        );
    }
  }

  openCropDialog() {
    const hasBytes = !!this.formGroup.value.imageBytes;
    const dialogRef = this.dialog.open(CropImageDialogComponent, {
      data: {
        imageUrl: !hasBytes ? this.formGroup.value.imageUrl : undefined,
        imageBase64: hasBytes ? 'data:image/jpeg;base64,' + this.formGroup.value.imageBytes : undefined,
      },
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((croppedBase64: string) => {
      if (croppedBase64) {
        const base64Data = croppedBase64.split(',')[1];
        this.formGroup.controls['imageBytes'].setValue(base64Data);
        this.formGroup.controls['imageName'].setValue('capa-crop.jpg');
        this.isImageLoaded = true;
      }
    });
  }

  onChangeFieldFreightOption(freightOption: string) {
    this.formGroup.controls['freightOption'].setValue(freightOption);

    if (freightOption === 'WithoutFreight') {
      this.dialog.open(FreightIncentiveDialogComponent, { maxWidth: 350 });
    }
  }

  prepareBookPayload(): any {
    const formValue = { ...this.formGroup.value };

    delete formValue.bookId;
    delete formValue.approve;
    delete formValue.imageUrl;
    delete formValue.imageSlug;
    delete formValue.agreeToTerms;
    delete formValue.agreeToAntiPiracy;

    if (!formValue.userIdFacilitator) {
      delete formValue.userIdFacilitator;
    }

    if (this.selectedBookType === 'Printed') {
      delete formValue.pdfBytes;
    } else {
      delete formValue.freightOption;
    }

    return formValue;
  }

  onChangeBookType(bookType: BookType) {
    this.selectedBookType = bookType;
    this.formGroup.controls['type'].setValue(bookType);
    this.updateValidators();

    if (bookType === 'Printed') {
      this.formGroup.controls['pdfBytes'].setValue(null);
      this.isPdfLoaded = false;
      this.pdfFileName = '';
    } else {
      this.formGroup.controls['freightOption'].setValue(null);
    }
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        this._toastr.error('Apenas arquivos PDF são permitidos.');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        this._toastr.error('O arquivo PDF deve ter no máximo 50MB.');
        return;
      }

      this.isLoading = true;
      this.isLoadingMessage = 'Processando PDF...';

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.formGroup.controls['pdfBytes'].setValue(base64);
        this.isPdfLoaded = true;
        this.pdfFileName = file.name;
        this.isLoading = false;
      };
      reader.onerror = () => {
        this._toastr.error('Erro ao processar o arquivo PDF.');
        this.isLoading = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onConvertImageToBase64(imageResult: ImageResult) {
    if (!imageResult.error) {
      this.isLoading = true;
      this.isLoadingMessage = 'Processando imagem...';
      this.isImageLoaded = true;
      this.src = <string>imageResult.resized.dataURL;
      const img = this.src.split(',');
      this.formGroup.controls['imageBytes'].setValue(img[1]);
      this.isLoading = false;
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
      .subscribe(data => this.facilitators = data);
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  approve() {
    this._scBook
      .approve(this.formGroup.value.bookId)
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
