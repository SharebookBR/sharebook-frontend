import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface CropImageDialogData {
  imageUrl?: string;
  imageBase64?: string;
}

@Component({
  selector: 'app-crop-image-dialog',
  templateUrl: './crop-image-dialog.component.html',
  styleUrls: ['./crop-image-dialog.component.css'],
})
export class CropImageDialogComponent {
  croppedBase64 = '';
  loadFailed = false;

  constructor(
    public dialogRef: MatDialogRef<CropImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CropImageDialogData
  ) {}

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedBase64 = event.base64;
  }

  onLoadImageFailed() {
    this.loadFailed = true;
  }

  confirm() {
    this.dialogRef.close(this.croppedBase64);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
