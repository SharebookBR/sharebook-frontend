import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from 'src/app/core/services/book/book.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-facilitator-notes',
  templateUrl: './facilitator-notes.component.html',
  styleUrls: ['./facilitator-notes.component.css']
})
export class FacilitatorNotesComponent implements OnInit, OnDestroy {
  @Input() bookId;
  @Input() bookTitle;
  @Input() facilitatorNotes;

  formGroup: FormGroup;
  isLoading: Boolean;

  state = 'loading'; // loading, form, error
  lastError: string;

  private _destroySubscribes$ = new Subject<void>();

  constructor(public activeModal: NgbActiveModal, private _scBook: BookService, private _formBuilder: FormBuilder) {
    this.formGroup = _formBuilder.group({
      bookId: '',
      facilitatorNotes: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    const facilitatorNotesForUpdate = {
      bookId: this.bookId,
      facilitatorNotes: ''
    };
    this.formGroup.setValue(facilitatorNotesForUpdate);
  }

  onTracking() {
    this.isLoading = true;
    this._scBook.setFacilitatorNotes(this.formGroup.value)
    .pipe(
      takeUntil(this._destroySubscribes$)
    )
    .subscribe(
      resp => {
        this.isLoading = false;
        this.activeModal.close('Success');
      },
      error => {
        this.lastError = error;
        this.state = 'request-error';
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this._destroySubscribes$.next();
    this._destroySubscribes$.complete();
  }
}
