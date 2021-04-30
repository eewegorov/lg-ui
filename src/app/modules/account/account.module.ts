import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { AccountComponent } from './account/account.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AccountRoutingModule
  ]
})
export class AccountModule {
}
