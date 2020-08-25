import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDatepickerI18n } from './components/datepicker/datepicker.component';
import { SelectOnClickDirective } from './directives/select-on-click.directive';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColorLineComponent } from './components/color-line/color-line.component';


@NgModule({
  declarations: [
    SelectOnClickDirective,
    OrderByPipe,
    NgbdDatepickerI18n,
    ModalComponent,
    DropdownComponent,
    ColorLineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule
  ],
  exports: [
    SelectOnClickDirective,
    OrderByPipe,
    NgbdDatepickerI18n,
    ModalComponent,
    DropdownComponent,
    ColorLineComponent
  ]
})
export class SharedModule { }
