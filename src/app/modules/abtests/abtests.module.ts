import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';
import { UiSwitchModule } from 'ngx-ui-switch';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { AbtestsRoutingModule } from './abtests-routing.module';
import { AbtestsActiveComponent } from './pages/abtests-active/abtests-active.component';
import { AbtestsArchiveComponent } from './pages/abtests-archive/abtests-archive.component';
import { VariantAddComponent } from './components/variant-add/variant-add.component';
import { AbtestAddComponent } from './components/abtest-add/abtest-add.component';
import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  declarations: [AbtestsActiveComponent, AbtestsArchiveComponent, VariantAddComponent, AbtestAddComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CoolInlineEditFieldModule,
    UiSwitchModule,
    InfiniteScrollModule,
    ChartsModule,
    SharedModule,
    AbtestsRoutingModule,
    WidgetsModule
  ]
})
export class AbtestsModule {}
