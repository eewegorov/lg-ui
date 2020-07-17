import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreRoutingModule } from './core-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { ColorLineComponent } from './components/color-line/color-line.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';



@NgModule({
  declarations: [ ChatComponent, ColorLineComponent, PreloaderComponent, PaymentModalComponent ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    TranslateModule
  ],
  exports: [
    CoreRoutingModule,
    ChatComponent,
    ColorLineComponent
  ]
})
export class CoreModule { }
