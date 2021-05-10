import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteShort } from '../../../core/models/sites';
import { WidgetInfo } from '../../../core/models/widgets';
import { AbtestShort } from '../../../core/models/abtests';
import { WidgetService } from '../../widgets/services/widget.service';
import { ContainerizedWidgetService } from '../../widgets/services/containerized-widget.service';
import { AbtestsService } from '../services/abtests.service';

@Component({
  selector: 'app-abtest-add',
  templateUrl: './abtest-add.component.html',
  styleUrls: ['./abtest-add.component.scss']
})
export class AbtestAddComponent implements OnInit {
  @Input() private currentSite: SiteShort;
  @Input() private widget: WidgetInfo;
  @Input() private isContainerized: boolean;
  public editableAB;
  public newABTestInfo;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private abTestsService: AbtestsService
  ) { }


  ngOnInit(): void {
    this.editableAB = this.getEmptyABTest();
    this.editableAB.widgetId = this.widget.id;
    this.editableAB.templateId = this.widget.template;

    this.newABTestInfo = {
      step: 0,
      abtTypeWidget: this.widget.type,
      widgetVarName: this.translate.instant('abtests.create.variant1'),
      ABTypes: [{
        type: 'DUPLICATE',
        title: this.translate.instant('abtests.abtypes.title.duplicate')
      }, {
        type: 'NEW',
        title: this.translate.instant('abtests.abtypes.title.new')
      }, {
        type: 'MOCKUP',
        title: this.translate.instant('abtests.abtypes.title.mockup')
      }]
    };
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public goToABType() {
    this.newABTestInfo.step = 1;
  }

  public setABType(type) {
    this.editableAB.mode = type.type;

    if (this.editableAB.mode === 'MOCKUP') {
      this.newABTestInfo.step = 2;
    } else if (this.editableAB.mode === 'NEW') {
      delete this.editableAB.mockupId;
      this.createABT();
    } else if (this.editableAB.mode === 'DUPLICATE') {
      delete this.editableAB.mockupId;
      delete this.editableAB.templateId;
      this.createABT();
    }
  }

  public chooseTemplateWidget(data) {
    this.editableAB.mockupId = data.id;
    delete this.editableAB.templateId;
    this.createABT();
  }

  private createABT() {
    const dataObj = { ...this.editableAB };

    this.abTestsService.createTest(dataObj).subscribe((response: AbtestShort) => {
      if (this.isContainerized) {
        this.containerizedWidgetService.rename(this.currentSite.id, response.variantId, this.newABTestInfo.widgetVarName).subscribe(() => {
          this.router.navigate([`/widgets/edit/${this.currentSite.id}-${response.variantId}/`]).then(() => this.closeModal());
        });
      } else {
        this.widgetService.rename(this.currentSite.id, response.variantId, this.newABTestInfo.widgetVarName).subscribe(() => {
          this.router.navigate([`/widgets/edit/${this.currentSite.id}-${response.variantId}/`]).then(() => this.closeModal());
        });
      }
    });
  }

  private getEmptyABTest() {
    return {
      siteId: this.currentSite.id,
      mode: '',
      name: '',
      description: '',
      widgetId: '',
      templateId: '',
      mockupId: ''
    };
  }

}
