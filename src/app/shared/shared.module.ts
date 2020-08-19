import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOnClickDirective } from './directives/select-on-click.directive';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColorLineComponent } from './components/color-line/color-line.component';
import { NgbdDatepickerI18n } from './components/datepicker/datepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SelectOnClickDirective,
    ModalComponent,
    DropdownComponent,
    ColorLineComponent,
    NgbdDatepickerI18n
  ],
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule
  ],
  exports: [
    SelectOnClickDirective,
    ModalComponent,
    DropdownComponent,
    ColorLineComponent,
    NgbdDatepickerI18n
  ]
})
export class SharedModule { }
