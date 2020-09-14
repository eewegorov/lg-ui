import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { BillingService } from '../../../core/services/billing.service';
import { SitesService } from '../services/sites.service';
import { SiteSettings, SiteShort } from '../../../core/models/sites';


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
    private billingService: BillingService,
    private sitesService: SitesService
  ) {
    this.codeSiteScript = this.sitesService.generatePath(this.siteId, true);
    this.siteId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getSiteSettings();
  }

  ngAfterViewChecked(): void {
    (<any>$('[data-toggle="tooltip"]')).tooltip();
  }

  public setTab(newTab) {
    this.tab = newTab;
  }

  public removeSite() {
    Swal.fire({
      title: this.translate.instant('sitelist.delete.title'),
      text: this.translate.instant('sitelist.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('sitelist.delete.confirm'),
      cancelButtonText: this.translate.instant('global.cancel'),
    }).then((isConfirm) => {
      /*if (isConfirm) {
        this.sitesService.deleteSite(this.siteId).subscribe(() => {
          swal($translate.instant("sitelist.delete.done"), $translate.instant("sitelist.delete.deleted"), "success");
          $timeout(function() {
            $scope.goBack();
          }, 1000);
        });
      }*/
    });
  }

  public onChangePaymentLogo() {
    if (this.siteInfo.isFree) {
     setTimeout(() => {
       this.site.needHideLogo = false;
       this.site.logoRefLink = false;
       this.billingService.checkTariffPlans(this.siteId,
         this.translate.instant('sitelist.tariff.title'),
         this.translate.instant('settings.site.integration.paymentLabel', {siteName: this.site.name}));
      }, 500);
    }
  }

  public openModalForCreatingNewIntegration() {

  }

  public changeAnalyticGService(value) {
    this.site.googleAnalyticsService = value;
  }

  public goBack() {
    this.router.navigate(['/site/list']);
  }

  public saveSite() {

  }

  private getSiteSettings() {
    /*this.sitesService.getSiteSettings(this.siteId).subscribe((response: SiteSettings) => {*/
    const response = {
      "name": "Some site name",
      "url": "valera.petrarch.com",
      "needLeadNotification": false,
      "logoRefLink": false,
      "needEmailSubscriptions": true,
      "needHideLogo": true,
      yandexAnalyticsCounter: "31aasdfsdfs",
      googleAnalyticsService: "GTAG"
    };
      this.site = response;
      this.sitesService.getSiteShortInfo(this.siteId).subscribe((info: SiteShort) => {
        this.siteInfo = info;
        this.siteInfo.isFree = this.sitesService.isSiteHasExpTariff(this.siteInfo) || this.siteInfo.trial;
        this.siteInfo.isNotPayment = this.sitesService.isSiteHasExpTariff(this.siteInfo) && !this.siteInfo.trial;
      });
      this.sitesService.getSitesShort().subscribe((responseSites: SiteShort[]) => {
        this.sitesService.sites = responseSites;
      });
    /*});*/
  }

}
