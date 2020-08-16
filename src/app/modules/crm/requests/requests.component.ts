import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public item = {
    widgetName: 'fsdf',
    date: '1231231',
    state: 'sdfsf',
    status: 'asdasda'
  };
  public periodStart;
  public allSites = [];
  public sitesIds = [];
  private ALL_SITE_ID = '0000000000000000';
  private ONE_DAY = 86400000;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.translate.get('crm.page.filter.sites.all').subscribe((translation: string) => {
      this.allSites = [{
        id: this.ALL_SITE_ID,
        name: translation
      }, {
        "id": "5f120a7646e0fb00012c2632",
        "name": "mysecondsite",
        "url": "secondsecond.ru",
        "tariffName": "Пробный",
        "tariffExp": 1595881841107,
        "trial": false
      }, {
        "id": "5f120a5446e0fb0001d8c981",
        "name": "mysupermegasite",
        "url": "mysupermegasite.com",
        "tariffName": "Пробный",
        "tariffExp": 1595881811225,
        "trial": true
      }];
      this.sitesIds = [this.ALL_SITE_ID];
    });

  }

  public showYesterdayDate() {

  }

  public checkFilters(newValue, type: 'sites' | 'states') {
    if (newValue.id === this.ALL_SITE_ID) {
      this.sitesIds = [this.ALL_SITE_ID];
      this.validateFields(newValue, type, true);
    } else {
      this.sitesIds = this.sitesIds.filter(item => item !== this.ALL_SITE_ID);
      this.validateFields(newValue, type, false);
    }
  }

  private validateFields(newValue, type: 'sites' | 'states', setAllSite: boolean) {
    /*if (angular.isUndefined(list)) {
      return;
    }

    if (!list.length) {
      list.push(ALL_SITE_ID);
    } else if (setAllSite) {
      list = [ALL_SITE_ID];
    } else if (list[0] === ALL_SITE_ID && list.length > 1) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === ALL_SITE_ID) {
          list.splice(i, 1);
        }
      }
    }
    if (type === "sitesIds") {
      $scope.sitesIds = list;
    } else if (type === "statesIds") {
      $scope.statesIds = list;
    }

    this.timeoutFiltering();*/
  }

  private timeoutFiltering(useCurrentOffset) {
    /*$timeout.cancel(filterTimeout);
    filterTimeout = $timeout(function() {
      if (!useCurrentOffset) {
        $scope.searchParams.offset = 0;
      }
      getLeads();
    }, 50);*/
  }

  private getLeads() {
    /*$scope.initTables = false;
    console.log($scope.periodStart, getTomorrowCopyDate($scope.periodEnd));
    var params = {
      orders: $scope.sortingDesc ? "-date" : "date",
      limit: $scope.searchParams.limit.value,
      offset: $scope.searchParams.offset,
      dateFrom: getUNIXTime($scope.periodStart),
      dateTo: getUNIXTime(getTomorrowCopyDate($scope.periodEnd))
    };
    if ($scope.sitesIds.length && $scope.sitesIds[0] !== ALL_SITE_ID) {
      params.siteId = $scope.sitesIds.join(",");
    }
    if ($scope.statesIds.length && $scope.statesIds[0] !== ALL_SITE_ID) {
      params.state = $scope.statesIds.join(",");
    }

    CRMService.getLeadList(params).then(function(response) {
      $timeout(function() {
        $scope.leads = response.data.map(function(item) {
          item.status = setStatusByState(item.state);
          item.widgetName = setExtraName(item.widgetName);
          return item;
        });
        $scope.initTables = true;
      }, 500);
    });*/
  }

}
