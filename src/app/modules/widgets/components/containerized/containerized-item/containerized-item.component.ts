import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Abtest } from '@core/models/abtests';
import { Company, Container, WidgetInfo, WidgetStatistics } from '@core/models/widgets';
import { TariffsService } from '@core/services/tariffs.service';
import { AbtestsService } from '@modules/abtests/services/abtests.service';
import { CoreSitesService } from '@core/services/core-sites.service';
import { SitesService } from '@modules/sites/services/sites.service';
import { WidgetService } from '../../../services/widget.service';
import { ContainerizedWidgetService } from '../../../services/containerized-widget.service';
import { AbtestAddComponent } from '@modules/abtests/components/abtest-add/abtest-add.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-containerized-item',
  templateUrl: './containerized-item.component.html',
  styleUrls: ['./containerized-item.component.scss'],
  providers: [DecimalPipe]
})
export class ContainerizedItemComponent implements OnInit {
  @Input() public item: WidgetInfo;
  @Input() public first: boolean;
  @Input() public last: boolean;
  @Input() private containerId = '';
  @Input() private siteId = '';
  @Input() private prev: WidgetInfo;
  @Input() private next: WidgetInfo;

  public readonly widgetNameEditing$: Observable<boolean>;
  public readonly widgetCampaignEditing$: Observable<boolean>;
  public widgetCampaign = {} as Company;
  public widgetEditingCampaign = {
    id: '',
    name: '',
    companyId: ''
  };
  public widgetEditingName: string;

  private readonly _widgetNameEditing$: BehaviorSubject<boolean>;
  private readonly _widgetCampaignEditing$: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private decimalPipe: DecimalPipe,
    private tariffsService: TariffsService,
    private coreSitesService: CoreSitesService,
    private sitesService: SitesService,
    private abtestsService: AbtestsService,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
    this._widgetNameEditing$ = new BehaviorSubject<boolean>(false);
    this._widgetCampaignEditing$ = new BehaviorSubject<boolean>(false);

    this.widgetNameEditing$ = this._widgetNameEditing$.asObservable().pipe(
      tap((state: boolean) => {
        if (state) {
          this.widgetEditingName = this.item.name;
        }
      })
    );

    this.widgetCampaignEditing$ = this._widgetCampaignEditing$.asObservable().pipe(
      tap((state: boolean) => {
        if (state) {
          this.widgetEditingCampaign = {
            id: this.item.id,
            name: this.widgetCampaign.name,
            companyId: this.item.companyId
          };
        }
      })
    );
  }

  ngOnInit(): void {
    const abTests = this.abtestsService.getListOfABTests();
    if (this.item.abtestInfo) {
      abTests.forEach((test: Abtest) => {
        if (this.item.abtestInfo.id === test.id) {
          this.item.abtestInfo.state = test.state;
        }
      });
    }

    this.widgetCampaign = this.widgetService.getCompanyById(
      this.item.companyId,
      this.widgetService.getCurrentCompanies()
    );

    this.widgetService.getWidgetStatistics(this.item.id).subscribe((response: WidgetStatistics) => {
      if (response) {
        this.item.widgetConversion = response;
      }
    });
  }

  public toggleWidgetNameEditing(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    this._widgetNameEditing$.next(!this._widgetNameEditing$.getValue());
  }

  public toggleWidgetCampaignEditing(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    this._widgetCampaignEditing$.next(!this._widgetCampaignEditing$.getValue());
  }

  public getCConversion() {
    return (
      this.decimalPipe.transform(
        (100 * this.item.widgetConversion.targets) / this.item.widgetConversion.shows,
        '1.0-2'
      ) + '%'
    );
  }

  public updateCWidget(): void {
    if (this.widgetEditingName !== this.item.name) {
      this.containerizedWidgetService.rename(this.siteId, this.item.id, this.widgetEditingName).subscribe(
        (result: boolean) => {
          if (result) {
            this.item.name = this.widgetEditingName;
          }
        },
        () => {},
        () => {
          this.toggleWidgetNameEditing();
          this.widgetEditingName = '';
        }
      );
    } else {
      this.toggleWidgetNameEditing();
    }
  }

  public swapCWidgets(isUp) {
    this.containerizedWidgetService
      .swap(this.siteId, this.item.id, isUp ? this.prev.id : this.next.id)
      .subscribe(() => {
        this.widgetService.updateCurrentContainer.next(this.containerId);
      });
  }

  public switchCWidget(newValue) {
    if (this.item.active === newValue) {
      return false;
    }
    this.containerizedWidgetService.switch(this.siteId, this.item.id, newValue).subscribe((response: boolean) => {
      if (!response) {
        return false;
      }
      this.item.active = newValue;
    });
  }

  public changeEditingCampaign(campaign) {
    this.widgetEditingCampaign.companyId = campaign.id;
    this.widgetEditingCampaign.name = campaign.name;
    this.widgetEditingCampaign.id = this.item.id;
  }

  public changeCWidgetCompany() {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    if (this.widgetCampaign.id === this.widgetEditingCampaign.companyId) {
      this.toggleWidgetCampaignEditing();
      return;
    }
    this.containerizedWidgetService
      .changeCWidgetCompany(this.siteId, this.item.id, this.widgetEditingCampaign.companyId)
      .subscribe(() => {
        this.item.companyId = this.widgetEditingCampaign.companyId;
        this.widgetCampaign = this.widgetService.getCompanyById(
          this.item.companyId,
          this.widgetService.getCurrentCompanies()
        );
        this.resetChangeCompany();
        this.widgetService.updateCurrentContainer.next(this.containerId);
      });
  }

  public getFilteredCompanies() {
    return this.widgetService.getCurrentCompanies().filter(item => {
      return !item.default;
    });
  }

  public resetChangeCompany() {
    this.widgetEditingCampaign = {
      id: '',
      name: '',
      companyId: ''
    };
  }

  public removeCWidget() {
    if (this.item.abtestInfo && this.item.abtestInfo.state) {
      this.toastr.error(this.translate.instant('abtests.widget.deleteiftest'), this.translate.instant('global.error'));
      return false;
    }

    this.containerizedWidgetService
      .getWContainerInfo(this.siteId, this.containerId)
      .subscribe((container: Container) => {
        if (container.widgets.length === 1) {
          Swal.fire({
            title: this.translate.instant('containerized.container.widget.remove.ifone'),
            heightAuto: false,
            text: '',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: this.translate.instant('widgetsList.widget.delete.title'),
            text: this.translate.instant('widgetsList.widget.delete.text'),
            icon: 'warning',
            heightAuto: false,
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: this.translate.instant('widgetsList.widget.delete.confirm'),
            cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel')
          }).then(isConfirm => {
            if (isConfirm) {
              this.widgetService.deleteWidget(this.siteId, this.item.id).subscribe((response: boolean) => {
                if (response) {
                  this.toastr.success(
                    this.translate.instant('widgetsList.widget.delete.desc'),
                    this.translate.instant('global.done')
                  );
                }

                this.widgetService.updateWidgetsList.next(this.siteId);
              });
            }
          });
        }
      });
  }

  public duplicateCWidget() {
    this.widgetService.openCloneWidgetModal.next({ data: this.item, containerId: this.containerId });
  }

  public abAction() {
    const currentSite = this.coreSitesService.getSiteById(this.siteId);

    // TODO: Check if it's payment query
    if (this.sitesService.isSiteHasExpTariff(currentSite)) {
      this.tariffsService.checkTariffPlans(
        this.siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.abtest', { siteName: currentSite.name })
      );
    } else {
      const modalRef = this.modalService.open(AbtestAddComponent, {
        size: 'xl',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
      modalRef.componentInstance.currentSite = currentSite;
      modalRef.componentInstance.widget = this.item;
      modalRef.componentInstance.isContainerized = true;
    }
  }

  public abIfNoTest() {
    if (!this.item.abtestInfo || !this.item.abtestInfo.state) {
      return true;
    }
  }

  public abIfTestOnWork() {
    if (this.item.abtestInfo && this.item.abtestInfo.state && this.item.abtestInfo.state === 'ACTIVE') {
      return true;
    }
  }

  public abIfTestOnPause() {
    if (this.item.abtestInfo && this.item.abtestInfo.state && this.item.abtestInfo.state === 'PAUSED') {
      return true;
    }
  }

  public goToTest() {
    this.router.navigate([`/abtests/active`], { queryParams: { testIdNum: this.item.abtestInfo.id } }).then();
  }

  public goToConstructor() {
    this.router.navigate([`/widgets/edit/${this.siteId}-${this.item.id}/`]).then();
  }
}
