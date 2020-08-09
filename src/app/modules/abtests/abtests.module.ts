import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AbtestsRoutingModule } from './abtests-routing.module';
import { AbtestsActiveComponent } from './abtests-active/abtests-active.component';
import { AbtestsArchiveComponent } from './abtests-archive/abtests-archive.component';


@NgModule({
  declarations: [
    AbtestsActiveComponent,
    AbtestsArchiveComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    UiSwitchModule,
    AbtestsRoutingModule
  ]
})
export class AbtestsModule { }
