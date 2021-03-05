import { Component, Input, OnInit } from '@angular/core';
import { WidgetInfo } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-containerized-item',
  templateUrl: './containerized-item.component.html',
  styleUrls: ['./containerized-item.component.scss']
})
export class ContainerizedItemComponent implements OnInit {
  @Input() public item = {};
  @Input() public first: boolean;
  @Input() public last: boolean;
  @Input() private containerId = '';
  @Input() private siteId = '';
  @Input() private prev: WidgetInfo;
  @Input() private next: WidgetInfo;

  public changeCompanyWidget = {
    id: '',
    name: '',
    companyId: ''
  };


  constructor(
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) { }

  ngOnInit(): void {
  }

  public getCConversion() {
    return $filter("number")(((100 * scope.item.widgetConversion.target) / scope.item.widgetConversion.shows), 2) + "%";
  }

  public updateCWidget(data) {
    if (!data) {
      return false;
    }
    this.containerizedWidgetService.changeCWidgetName(scope.siteId, scope.item.id, data);
  }

  public swapCWidgets(isUp) {
    this.containerizedWidgetService.swapCWidgets(scope.siteId, scope.item.id, isUp ? scope.prev.id : scope.next.id).then(function (response) {
      EventsService.publish(EVENTS.updateCurrentContainer, scope.containerId);
    });
  }

  public switchCWidget(newValue) {
    if (scope.item.active === newValue) return false;
    CWidgetService.switchCWidget(scope.siteId, scope.item.id, newValue).then(function(response) {
      if (!response) return false;
      scope.item.active = newValue;
    });
  }

  public startChangeCompany() {
    this.changeCompanyWidget = {
      id: this.item.id,
      name: this.widgetCurrentCompany.name,
      companyId: this.item.companyId
    };
  }

  public changeCurrentCompany(company) {
    this.changeCompanyWidget.companyId = company.id;
    this.changeCompanyWidget.name = company.name;
    this.changeCompanyWidget.id = this.item.id;
  }

  public changeCWidgetCompany() {
    this.containerizedWidgetService.changeCWidgetCompany(scope.siteId, scope.item.id, scope.changeCompanyWidget.companyId).then(function (response) {
      scope.item.companyId = scope.changeCompanyWidget.companyId;
      scope.widgetCurrentCompany = WidgetService.getCompanyById(scope.item.companyId, WidgetService.getCurrentCompanies());
      scope.resetChangeCompany();
      EventsService.publish(EVENTS.updateCurrentContainer, scope.containerId);
    });
  }

  public getFilteredCompanies() {
    return WidgetService.getCurrentCompanies().filter(function (item) {
      return (item.id !== scope.changeCompanyWidget.companyId) && !item.default;
    });
  }

  public resetChangeCompany() {
    this.changeCompanyWidget = {
      id: '',
      name: '',
      companyId: ''
    };
  }

  public removeCWidget() {
    if (scope.item.abtestInfo && scope.item.abtestInfo.state) {
      toastr["error"]($translate.instant("abtest.toastr.widget.deleteiftest"), $translate.instant("abtest.toastr.widget.error"));
      return false;
    }
    CWidgetService.getWContainerInfo(scope.siteId, scope.containerId).then(function(response) {
      if (response.data.widgets.length === 1) {
        swal($translate.instant("containerized.container.widget.remove.ifone"), "", "error");
      } else {
        swal({
            title: $translate.instant("widgetsList.widget.delete.title"),
            text: $translate.instant("widgetsList.widget.delete.text"),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant("widgetsList.widget.delete.confirm"),
            cancelButtonText: $translate.instant("widgetsList.widget.delete.cancel"),
            closeOnConfirm: true,
            closeOnCancel: true },
          function(isConfirm){
            if (isConfirm) {
              WidgetService.deleteWidget(scope.siteId, scope.item.id).then(function (response) {
                if (response.code === 200) {
                  toastr["success"]($translate.instant("widgetsList.widget.delete.desc"), $translate.instant("widgetsList.widget.delete.done"));
                  SiteService.parseError(response);
                } else {
                  SiteService.parseError(response);
                }
                EventsService.publish(EVENTS.updateWidgetsList, scope.siteId);
              });
            }
          });
      }
    });
  }

  public duplicateCWidget() {
    EventsService.publish(EVENTS.openCloneWidgetModal, scope.item, scope.containerId);
  }

  public abCAction() {
    var currentSite = SiteService.getSiteById(scope.siteId);

    // TODO: Check if it's payment query
    if (SiteService.isSiteHasExpTariff(currentSite)) {
      BillingService.checkTariffPlans(scope.siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("widgetsList.payment.abtest", {siteName: currentSite.name}));
    } else {
      ModalService.showModal({
        templateUrl: "../js/abtests/create-abtest-modal/create-abtest-modal-template.html",
        controller: "CreateABTestModalController",
        inputs: {
          currentSite: currentSite,
          widget: scope.item,
          isContainerized: true
        }
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          $("body").removeClass("modal-open");
        });
      });
    }
  }

  public abIfNoTest() {
    if (!scope.item.abtestInfo || !scope.item.abtestInfo.state) {
      return true;
    }
  }

  public abIfTestOnWork() {
    if (scope.item.abtestInfo && scope.item.abtestInfo.state && (scope.item.abtestInfo.state === "ACTIVE")) {
      return true;
    }
  }

  public abIfTestOnPause() {
    if (scope.item.abtestInfo && scope.item.abtestInfo.state && (scope.item.abtestInfo.state === "PAUSED")) {
      return true;
    }
  }

  public goToTest() {
    window.location.href = "/abtests/active?testIdNum-" + scope.item.abtestInfo.id;
  }

  public goToConstructor() {
    window.location.href = "/widgets/edit/" + scope.siteId + "-" + scope.item.id + "/";
  }

}
