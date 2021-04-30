import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreRoutingModule } from './core-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { SharedModule } from '../shared/shared.module';
import { LogoutComponent } from './components/logout/logout.component';


@NgModule({
  declarations: [ ChatComponent, PreloaderComponent, LogoutComponent ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    CoreRoutingModule,
    ChatComponent
  ]
})
export class CoreModule { }
