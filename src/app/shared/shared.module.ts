import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDatepickerI18n } from './components/datepicker/datepicker.component';
import { SelectOnClickDirective } from './directives/select-on-click.directive';
import { DropContainerDirective } from './directives/drop-container.directive';
import { OrderByPipe } from './pipes/order-by.pipe';
import { ThousandSuffixPipe } from './pipes/thousand-suffix.pipe';
import { ModalComponent } from './components/modal/modal.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { CardComponent } from './components/card/card.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    SelectOnClickDirective,
    DropContainerDirective,
    OrderByPipe,
    ThousandSuffixPipe,
    NgbdDatepickerI18n,
    ModalComponent,
    DropdownComponent,
    PaymentModalComponent,
    CardComponent
  ],
  imports: [CommonModule, FormsModule, TranslateModule, NgbDatepickerModule, InlineSVGModule],
  exports: [
    SelectOnClickDirective,
    DropContainerDirective,
    OrderByPipe,
    ThousandSuffixPipe,
    NgbdDatepickerI18n,
    ModalComponent,
    DropdownComponent,
    PaymentModalComponent,
    CardComponent
  ],
  providers: [OrderByPipe]
})
export class SharedModule {}
