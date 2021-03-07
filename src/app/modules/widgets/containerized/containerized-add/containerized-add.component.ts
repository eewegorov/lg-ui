import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company, CompanyShort } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';

@Component({
  selector: 'app-containerized-add',
  templateUrl: './containerized-add.component.html',
  styleUrls: ['./containerized-add.component.scss']
})
export class ContainerizedAddComponent implements OnInit {
  @Input() currentSiteId: string;
  @Input() containerId: string;
  @Input() currentCompany: Company;
  @Input() template: string;
  @Input() type: string;

  public companies = [];
  public newCWidgetInfo = {};
  public editableCW = {};

  constructor(
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
    this.companies = this.widgetService.getCurrentCompanies();
    this.editableCW = this.getEmptyCWidget();

    this.newCWidgetInfo = {
      step: 1,
      containerizedType: this.type,
      siteId: this.currentSiteId,
      companyMode: this.companies.length === 0 ? 1 : 0,
      company: this.currentCompany.default ? this.translate.instant('widgetsList.clone.company.chose') : this.currentCompany.name,
      companyId: this.currentCompany.default ? null : this.currentCompany.id,
      types: [
        {
          type: 'NEW',
          title: this.translate.instant('abtest.abtypes.title.new')
        },
        {
          type: 'MOCKUP',
          title: this.translate.instant('abtest.abtypes.title.mockup')
        }]
    };
  }

  ngOnInit(): void {
  }

  public setNewCWidgetType(type) {
    this.newCWidgetInfo.createMode = type.type;

    if (this.newCWidgetInfo.createMode === 'MOCKUP') {
      this.newCWidgetInfo.step = 2;
    } else if (this.newCWidgetInfo.createMode === 'NEW') {
      this.editableCW.templateId = this.template;
      delete this.editableCW.mockupId;
      this.newCWidgetInfo.step = 3;
    }
  }

  public chooseTemplateWidget(data) {
    this.editableCW.mockupId = data.id;
    delete this.editableCW.templateId;
    this.newCWidgetInfo.step = 3;
  }

  public changeCompany(company) {
    this.newCWidgetInfo.companyId = company ? company.id : null;
    this.newCWidgetInfo.company = company ? company.name : this.translate.instant('');
  }

  public openAddCompanyMode() {
    this.newCWidgetInfo.companyMode = 1;
    this.newCWidgetInfo.company = '';
  }

  public closeAddCompanyMode() {
    this.newCWidgetInfo.companyMode = 0;
    this.newCWidgetInfo.company = this.companies[0].name;
  }

  public getFilteredCompanies() {
    return this.companies.filter((item) => {
      return (item.id !== this.newCWidgetInfo.companyId) && !item.default;
    });
  }

  public closeAddCWidgetModal(result) {
    this.activeModal.close(result);
  }

  public addWidget() {
    if (!this.editableCW.templateId && !this.editableCW.mockupId) { return false; }

    if (this.newCWidgetInfo.companyMode === 0) {
      this.editableCW.companyId = this.newCWidgetInfo.companyId;
      this.createCWidget();
    } else {
      this.widgetService.createCompany(this.newCWidgetInfo.siteId, this.newCWidgetInfo.company).subscribe((response: CompanyShort) => {
        this.editableCW.companyId = response.id;
        this.createCWidget();
      });
    }
  }

  private createCWidget() {
    this.containerizedWidgetService.createCWidget(this.newCWidgetInfo.siteId, this.editableCW).then(function (response) {
      window.location.href = "/widgets/edit/" + this.newCWidgetInfo.siteId + "-" + response.data.value + "/";
    });
  }

  private getEmptyCWidget() {
    return {
      companyId: '',
      containerId: this.containerId,
      name: '',
      templateId: '',
      mockupId: ''
    };
  }

}
