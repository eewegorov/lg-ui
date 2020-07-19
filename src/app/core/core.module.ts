import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreRoutingModule } from './core-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';



@NgModule({
  declarations: [ ChatComponent, PreloaderComponent, PaymentModalComponent ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    TranslateModule
  ],
  exports: [
    CoreRoutingModule,
    ChatComponent
  ]
})
export class CoreModule { }
