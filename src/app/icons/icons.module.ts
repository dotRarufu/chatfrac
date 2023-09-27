import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { RotateCcw, Cloud, CloudOff, UploadCloud } from 'angular-feather/icons';

const icons = {
  RotateCcw,
  Cloud,
  CloudOff,
  UploadCloud,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class IconsModule {}
