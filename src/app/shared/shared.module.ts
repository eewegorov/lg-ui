import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColorLineComponent } from './components/color-line/color-line.component';



@NgModule({
  declarations: [
    ModalComponent,
    DropdownComponent,
    ColorLineComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    DropdownComponent,
    ColorLineComponent
  ]
})
export class SharedModule { }
