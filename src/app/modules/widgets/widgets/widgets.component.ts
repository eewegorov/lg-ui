import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CampaignDeleteComponent } from '../campaign-delete/campaign-delete.component';
import { WidgetAddComponent } from '../widget-add/widget-add.component';
import { Company, CompanyShort, Entities, WidgetInfo, WidgetTemplate, WidgetType } from '../../../core/models/widgets';
import { Abtest } from '../../../core/models/abtests';
import { TariffsService } from '../../../core/services/tariffs.service';
import { CoreSitesService } from '../../../core/services/core-sites.service';
import { SitesService } from '../../sites/services/sites.service';
import { AbtestsService } from '../../abtests/services/abtests.service';
import { WidgetService } from '../services/widget.service';
import { CloneWidgetComponent } from '../clone-widget/clone-widget.component';
import { SiteShort } from '../../../core/models/sites';


@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {
  public sites = [];
  public companies = [];
  public containers = [];
  public smartPoints;
  public currentSite = { id: '', name: '' };
  public currentCompany = {} as Company;
  public defCompanyName = '';
  public newCompany = {
    on: false,
    name: ''
  };

  private widgets: Record<string, WidgetInfo[]>;
  private types: WidgetType[] = [];
  private enableWidgetsModal = false;

  constructor(
    private location: Location,
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService
  ) {
    this.enableWidgetsModal = this.location.path().includes('enableModal');
  }

  ngOnInit(): void {
    const selectedSite = localStorage.getItem('currentSite');

    this.translate.get('widgetsList.defCompany').subscribe((translatedValue: string) => {
      this.defCompanyName = translatedValue;
      /*this.sitesService.getSitesShort().subscribe((response: SiteShort[]) => {
        if (response) {*/
      const response = [{
        id: '5f120a7646e0fb00012c2632',
        name: 'mysecondsite',
        url: 'secondsecond.ru',
        tariffName: 'Пробный',
        tariffExp: 1595881841107,
        trial: false
      }, {
        id: '5f120a5446e0fb0001d8c981',
        name: 'mysupermegasite',
        url: 'mysupermegasite.com',
        tariffName: 'Пробный',
        tariffExp: 1595881811225,
        trial: true
      }]; // удалить статику и раскомментировать подписку
          this.sites = response;
          this.coreSitesService.sites = response;
          this.currentSite = selectedSite ? this.coreSitesService.getSiteById(selectedSite) : response[0];
          if (!this.currentSite) {
            this.currentSite = response[0];
          }
          this.setCurrentSite();
        /*}
      });*/
    });

    this.widgetService.updateWidgetsList.subscribe((data: string) => {
      this.getAllWidgetsForSite(data, true);
    });

    this.widgetService.openCloneWidgetModal.subscribe(({ data, containerId }) => {
      const modalRef = this.modalService.open(CloneWidgetComponent, {
        size: 'lg',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.sites = this.sites;
      modalRef.componentInstance.currentSite = this.currentSite;
      modalRef.componentInstance.companies = this.companies;
      modalRef.componentInstance.widget = data;
      modalRef.componentInstance.containerId = containerId;
    });

    this.widgetService.getWidgetsTemplates().subscribe((response: WidgetTemplate[]) => {
      if (response) {
        this.widgetService.setCurrentWidgetsTemplates(response);
      }
    });

    /*this.widgetService.getWidgetsTypes().subscribe((response: WidgetType[]) => {*/
    const response = [
      {
        "id": "41546171c1119ffa9b64fa1bb81d5020",
        "name": "Another type",
        "description": "",
        "previewLink":
          "http://static.leadgenic.com/img/31spadx88210.jpg",
        "code": "TYPE2",
        "static": false,
        "containerized": true
      },
      {
        "id": "24df1be21857f12573487da968c2fc3f",
        "name": "Other",
        "description": "",
        "previewLink":
          "http://static.leadgenic.com/img/dasdcz781313xc9z.jpg",
        "code": "other",
        "static": true,
        "containerized": false
      },
      {
        "id": "0bf813e40c9823e90f286775eb6b801c",
        "name": "Type 1",
        "description": "Type description",
        "previewLink":
          "http://static.leadgenic.com/img/ztyappqmyuv.jpg",
        "code": "TYPE1",
        "static": true,
        "containerized": false
      }
    ];
      if (response) {
        this.types = response;
        this.widgetService.setCurrentWidgetsTypes(response);
      }
    /*});*/
  }

  private setCurrentSite() {
    localStorage.setItem('currentSite', this.currentSite.id);
    this.sitesService.setCurrentSiteId(this.currentSite.id);
    this.getAllWidgetsForSite(this.currentSite.id);
    this.resetNewCompany();
  }

  public getTypeItem(typeId: string): WidgetType {
    return this.types.find((item: WidgetType) => {
      return item.code === typeId;
    });
  }

  public deleteCompany() {
    const modalRef = this.modalService.open(CampaignDeleteComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.companies = this.companies;
    modalRef.componentInstance.deletedCompany = this.currentCompany;
    modalRef.result.then((deletedId: boolean) => {
      if (!deletedId) {
        return false;
      }
      this.getAllWidgetsForSite(this.sitesService.getCurrentSiteId());
    })
      .catch(() => {});
  }

  public getTypesWithCompanyFilter() {
    if (!this.widgets) {
      return [];
    }
    const keys = Object.keys(this.widgets);
    return keys.filter((item) => {
      return this.getFilteredWidgets(item).length > 0;
    });
  }

  public getFilteredWidgets(type): WidgetInfo[] {
    if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id) {
      return this.widgets[type];
    }
    return this.widgets[type].filter((item: WidgetInfo) => {
      return item.companyId === this.currentCompany.id;
    });
  }

  private getAllWidgetsForSite(siteId, stayCompany?) {
    /*this.abtestsService.getTests().pipe(
      switchMap((response: Abtest[]) => {
        this.abtestsService.setListOfABTests(response);
        return this.widgetService.getWidgetsList(siteId);
      })
    ).subscribe((response: Entities) => {*/

    const responseTests = [{
      "id": "7f7f888d41b6c33ef1884db7c48a2d32",
      "name": "Another test",
      "description": "test description",
      "state": "ACTIVE",
      "type": "0bf813e40c9823e90f286775eb6b801c",
      "siteId": "9aafd4f7bd05ca810dea91985b7ace93"
    },
      {
        "id": "acd0411f5e83a8f476db619c87e85fe8",
        "name": "TEST2",
        "description": "",
        "state": "PAUSED",
        "type": "41546171c1119ffa9b64fa1bb81d5020",
        "siteId": "9aafd4f7bd05ca810dea91985b7ace93"
      }];
    this.abtestsService.setListOfABTests(responseTests as Abtest[]);

      const response = {
        "companies": [
          {
            "id": "1de2578605e8244560bacd479de4c284",
            "name": null,
            "default": true
          }, {
            "id": "c283a66ec3d804d3a7ae8f6a40aadf59",
            "name": "An apple",
            "default": false
          }, {
            "id": "80b842f12ed04a969f9c98843efa5430",
            "name": "Company 1",
            "default": false
          }, {
            "id": "9ea36db589f37dbc5c51848d0ffbab3f",
            "name": "Some another company",
            "default": false
          } ],
        "smartPoints": {
          "enabled": true,
          "list": [ {
            "enabled": true,
            "autoinvite": true,
            "pos": "LEFT_DOWN",
            "type": "CALLBACK"
          },
            {
              "enabled": true,
              "autoinvite": true,
              "pos": "LEFT_EDGE",
              "type": "EXIT_INTENT"
            }, {
              "enabled": true,
              "autoinvite": true,
              "pos": "RIGHT_DOWN",
              "type": "INSTANT_POPUP"
            }, {
              "enabled": true,
              "autoinvite": true,
              "pos": "LEFT_EDGE",
              "type": "INVITE"
            }, {
              "enabled": false,
              "autoinvite": false,
              "pos": "LEFT_EDGE",
              "type": "MOBILE"
            }, {
              "enabled": false,
              "autoinvite": false,
              "pos": "LEFT_EDGE",
              "type": "POPUP"
            } ]
        },
        "widgets": {
          "TYPE2": [ {
            "id": "60db34a8b6707488fde8a78a3c7e86a0",
            "name": "f417ec1f254b1e179f31c23c0ba1a3b9",
            "type": "TYPE2",
            "template": "TEMPLATE3",
            "companyId": "1de2578605e8244560bacd479de4c284",
            "active": true,
            "abtestInfo": null
          } ],
          "TYPE1": [{
            "id": "a4503b9afbcace0588309cd26eed71d1",
            "name": "2ccace33c0cb86f40e6423a0597de107",
            "type": "TYPE1",
            "template": "TEMPLATE1",
            "companyId": "80b842f12ed04a969f9c98843efa5430",
            "active": true,
            "abtestInfo": {
              "id": "fe6c99154f201821387137aac2150821",
              "type": "SUPERWIDGET"
            }
          }, {
            "id": "5c212366f48b7ea60f93af6c08fb6ead",
            "name": "fdfc2aedc82ae9b173da25032043e473",
            "type": "TYPE1",
            "template": "TEMPLATE2",
            "companyId": "1de2578605e8244560bacd479de4c284",
            "active": true,
            "abtestInfo": null
          }, {
            "id": "d7e6bd030a7d2ad0e66809b53f66e3e3",
            "name": "7d6a249156f580fb03c456af02255338",
            "type": "TYPE1",
            "template": "TEMPLATE2",
            "companyId": "9ea36db589f37dbc5c51848d0ffbab3f",
            "active": false,
            "abtestInfo": null
          } ]
        },
        "containers": [
          {
            "id": "be4f43ffe117a6efbe9f43e7ba2d6ed0",
            "name": "Container 1",
            "description": "Container 1 desc",
            "widgets": [
              {
                "id": "cab80406809a26c2c880380aaf5b4798",
                "name": "030540042056d3404f0cb7a84a765868",
                "type": "TYPE1",
                "template": "TEMPLATE1",
                "companyId":
                  "c283a66ec3d804d3a7ae8f6a40aadf59",
                "active": true,
                "abtestInfo": {
                  "id": "615c865f4ed9135e0937fb077c900e55",
                  "type": "SUPERWIDGET"
                }
              }, {
                "id": "682c3d745dece0db85812a1d1b6197b8",
                "name": "63f26001f4c8c15dbc67b76ef6bcd1cd",
                "type": "TYPE1",
                "template": "TEMPLATE1",
                "companyId":
                  "9ea36db589f37dbc5c51848d0ffbab3f",
                "active": true,
                "abtestInfo": null
              }]
          }, {
            "id": "a126e39e8388cf9884ab9ee66ecedba6",
            "name": "Container 2",
            "description": "Container 2 desc",
            "widgets": [
              {
                "id": "e9202b18bcdb4d1daff3cdb5c3e2f844",
                "name": "766145d2796dd1bdb17cd7970739cecc",
                "type": "TYPE1",
                "template": "TEMPLATE1",
                "companyId":
                  "80b842f12ed04a969f9c98843efa5430",
                "active": true,
                "abtestInfo": null
              }
            ] }],

      };
      this.companies = response.companies;
      this.widgetService.setCurrentCompanies(response.companies);

      if (!stayCompany) {
        this.currentCompany = this.widgetService.getDefaultCompany(this.companies);
      }
      this.containers = response.containers;
      this.widgetService.setContainers(this.containers);
      this.smartPoints = response.smartPoints;
      this.widgets = response.widgets as Record<string, WidgetInfo[]>;
      if (this.enableWidgetsModal) {
        this.enableWidgetsModal = false;
        setTimeout(() => {
          this.createNewWidget();
        }, 500);
      }
    /*});*/
  }

  public createNewWidget() {
    // TODO: Check tariffExp
    if (this.sitesService.isSiteHasExpTariff(this.currentSite) && this.getWidgetsCount() >= 3) {
      this.tariffsService.checkTariffPlans(this.currentSite.id,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.limit', { siteName: this.currentSite.name }));
    } else {
      const modalRef = this.modalService.open(WidgetAddComponent, {
        size: 'xl',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.currentSite = this.currentSite;
      modalRef.componentInstance.companies = this.widgetService.getUndefaultCompanies(this.companies);
      modalRef.componentInstance.currentCompany = this.currentCompany;
      modalRef.result.then((result) => {
        // TODO: Implement logic when close modal. Don't forget "result"
      })
        .catch(() => {});
    }
  }

  public changeCurrentSite(site): void {
    this.currentSite = site;
    this.setCurrentSite();
  }

  public changeCurrentCompany(company): void {
    this.currentCompany = company;
  }

  public saveNewCompany() {
    this.widgetService.createCompany(this.sitesService.getCurrentSiteId(), this.newCompany.name).subscribe((response: CompanyShort) => {
      if (response) {
        this.companies.push(response);
        this.widgetService.setCurrentCompanies(this.companies);

        this.currentCompany = response as Company;
        this.toastr.success(this.translate.instant('widgetsList.company.add.desc'), this.translate.instant('global.done') + '!');
      }
      this.resetNewCompany();
    });
  }

  public enableDisableSP() {
    this.widgetService.startStopSmartpoint(this.sitesService.getCurrentSiteId(), this.smartPoints.enabled);
  }

  public isHasWidgets() {
    const types = Object.keys(this.widgets);
    for (const item of types) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.widgets[item].length; j++) {
        if (this.currentCompany.id === this.widgetService.getDefaultCompany(this.companies).id ||
          this.widgets[item][j].companyId === this.currentCompany.id) {
          return true;
        }
      }
    }
    return false;
  }

  public filteredContainers() {
    if (!this.currentCompany || this.currentCompany.default) { return this.containers; }

    return this.containers.filter((item) => {
      return item.widgets.some((widget) => widget.companyId === this.currentCompany.id);
    });
  }

  private getWidgetsCount(): number {
    const keys = Object.keys(this.widgets);
    let count = 0;
    keys.forEach((item: string) => {
      count += this.widgets[item].length;
    });
    return count + this.getContainerizedWidgetLength();
  }

  private getContainerizedWidgetLength(): number {
    let count = 0;
    this.containers.forEach((container) => {
      count += container.widgets.length;
    });
    return count;
  }

  private resetNewCompany() {
    this.newCompany = {
      on: false,
      name: ''
    };
  }

}
