import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containerized-add',
  templateUrl: './containerized-add.component.html',
  styleUrls: ['./containerized-add.component.scss']
})
export class ContainerizedAddComponent implements OnInit {
  public companies = [];
  public newCWidgetInfo = {
    step: 1,
    containerizedType: type,
    siteId: currentSiteId,
    companyMode: $scope.companies.length === 0 ? 1 : 0,
    company: currentCompany.default ? $translate.instant("widgetsList.clone.company.chose") : currentCompany.name,
    companyId: currentCompany.default ? null : currentCompany.id,
    types: [
      {
        type: "NEW",
        title: $translate.instant("abtest.abtypes.title.new")
      },
      {
        type: "MOCKUP",
        title: $translate.instant("abtest.abtypes.title.mockup")
      }]
  };

  public editableCW = {};

  constructor() {
    this.companies = WidgetService.getCurrentCompanies();
    this.editableCW = this.getEmptyCWidget();
  }

  ngOnInit(): void {
  }

  public setNewCWidgetType(type) {
    $scope.newCWidgetInfo.createMode = type.type;

    if ($scope.newCWidgetInfo.createMode === "MOCKUP") {
      $scope.newCWidgetInfo.step = 2;
    } else if ($scope.newCWidgetInfo.createMode === "NEW") {
      $scope.editableCW.templateId = template;
      delete $scope.editableCW.mockupId;
      $scope.newCWidgetInfo.step = 3;
    }
  }

  public chooseTemplateWidget(data) {
    $scope.editableCW.mockupId = data.id;
    delete $scope.editableCW.templateId;
    $scope.newCWidgetInfo.step = 3;
  }

  public changeCompany(company) {
    $scope.newCWidgetInfo.companyId = company ? company.id : null;
    $scope.newCWidgetInfo.company = company ? company.name : $translate.instant("widgetsList.clone.company.chose");
  }

  public openAddCompanyMode() {
    $scope.newCWidgetInfo.companyMode = 1;
    $scope.newCWidgetInfo.company = "";
  }

  public closeAddCompanyMode() {
    $scope.newCWidgetInfo.companyMode = 0;
    $scope.newCWidgetInfo.company = $scope.companies[0].name;
  }

  public getFilteredCompanies() {
    return $scope.companies.filter(function (item) {
      return (item.id !== $scope.newCWidgetInfo.companyId) && !item.default;
    });
  }

  public closeAddCWidgetModal(result) {
    close(result, 200);
  }

  public addWidget() {
    if (!$scope.editableCW.templateId && !$scope.editableCW.mockupId) return false;
    console.log($scope.newCWidgetInfo, $scope.editableCW);

    if ($scope.newCWidgetInfo.companyMode === 0) {
      $scope.editableCW.companyId = $scope.newCWidgetInfo.companyId;
      this.createCWidget();
    } else {
      WidgetService.createCompany($scope.newCWidgetInfo.siteId, $scope.newCWidgetInfo.company).then(function(response) {
        $scope.editableCW.companyId = response.data.id;
        createCWidget();
      });
    }
  }

  private createCWidget() {
    CWidgetService.createCWidget($scope.newCWidgetInfo.siteId, $scope.editableCW).then(function (response) {
      window.location.href = "/widgets/edit/" + $scope.newCWidgetInfo.siteId + "-" + response.data.value + "/";
    });
  }

  private getEmptyCWidget() {
    return {
      companyId: "",
      containerId: containerId,
      name: "",
      templateId: "",
      mockupId: ""
    };
  }

}
