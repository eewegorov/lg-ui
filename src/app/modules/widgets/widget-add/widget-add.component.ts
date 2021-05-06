import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from 'ngx-filter-pipe';
import {
  CompanyShort,
  ContainerShort,
  NewWidgetInfo,
  WidgetCreated,
  WidgetCreateRequest
} from '../../../core/models/widgets';
import { ContainerizedWidgetService } from '../services/containerized-widget.service';
import { WidgetService } from '../services/widget.service';

@Component({
  selector: 'app-widget-add',
  templateUrl: './widget-add.component.html',
  styleUrls: ['./widget-add.component.scss'],
  providers: [FilterPipe]
})
export class WidgetAddComponent implements OnInit {
  @Input() public currentSite;
  @Input() public companies;
  @Input() public currentCompany;

  public editableWidget: NewWidgetInfo;
  public newWidgetStep = 1;
  public widgetTypes = [];
  public templates = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private filterPipe: FilterPipe,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) {
    this.editableWidget = {
      siteId: this.currentSite.id,
      templateId: '',
      mockupId: '',
      typeId: '',
      widgetName: '',
      name: '',
      companyMode: this.companies.length === 0 ? 1 : 0,
      company: this.currentCompany.default ? this.translate.instant('widgetsList.clone.company.chose') : this.currentCompany.name,
      companyId: this.currentCompany.default ? null : this.currentCompany.id
    };

    this.widgetTypes = this.widgetService.getCurrentWidgetsTypes();
    this.templates = this.widgetService.getCurrentWidgetsTemplates();
  }

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
    this.editableWidget.company = company ? company.name : this.translate.instant('widgetsList.clone.company.chose');
  }

  public openAddCompanyMode() {
    this.editableWidget.companyMode = 1;
    this.editableWidget.company = '';
  }

  public closeAddCompanyMode() {
    this.editableWidget.companyMode = 0;
    this.editableWidget.company = this.currentCompany.default
      ? this.translate.instant('widgetsList.clone.company.chose') : this.currentCompany.name;
    this.editableWidget.companyId = this.currentCompany.default ? null : this.currentCompany.id;
  }

  public getFilteredCompanies() {
    return this.companies.filter((item) => {
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
      this.editableWidget.company = '';
    }
  }

  /**
   * Set new widget type
   */
  public setType(type) {
    this.editableWidget.typeId = type.id;
    this.editableWidget.containerized = type.containerized;
    this.newWidgetStep = 3;

    const templateItems = this.filterPipe.transform(this.templates, type.id);
    if (templateItems.length === 1) {
      this.setTemplate(templateItems[0]);
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
      this.editableWidget.company = '';
    }

    this.editableWidget.templateId = null;
    this.editableWidget.typeId = data.type;
    this.editableWidget.mockupId = data.id;
  }

  public addWidget() {
    if (!this.editableWidget.templateId && !this.editableWidget.mockupId) { return false; }

    const newWidget: WidgetCreateRequest = {
      name: this.editableWidget.name
    } as WidgetCreateRequest;

    if (this.editableWidget.templateId) {
      newWidget.templateId = this.editableWidget.templateId;
    } else {
      newWidget.mockupId = this.editableWidget.mockupId;
    }

    if (this.editableWidget.companyMode === 0) {
      newWidget.companyId = this.editableWidget.companyId;
      this.createWidget(newWidget);
    } else {
      this.widgetService.createCompany(this.editableWidget.siteId, this.editableWidget.company).subscribe((response: CompanyShort) => {
        newWidget.companyId = response.id;
        this.createWidget(newWidget);
      });
    }
  }

  private createWidget(widget) {
    const siteId = this.editableWidget.siteId;

    if (this.editableWidget.containerized) {

      this.containerizedWidgetService.getWContainerName().pipe(
        switchMap((name: string) => this.containerizedWidgetService.createWContainer(siteId, name)),
        switchMap((container: ContainerShort) => {
          widget.containerId = container.id;
          return this.containerizedWidgetService.create(siteId, widget);
        })
      ).subscribe((response: WidgetCreated) => {
        this.router.navigate([`/widgets/edit/${siteId}-${response.value}/`]).then();
      });
    } else {
      this.widgetService.create(siteId, widget).subscribe((response: WidgetCreated) => {
        this.router.navigate([`/widgets/edit/${siteId}-${response.value}/`]).then();
      });
    }
  }

}
