import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbtestsActiveComponent } from './abtests-active/abtests-active.component';
import { AbtestsArchiveComponent } from './abtests-archive/abtests-archive.component';



@NgModule({
  declarations: [AbtestsActiveComponent, AbtestsArchiveComponent],
  imports: [
    CommonModule
  ]
})
export class AbtestsModule { }
