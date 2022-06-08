import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';
import { ChartsModule } from 'ng2-charts';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SharedModule } from '@shared/shared.module';
import { SitesRoutingModule } from './sites-routing.module';
import { SiteAddComponent } from './components/site-add/site-add.component';
import { SiteSettingsComponent } from './pages/site-settings/site-settings.component';
import { SiteItemComponent } from './components/site-item/site-item.component';
import { SitesComponent } from './pages/sites/sites.component';
import { IntegrationAddComponent } from './components/integration-add/integration-add.component';
import { IntegrationItemComponent } from './components/integration-item/integration-item.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    SiteAddComponent,
    SiteSettingsComponent,
    SiteItemComponent,
    SitesComponent,
    IntegrationAddComponent,
    IntegrationItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CoolInlineEditFieldModule,
    ChartsModule,
    UiSwitchModule,
    FilterPipeModule,
    SharedModule,
    SitesRoutingModule,
    WidgetsModule,
    InlineSVGModule
  ]
})
export class SitesModule {}
