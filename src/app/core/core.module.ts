import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { ChatComponent } from './chat/chat.component';
import { ColorLineComponent } from './color-line/color-line.component';
import { PreloaderComponent } from './preloader/preloader.component';


@NgModule({
  declarations: [ ChatComponent, ColorLineComponent, PreloaderComponent ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  exports: [
    CoreRoutingModule,
    ChatComponent,
    ColorLineComponent
  ]
})
export class CoreModule { }
