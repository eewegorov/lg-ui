import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColorLineComponent } from './components/color-line/color-line.component';
import { SelectOnClickDirective } from './directives/select-on-click.directive';



@NgModule({
  declarations: [
    ModalComponent,
    DropdownComponent,
    ColorLineComponent,
    SelectOnClickDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    DropdownComponent,
    ColorLineComponent,
    SelectOnClickDirective
  ]
})
export class SharedModule { }
