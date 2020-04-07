import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalComponent } from './modal/modal.component';
import { ChatComponent } from './chat/chat.component';
import { DropdownComponent } from './dropdown/dropdown.component';



@NgModule({
  declarations: [HeaderComponent, SidebarComponent, ModalComponent, ChatComponent, DropdownComponent],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
