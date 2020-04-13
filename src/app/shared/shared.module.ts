import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';



@NgModule({
  declarations: [
    ModalComponent,
    DropdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    DropdownComponent
  ]
})
export class SharedModule { }
