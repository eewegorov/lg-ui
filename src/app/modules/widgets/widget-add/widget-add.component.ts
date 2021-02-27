import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-widget-add',
  templateUrl: './widget-add.component.html',
  styleUrls: ['./widget-add.component.scss']
})
export class WidgetAddComponent implements OnInit {
  @Input() public currentSite;
  @Input() public companies;
  @Input() public currentCompany;
  type = { name: '', description: '', previewLink: '' };
  template = { name: '', description: '', previewLink: '' };
  editableWidget = { company: '' };
  company = { name: '' };

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  public closeNewWidgetModal(result) {
    this.activeModal.close(result);
  }

  public createNullWidget() {
    this.newWidgetStep = 2;
  }

  public changeCompany(company) {
    this.editableWidget.companyId = company ? company.id : null;
    this.editableWidget.company = company ? company.name : $translate.instant("widgetsList.clone.company.chose");
  }

  public openAddCompanyMode() {
    this.editableWidget.companyMode = 1;
    this.editableWidget.company = "";
  }

  public closeAddCompanyMode() {
    this.editableWidget.companyMode = 0;
    this.editableWidget.company = currentCompany.default ? $translate.instant("widgetsList.clone.company.chose") : currentCompany.name;
    this.editableWidget.companyId = currentCompany.default ? null : currentCompany.id;
  }

  public getFilteredCompanies() {
    return this.companies.filter(function (item) {
      return (item.id !== this.editableWidget.companyId) && !item.default;
    });
  }

  /**
   * Set widget template
   */
  public setTemplate(template) {
    this.editableWidget.templateId = template.id;
    this.editableWidget.mockupId = null;
    this.newWidgetStep++;
    if (this.editableWidget.companyMode === 1) {
      this.editableWidget.company = "";
    }
  }

  /**
   * Set new widget type
   */
  public setType(type) {
    this.editableWidget.typeId = type.id;
    this.editableWidget.containerized = type.containerized;
    this.newWidgetStep = 3;
    var templateItems = $filter('filter')($scope.templates, type.id);
    if (templateItems.length === 1) {
      this.setTemplate(templateItems[0]);
    }
  }

  public addWidget() {
    if (!$scope.editableWidget.templateId && !$scope.editableWidget.mockupId) return false;
    var newWidget = {
      name: $scope.editableWidget.name
    };
    if ($scope.editableWidget.templateId) {
      newWidget.templateId = $scope.editableWidget.templateId;
    } else {
      newWidget.mockupId = $scope.editableWidget.mockupId;
    }

    if ($scope.editableWidget.companyMode === 0) {
      newWidget.companyId = $scope.editableWidget.companyId;
      createWidget(newWidget);
    } else {
      WidgetService.createCompany($scope.editableWidget.siteId, $scope.editableWidget.company).then(function(response) {
        newWidget.companyId = response.data.id;
        createWidget(newWidget);
      });
    }
  }

  public chooseTemplateWidget(data) {
    this.newWidgetStep = 4;

    const currentType = this.widgetTypes.find((item) => {
      return item.id === data.type;
    });
    if (currentType) {
      this.editableWidget.containerized = currentType.containerized;
    }

    if (this.editableWidget.companyMode === 1) {
      this.editableWidget.company = "";
    }

    this.editableWidget.templateId = null;
    this.editableWidget.typeId = data.type;
    this.editableWidget.mockupId = data.id;
  }

}
