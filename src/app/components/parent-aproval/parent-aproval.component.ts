import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../core/services/user/user.service';

@Component({
  selector: 'app-parent-aproval',
  templateUrl: './parent-aproval.component.html',
  styleUrls: ['./parent-aproval.component.css'],
})
export class ParentAprovalComponent implements OnInit, OnDestroy {
  private _destroySubscribes$ = new Subject<void>();
  public hashCode = '';
  public aproved: Boolean = false;
  public testeTeste: Boolean = true;

  constructor(private _activatedRoute: ActivatedRoute, private _scUser: UserService, private _toastr: ToastrService) {}

  ngOnInit() {
    this._activatedRoute.params.pipe(takeUntil(this._destroySubscribes$)).subscribe((param) => {
      this.hashCode = param.hashCode;
    });
  }

  parentAproval() {
    this._scUser
      .parentAproval(this.hashCode)
      .pipe(takeUntil(this._destroySubscribes$))
      .subscribe(
        (data) => {
          this._toastr.success('Acesso liberado com sucesso. Obrigado.');
          this.aproved = true;
        },
        (error) => {
          this._toastr.error(error);
        }
      );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
