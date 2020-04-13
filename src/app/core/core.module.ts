import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { ChatComponent } from './chat/chat.component';
import { HeaderLineComponent } from './header-line/header-line.component';


@NgModule({
  declarations: [ ChatComponent, HeaderLineComponent ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  exports: [
    CoreRoutingModule,
    ChatComponent,
    HeaderLineComponent
  ]
})
export class CoreModule { }
