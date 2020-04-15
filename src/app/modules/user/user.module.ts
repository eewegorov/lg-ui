import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsPasswordComponent } from './settings-password/settings-password.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsPasswordComponent,
    SettingsModalComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
