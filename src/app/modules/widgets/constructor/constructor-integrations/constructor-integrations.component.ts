import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Integration } from '../../../../core/models/sites';
import { FullWidget } from '../../../../core/models/widgets';
import { SitesService } from '../../../sites/services/sites.service';
import { IntegrationAddComponent } from '../../../sites/integration-add/integration-add.component';

@Component({
  selector: 'app-constructor-integrations',
  templateUrl: './constructor-integrations.component.html',
  styleUrls: ['../../shared/shared.scss', './constructor-integrations.component.scss']
})
export class ConstructorIntegrationsComponent implements OnInit, OnDestroy {
  @Input() public sid: string;
  @Input() public widget: FullWidget;

  public wIntegrations: Integration[] = [];
  public integrationsAvailableCRM: Integration[] = [];
  public integrationsAvailableMailing: Integration[] = [];
  public integrationsAvailableNotifications: Integration[] = [];
  public integrationsAvailableOthers: Integration[] = [];
  public currentIntegrationToAdd: Integration = {} as Integration;
  public defIntegrationToAddTitle: string;

  private getIntegrationSub: SubscriptionLike;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private sitesService: SitesService
  ) {
  }

  ngOnInit(): void {
    this.getIntegrations();

    this.translate.get('widgetsList.editor.integrations.defSelectTitle').subscribe((translatedValue: string) => {
      this.defIntegrationToAddTitle = translatedValue;
    });
  }

  public changeIntegrationToAdd(item) {
    this.currentIntegrationToAdd = item;

    this.widget.integrations.push(this.currentIntegrationToAdd.id);
    this.currentIntegrationToAdd = null;
    this.getIntegrations();
  }

  public removeIntegrationItem(index) {
    this.widget.integrations.splice(index, 1);
    this.currentIntegrationToAdd = null;
    this.getIntegrations();
  }

  public openModalForCreatingNewIntegration() {
    const modalRef = this.modalService.open(IntegrationAddComponent, {
      windowClass: 'animate__animated animate__slideInDown animate__faster',
      size: 'lg'
    });
    modalRef.componentInstance.siteId = this.sid;
    modalRef.componentInstance.integrationId = null;

    modalRef.result.then((result) => {
      if (result && result.id) {
        this.getIntegrationSub.unsubscribe();
        this.getIntegrations(result);
      }
    })
      .catch(() => {
      });
  }

  ngOnDestroy(): void {
    if (this.getIntegrationSub) {
      this.getIntegrationSub.unsubscribe();
    }
  }

  private getIntegrations(responseIntegration?) {
    this.getIntegrationSub = this.sitesService.getSiteIntegrations(this.sid).subscribe((response: Integration[]) => {
      this.wIntegrations = response.filter((item: Integration) => {
        return this.widget.integrations.some((wItemId: string) => item.id === wItemId);
      });

      const integrationsAvailable = response.filter((item: Integration) => {
        return !this.wIntegrations.some((wItem: Integration) => item.id === wItem.id);
      });

      this.integrationsAvailableCRM = integrationsAvailable.filter((item: Integration) => {
        return this.sitesService.isIntegrationCRM(item.type);
      });
      this.integrationsAvailableMailing = integrationsAvailable.filter((item: Integration) => {
        return this.sitesService.isIntegrationMailing(item.type);
      });
      this.integrationsAvailableNotifications = integrationsAvailable.filter((item: Integration) => {
        return this.sitesService.isIntegrationNotification(item.type);
      });
      this.integrationsAvailableOthers = integrationsAvailable.filter((item: Integration) => {
        return this.sitesService.isIntegrationOthers(item.type);
      });

      if (responseIntegration) {
        this.changeIntegrationToAdd(responseIntegration);
      }
    });
  }

}
