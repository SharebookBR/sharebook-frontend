import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookService } from '../../../core/services/book/book.service';
import { Category } from '../../../core/models/category';
import { FreightOptions } from '../../../core/models/freightOptions';
import { UserService } from '../../../core/services/user/user.service';
import { Book } from '../../../core/models/book';
import { CategoryService } from '../../../core/services/category/category.service';

import { MatDialog } from '@angular/material/dialog';
import { RequestComponent } from '../request/request.component';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { UserInfo } from 'src/app/core/models/userInfo';
import { APP_CONFIG, AppConfig } from 'src/app/app-config.module';
import { SeoService } from '../../../core/services/seo/seo.service';
import { BookDonationStatus } from 'src/app/core/models/BookDonationStatus';
import { ConfirmationDialogComponent } from '../../../core/directives/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  freightOptions: FreightOptions[] = [];
  categories: Category[] = [];

  userProfile: string;
  isAdminLogged = false;
  pageTitle: string;
  state = 'loading';
  authenticated: Boolean = false;
  requested: Boolean = false;
  available: Boolean = false;

  myUser: UserInfo = new UserInfo();
  bookInfo: Book = new Book();
  categoryName: string;
  freightName: string;
  isFreeFreight: Boolean = true;
  daysToChoose: number;
  chooseDateInfo: string;
  isCheckedFreight: boolean;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private _scBook: BookService,
    private _scUser: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _scAuthentication: AuthenticationService,
    private _scCategory: CategoryService,
    private _seo: SeoService,
    private _toastr: ToastrService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this._scAuthentication.checkTokenValidity();
  }

  ngOnInit() {
    this.state = 'loading';
    if (this._scUser.getLoggedUserFromLocalStorage()) {
      this.userProfile = this._scUser.getLoggedUserFromLocalStorage().profile;
      this.isAdminLogged = this.userProfile === 'Administrator';
      this.getMyUser();
    } else {
      this.getBook();
    }
  }

  getMyUser() {
    this._scUser
      .getUserData()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((x) => {
        this.myUser = x;
        this.getBook();
      });
  }

  getBook() {
    let slug = '';
    this._activatedRoute.params
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe((param) => (slug = param.slug));

    if (slug) {
      this._scBook
        .getBySlug(slug)
        .pipe(takeUntil(this._destroySubscribes$))
        .subscribe(
          (book) => {
            this._scBook
              .getFreightOptions()
              .pipe(takeUntil(this._destroySubscribes$))
              .subscribe((data) => {
                this.freightOptions = data;

                this.freightName = book.freightOption;

                this.bookInfo = book;
                this.pageTitle = this.bookInfo.title;
                this.available =
                  this.bookInfo.status === BookDonationStatus.AVAILABLE;

                const chooseDate = Math.floor(
                  new Date(this.bookInfo.chooseDate).getTime() /
                  (3600 * 24 * 1000)
                );
                const todayDate = Math.floor(
                  new Date().getTime() / (3600 * 24 * 1000)
                );

                this.daysToChoose = chooseDate - todayDate;
                const daysLeftMessage = (this.daysToChoose && this.daysToChoose > 1)
                  ? 'Daqui a ' + this.daysToChoose + ' dias'
                  : 'Daqui a 1 dia';
                const isToday = (!this.daysToChoose || this.daysToChoose <= 0);
                this.chooseDateInfo = isToday ? 'Hoje' : daysLeftMessage;


                if (this.myUser.name) {
                  switch (book.freightOption) {
                    case 'City': {
                      if (book.city !== this.myUser.address.city) {
                        this.isFreeFreight = false;
                      }
                      break;
                    }
                    case 'State': {
                      if (book.state !== this.myUser.address.state) {
                        this.isFreeFreight = false;
                      }
                      break;
                    }
                    case 'WithoutFreight': {
                      this.isFreeFreight = false;
                      break;
                    }
                    default: {
                      this.isFreeFreight = true;
                    }
                  }
                }

                if (this.userProfile && book.id) {
                  this._scBook
                    .getRequested(book.id)
                    .pipe(takeUntil(this._destroySubscribes$))
                    .subscribe((requested) => {
                      this.requested = requested.value.bookRequested;
                      this.state = 'ready';
                    });
                } else {
                  this.state = 'ready';
                }

                this._seo.generateTags({
                  title: this.bookInfo.title,
                  description: this.bookInfo.synopsis,
                  image: this.bookInfo.imageUrl,
                  slug: slug,
                });

                this._seo.addStructuredData({
                  '@context': 'https://schema.org',
                  '@type': 'Book',
                  name: this.bookInfo.title,
                  author: this.bookInfo.author,
                  description: this.bookInfo.synopsis,
                  image: this.bookInfo.imageUrl,
                  publisher: {
                    '@type': 'Organization',
                    name: 'ShareBook'
                  }
                });
              });
          },
          (err) => {
            console.error(err);
            this.pageTitle = 'Ops... Não encontramos esse livro :/';
            this.state = 'not-found';
          }
        );
    } else {
      this.pageTitle = 'Ops... Não encontramos esse livro :/';
      this.state = 'not-found';
    }
  }

  onRequestBook() {
    const modalRef = this.dialog.open(RequestComponent, { minWidth: 450 });

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.requested = true;
      }
    });

    modalRef.componentInstance.bookId = this.bookInfo.id;
  }

  onLoginBook() {
    this._router.navigate(['/login'], {
      queryParams: { returnUrl: this._activatedRoute.snapshot.url.join('/') },
    });
  }

  onConvertImageToBase64(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        const img = (<string>event.target['result']).split(',');
        this.bookInfo.imageBytes = img[1];
      };
    }
  }

  onReportCopyright() {
    const confirmRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: 450,
      data: {
        title: 'Reportar direitos autorais',
        message: 'Confirma a denúncia de violação de direitos autorais neste livro digital? Nossa equipe será notificada para revisão.',
        btnOkText: 'Confirmar denúncia',
        btnCancelText: 'Cancelar'
      }
    });

    confirmRef.afterClosed()
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(confirmed => {
        if (!confirmed) return;

        this._scBook.reportCopyright(this.bookInfo.slug)
          .pipe(takeUntil(this._destroySubscribes$))
          .subscribe(
            () => {
              this._toastr.success('Denúncia enviada. Obrigado pela colaboração.');
            },
            (error) => {
              console.error('Erro ao reportar direitos autorais:', error);
              const errorMessage = error?.error?.messages?.join(' ') || error?.message || 'Erro ao enviar denúncia.';
              this._toastr.error(errorMessage);
            }
          );
      });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }

  isEbook(): boolean {
    return this.bookInfo.type === 'Eletronic';
  }

  getBookTypeLabel(): string {
    return this.isEbook() ? 'Livro digital' : 'Livro físico';
  }

  getAuthorSearchLink(author?: string): string[] {
    return ['/buscar', (author || this.bookInfo.author || '').trim()];
  }

  getAuthorList(): string[] {
    const rawAuthor = (this.bookInfo?.author || '').trim();
    if (!rawAuthor) {
      return [];
    }

    return rawAuthor
      .split(/\s*(?:,|;|\s+e\s+|\s+&\s+|\s+and\s+)\s*/i)
      .map(author => author.trim())
      .filter(Boolean);
  }

  getCategoryLink(): string[] | null {
    const categoryInfo = this.bookInfo?.categoryInfo;
    const categoryName = this.getCategoryName();

    if (!categoryName) {
      return null;
    }

    if (categoryInfo?.parentCategoryName) {
      return [
        '/categorias',
        this._scCategory.generateSlug(categoryInfo.parentCategoryName),
        this._scCategory.generateSlug(categoryInfo.name),
      ];
    }
    return ['/categorias', this._scCategory.generateSlug(categoryName)];
  }

  getCategoryName(): string {
    if (this.bookInfo?.categoryInfo?.name) {
      return this.bookInfo.categoryInfo.name;
    }
    if (!this.bookInfo?.category) {
      return '';
    }

    return typeof this.bookInfo.category === 'string'
      ? this.bookInfo.category
      : this.bookInfo.category.name || '';
  }

  getParentCategoryLink(): string[] | null {
    const categoryInfo = this.bookInfo?.categoryInfo;
    if (!categoryInfo?.parentCategoryName) {
      return null;
    }

    return ['/categorias', this._scCategory.generateSlug(categoryInfo.parentCategoryName)];
  }

  getParentCategoryName(): string {
    return this.bookInfo?.categoryInfo?.parentCategoryName || '';
  }
  onDownloadEbook() {
    if (this.bookInfo.slug) {
      const downloadUrl = `${this.config.apiEndpoint}/book/DownloadEBook/${this.bookInfo.slug}`;
      window.open(downloadUrl, '_blank');
    }
  }

  getEbookSocialProofLabel(): string {
    const totalReceived = this.bookInfo?.downloadCount || 0;

    if (totalReceived <= 0) {
      return 'Seja o primeiro a receber este livro';
    }

    if (totalReceived === 1) {
      return '1 pessoa já recebeu este livro';
    }

    return `${totalReceived} pessoas já receberam este livro`;
  }

  showShareModal = false;

  onShareWithFriends(): void {
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  shareTo(channel: 'linkedin' | 'whatsapp' | 'facebook'): void {
    const shareUrl = `https://api.sharebook.com.br/share/livros/${this.bookInfo?.slug || ''}`;
    const title = this.bookInfo?.title || 'Livro no ShareBook';
    const viralText = `Encontrei este livro grátis no ShareBook 📚 ${title}. Bora ler também?`;
    const shareTextWithLink = `${viralText} ${shareUrl}`;

    let targetUrl = '';
    if (channel === 'linkedin') {
      targetUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareTextWithLink)}`;
    }

    if (channel === 'whatsapp') {
      targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextWithLink)}`;
    }

    if (channel === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      this.copyShareText(shareTextWithLink)
        .then(() => this._toastr.success('Texto copiado! Cole no post do Facebook.'))
        .catch(() => this._toastr.info('Copie o texto manualmente após abrir o Facebook.'));
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank');
      this.closeShareModal();
      return;
    }

    this._toastr.info('Não foi possível abrir o compartilhamento.');
  }

  private copyShareText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return Promise.reject();
  }
}
