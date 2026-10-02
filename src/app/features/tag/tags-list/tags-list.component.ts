import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { SeoService } from 'src/app/core/services/seo/seo.service';
import { TagService } from 'src/app/features/tag/services/tag.service';
import { TagVM } from 'src/app/features/tag/tag';

@Component({
    selector: 'app-tags-list',
    templateUrl: './tags-list.component.html',
    styleUrls: ['./tags-list.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TagsListComponent implements OnInit, OnDestroy {
  public tags: TagVM[] = [];
  public isLoading = true;

  private _destroySubscribes$ = new Subject<void>();

  constructor(
    private tagService: TagService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.updateSeoTags();
    this.tagService
      .getTags()
      .pipe(
        takeUntil(this._destroySubscribes$),
        catchError(() => of<TagVM[]>([]))
      )
      .subscribe(tags => {
        this.tags = [...tags].sort((left, right) =>
          left.name.localeCompare(right.name, 'pt-BR', { sensitivity: 'base' })
        );
        this.isLoading = false;
      });
  }

  private updateSeoTags() {
    this.seoService.generateTags({
      title: 'Tags - Livros',
      description: 'Explore livros gratuitos por tags no ShareBook.',
      path: '/tags',
      ogType: 'website',
    });
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
