import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import { TagService } from 'src/app/features/tag/services/tag.service';
import { TagVM } from 'src/app/features/tag/tag';
import { Book } from 'src/app/features/book/book';
import { SeoService } from 'src/app/core/services/seo/seo.service';

@Component({
    selector: 'app-tag-books',
    templateUrl: './tag-books.component.html',
    styleUrls: ['./tag-books.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TagBooksComponent implements OnInit, OnDestroy {
  public tag: TagVM | null = null;
  public books: Book[] = [];
  public isLoading = true;
  public isMoreLoading = false;
  public notFound = false;
  public totalItems = 0;
  public page = 1;
  public pageSize = 100;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private tagService: TagService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(params => {
        this.isLoading = true;
        this.notFound = false;
        this.books = [];
        this.tag = null;
        this.page = 1;
        this.loadTag(params['slug']);
      });
  }

  private loadTag(slug: string) {
    this.tagService
      .getTag(slug)
      .pipe(
        takeUntil(this._destroySubscribes$),
        catchError(() => of<TagVM | null>(null))
      )
      .subscribe(tag => {
        if (!tag) {
          this.notFound = true;
          this.tag = null;
          this.isLoading = false;
          return;
        }

        this.tag = tag;
        this.updateSeoTags(tag);
        this.loadBooks();
      });
  }

  public loadMore() {
    this.page++;
    this.isMoreLoading = true;
    this.loadBooks();
  }

  private loadBooks() {
    if (!this.tag) {
      return;
    }

    this.tagService
      .getBooksByTag(this.tag.id, this.page, this.pageSize)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        response => {
          const newBooks = response.items || [];
          this.books = [...this.books, ...newBooks];
          this.totalItems = response.totalItems;
          this.isLoading = false;
          this.isMoreLoading = false;
        },
        error => {
          console.error('Erro ao carregar livros da tag:', error);
          this.isLoading = false;
          this.isMoreLoading = false;
        }
      );
  }

  private updateSeoTags(tag: TagVM) {
    const description =
      tag.description
      || `Livros de ${tag.name} disponíveis gratuitamente no ShareBook. Solicite o seu agora.`;
    const path = `/tags/${tag.id}`;

    this.seoService.generateTags({
      title: `${tag.name} - Livros`,
      description,
      path,
      ogType: 'website',
    });
  }

  public getBooksAvailableLabel(): string {
    const total = this.totalItems;
    return total === 1 ? '1 livro disponível' : `${total} livros disponíveis`;
  }

  public hasMoreBooks(): boolean {
    return this.books.length < this.totalItems;
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
