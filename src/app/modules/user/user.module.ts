import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { UserRoutingModule } from './user-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsPasswordComponent } from './settings-password/settings-password.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsPasswordComponent,
    SettingsModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    UiSwitchModule,
    UserRoutingModule
  ]
})
export class UserModule {
}
