import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowDirective } from '@flowjs/ngx-flow';
import { FullWidget, WidgetInfo } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;
  @Input() public sid: string;
  @Input() public wid: string;
  @Input() public widget: FullWidget;
  @Input() public isDesigner: boolean;
  @Input() public isMockup: boolean;
  @Input() public isContainerized: boolean;

  public isLoading = false;

  private validators = [];

  private autoUploadSubscription: SubscriptionLike;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe(event => {
      if (event.type === 'filesSubmitted') {
        this.flow.upload();
      }
    });
  }

  public goToTest(widget) {
    this.router.navigate([`/abtests/active?testIdNum-${widget.abtestInfo.id}`]).then();
  }

  public saveAsMockup() {
    let errorsList = this.runValidators();
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
    } else {
      ($('#saveAsMockupModal') as any).modal('show');
    }
  }

  public startWidget(widget) {
    if (!widget.active) {
      this.switchWidget(widget, true);
    }
  }

  public stopWidget(widget) {
    if (widget.active) {
      this.switchWidget(widget, false);
    }
  }

  public saveWidget() {
    if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
    }
  }

  private switchWidget(widget, newValue) {
    $('[role="tooltip"]').remove();
    if (widget.active === newValue) { return false; }
    if (this.isContainerized) {
      this.containerizedWidgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    } else {
      this.widgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) { return false; }
        this.widget.active = newValue;
      });
    }
  }

  private saveMockupItem() {
    let errorsList = this.runValidators();
    this.isLoading = true;

    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
      this.isLoading = false;
    } else {
      const savedInstance = {
        name: this.widget.name,
        guiprops:  this.widget.guiprops,
        autoinvite:  this.widget.autoinvite,
        restrictions:  this.widget.restrictions,
        autoresponder:  this.widget.autoresponder,
        rules:  this.widget.rules
      } as FullWidget;

      this.widgetService.updateMockup(this.wid, savedInstance).subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translate.instant('widgetsList.editor.save.done.desc', this.translate.instant('widgetsList.editor.save.done.title'));
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        },
        () => {
          this.toastr.error(this.translate.instant('widgetsList.editor.save.error.desc'), this.translate.instant('widgetsList.editor.save.error.title'));
          this.isLoading = false;
          Swal.fire(
            this.translate.instant('widgetsList.editor.save.error.title'),
            this.translate.instant('widgetsList.editor.save.error.desc'),
            'error'
          ).then();
        }
      );
    }
  }

  private saveWidgetItem() {
    const currentDate = new Date();
    this.widget.guiprops.dhVisual.lastModifiedDate = currentDate;
    this.widget.guiprops.dhVisual.widget_width_all   = this.SP_widget.widget_width_all;
    this.widget.guiprops.dhVisual.widget_height_all  = this.SP_widget.widget_height_all;
    this.widget.guiprops.dhVisual.widget_width_nopx  = this.SP_widget.widget_width_nopx;
    this.widget.guiprops.dhVisual.widget_height_nopx = this.SP_widget.widget_height_nopx;
    this.widget.guiprops.dhVisual.widget_ul_width_nopx = this.SP_widget.widget_ul_width_nopx;
    this.widget.guiprops.dhVisual.CP_width = this.SP_widget.widget_CP_width;
    this.widget.guiprops.dhVisual.CP_offset_top = this.SP_widget.widget_CP_offset_top;
    this.widget.guiprops.image.width = this.SP_widget.img_width;
    this.widget.guiprops.image.height = this.SP_widget.img_height;

    this.addCouponsId();
    this.mapFormExtFieldId();

    let errorsList = this.runValidators();
    this.isLoading = true;
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length != 0) {
      toastr["error"]($scope.localization.save.validation.desc, $scope.localization.save.validation.title);
      l.stop();
    } else if (couponsErrorFlag) {
      toastr["error"]($translate.instant("widgets.constructor.coupon.saveError"), $scope.localization.save.validation.title);
      l.stop();
    } else if (formExtIdsErrorFlag) {
      toastr["error"]($translate.instant("widgets.constructor.formExtId.saveError"), $scope.localization.save.validation.title);
      l.stop();
    } else if (formExtNeedButton) {
      toastr["error"]($translate.instant("widgets.constructor.formExtId.actionButton.saveError"), $scope.localization.save.validation.title);
      l.stop();
    } else if (formExtRedirectFieldEmpty) {
      toastr["error"]($translate.instant("widgets.constructor.formExtId.redirectError"), $scope.localization.save.validation.title);
      l.stop();
    } else if ($scope.widget.useCustomIntegrationsList && !$scope.widget.integrations.length) {
      toastr["error"]($translate.instant("widgets.constructor.integration.saveError"), $scope.localization.save.validation.title);
      l.stop();
    } else {
      $scope.widget.jsInfo.onShowScript.script = $scope.widget.jsInfo.onShowScript.script || null;
      $scope.widget.jsInfo.onTargetScript.script = $scope.widget.jsInfo.onTargetScript.script || null;
      var widgetUpdatedData = {
        guiprops: $scope.widget.guiprops,
        autoinvite: $scope.widget.autoinvite,
        autoresponder: $scope.widget.autoresponder,
        restrictions: $scope.widget.restrictions,
        rules: $scope.widget.rules,
        audiencesEnabled: $scope.widget.audiencesEnabled,
        sendCrm: $scope.widget.sendCrm,
        coupons: $scope.couponsId,
        integrations: $scope.widget.integrations,
        useCustomIntegrationsList: $scope.widget.useCustomIntegrationsList,
        customFields: $scope.customFields,
        jsInfo: $scope.widget.jsInfo
      };

      WidgetService.updateWidget($scope.sid, $scope.widget.id, widgetUpdatedData).then(function(response) {
        if (response && response.success) {
          toastr["success"]($scope.localization.save.done.desc, $scope.localization.save.done.title);
        }
        setTimeout(function(){
          l.stop();
        }, 1000);
      });
    }
  }

  private runValidators() {
    let errorsList = [];
    this.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    return errorsList;
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

}

