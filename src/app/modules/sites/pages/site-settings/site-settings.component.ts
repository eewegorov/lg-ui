import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegrationAddComponent } from '../../components/integration-add/integration-add.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Integration, SiteSettings, SiteShort } from '@core/models/sites';
import { TariffsService } from '@core/services/tariffs.service';
import { SitesService } from '../../services/sites.service';
import { CoreSitesService } from '@core/services/core-sites.service';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent implements OnInit, AfterViewChecked {
  public siteId: string;
  public site: SiteSettings;
  public tab = 0;
  public siteInfo;
  public integrations;
  public integrationsCRM;
  public integrationsMailing;
  public integrationsNotifications;
  public integrationsOthers;
  public codeSiteScript;
  public googleAnalyticsServices = [
    {
      name: 'GTAG',
      value: 'GTAG'
    },
    {
      name: 'UNIVERSAL',
      value: 'UNIVERSAL'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService
  ) {
    this.siteId = this.route.snapshot.params.id;
    this.codeSiteScript = this.sitesService.generatePath(this.siteId, true);
  }

  ngOnInit(): void {
    this.getSiteSettings();
    this.getSiteIntegrations();
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
  }

  public setTab(newTab) {
    this.tab = newTab;
  }

  public deleteSite() {
    Swal.fire({
      title: this.translate.instant('sitelist.delete.title'),
      text: this.translate.instant('sitelist.delete.text'),
      heightAuto: false,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('sitelist.delete.confirm'),
      cancelButtonText: this.translate.instant('global.cancel')
    }).then(isConfirm => {
      if (isConfirm) {
        this.sitesService.deleteSite(this.siteId).subscribe(() => {
          Swal.fire({
            title: this.translate.instant('global.done'),
            text: this.translate.instant('sitelist.delete.deleted'),
            heightAuto: false,
            icon: 'success'
          }).then();

          setTimeout(() => {
            this.goBack();
          }, 1000);
        });
      }
    });
  }

  public onChangePaymentLogo() {
    if (this.siteInfo.isFree) {
      setTimeout(() => {
        this.site.needHideLogo = false;
        this.site.logoRefLink = false;
        this.tariffsService.checkTariffPlans(
          this.siteId,
          this.translate.instant('sitelist.tariff.improve'),
          this.translate.instant('settings.site.integration.paymentLabel', { siteName: this.site.name })
        );
      }, 500);
    }
  }

  public openModalForCreatingNewIntegration() {
    const modalRef = this.modalService.open(IntegrationAddComponent, {
      windowClass: 'animate__animated animate__slideInDown animate__faster',
      size: 'lg'
    });
    modalRef.componentInstance.siteId = this.siteId;
    modalRef.componentInstance.integrationId = null;

    modalRef.result
      .then(result => {
        if (result) {
          this.getSiteIntegrations();
        }
      })
      .catch(() => {});
  }

  public changeAnalyticGService(value) {
    this.site.googleAnalyticsService = value;
  }

  public goBack() {
    this.router.navigate(['/site/list']);
  }

  public saveSite() {
    this.sitesService.updateSiteSettings(this.siteId, this.site).subscribe((response: boolean) => {
      if (response) {
        this.toastr.success(this.translate.instant('userInfo.settingsChanged'), this.translate.instant('global.done'));
      }
    });
  }

  public getSiteIntegrations() {
    this.sitesService.getSiteIntegrations(this.siteId).subscribe((response: Integration[]) => {
      this.integrations = response.map((item: Integration) => {
        item.serviceName = this.sitesService.getCorrectNameByType(item.type);
        item.isPayment = this.sitesService.getPaymentByType(item.type);
        return item;
      });
      this.integrationsCRM = this.integrations.filter(item => {
        return this.sitesService.isIntegrationCRM(item.type);
      });
      this.integrationsMailing = this.integrations.filter(item => {
        return this.sitesService.isIntegrationMailing(item.type);
      });
      this.integrationsNotifications = this.integrations.filter(item => {
        return this.sitesService.isIntegrationNotification(item.type);
      });
      this.integrationsOthers = this.integrations.filter(item => {
        return this.sitesService.isIntegrationOthers(item.type);
      });
    });
  }

  private getSiteSettings() {
    this.sitesService.getSiteSettings(this.siteId).subscribe((response: SiteSettings) => {
      this.site = response;
      this.sitesService.getSiteShortInfo(this.siteId).subscribe((info: SiteShort) => {
        this.siteInfo = info;
        this.siteInfo.isFree = this.sitesService.isSiteHasExpTariff(this.siteInfo) || this.siteInfo.trial;
        this.siteInfo.isNotPayment = this.sitesService.isSiteHasExpTariff(this.siteInfo) && !this.siteInfo.trial;
      });
      this.sitesService.getSites().subscribe((responseSites: SiteShort[]) => {
        this.coreSitesService.sites = responseSites;
      });
    });
  }
}
