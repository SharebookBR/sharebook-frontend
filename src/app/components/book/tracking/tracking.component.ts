import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/core/services/book/book.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  @Input() bookId;
  @Input() bookTitle;
  @Input() trackingNumber;

  formGroup: FormGroup;
  isLoading: Boolean;

  state = 'loading'; // loading, form, error
  lastError: string;


  constructor(
    public activeModal: NgbActiveModal,
    private _scBook: BookService,
    private _formBuilder: FormBuilder) {
      this.formGroup = _formBuilder.group({
        trackingNumber: ['', [Validators.required]]
      });
    }

  ngOnInit() {

    if (!!this.trackingNumber) {
      const trackingNumberForUpdate = {
        trackingNumber: this.trackingNumber
      };
      this.formGroup.setValue(trackingNumberForUpdate);
    }

  }

  onTracking() {

    this.isLoading = true;
    this._scBook.setTrackingNumber(this.bookId, this.formGroup.value).subscribe(resp => {
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

}
