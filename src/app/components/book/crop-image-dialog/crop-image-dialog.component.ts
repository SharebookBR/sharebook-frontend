import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

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
  rotation = 0;
  transform: ImageTransform = {};

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

  rotateLeft() {
    this.rotation = (this.rotation - 90 + 360) % 360;
    this.transform = { ...this.transform, rotate: this.rotation };
  }

  rotateRight() {
    this.rotation = (this.rotation + 90) % 360;
    this.transform = { ...this.transform, rotate: this.rotation };
  }

  confirm() {
    this.dialogRef.close(this.croppedBase64);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
