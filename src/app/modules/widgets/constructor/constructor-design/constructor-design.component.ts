import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowDirective } from '@flowjs/ngx-flow';
import { WidgetInfo } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-constructor-design',
  templateUrl: './constructor-design.component.html',
  styleUrls: ['./constructor-design.component.scss']
})
export class ConstructorDesignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flow') public flow: FlowDirective;
  @Input() public sid: string;
  @Input() public wid: string;
  @Input() public widget: WidgetInfo;
  @Input() public isDesigner: boolean;
  @Input() public isMockup: boolean;
  @Input() public isContainerized: boolean;

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
    l.start();
    for (var i = 0; i < $scope.validators.length; i++) {
      errorsList = errorsList.concat($scope.validators[i].call(this));
    }

    if (errorsList.length != 0) {
      toastr["error"]($scope.localization.save.validation.desc, $scope.localization.save.validation.title);
      l.stop();
    } else {
      $scope.savedInstance = {
        name: $scope.widget.name,
        guiprops:  $scope.widget.guiprops,
        autoinvite:  $scope.widget.autoinvite,
        restrictions:  $scope.widget.restrictions,
        autoresponder:  $scope.widget.autoresponder,
        rules:  $scope.widget.rules
      };
      $http({
        method: 'PUT',
        url: "/api/v1/mockups/"+$scope.wid,
        data: angular.toJson($scope.savedInstance),
        headers: {'Content-Type': 'application/json; charset=utf-8'}
      })
        .success(function(response) {
          if (response.rows.length > 0 && response.rows[0].code == 200) {
            toastr["success"]($scope.localization.save.done.desc, $scope.localization.save.done.title);
            setTimeout(function(){
              l.stop();
            },1000);
          }
        }).error(function() {
        toastr["error"]($scope.localization.save.error.desc, $scope.localization.save.error.title);
        l.stop();
        swal($scope.localization.save.error.title, $scope.localization.save.error.desc, "error");
      });
    }
  }

  private saveWidgetItem() {
    var currentDate = new Date();
    $scope.widget.guiprops.dhVisual.lastModifiedDate = currentDate;
    $scope.widget.guiprops.dhVisual.widget_width_all   = $scope.SP_widget.widget_width_all;
    $scope.widget.guiprops.dhVisual.widget_height_all  = $scope.SP_widget.widget_height_all;
    $scope.widget.guiprops.dhVisual.widget_width_nopx  = $scope.SP_widget.widget_width_nopx;
    $scope.widget.guiprops.dhVisual.widget_height_nopx = $scope.SP_widget.widget_height_nopx;
    $scope.widget.guiprops.dhVisual.widget_ul_width_nopx = $scope.SP_widget.widget_ul_width_nopx;
    $scope.widget.guiprops.dhVisual.CP_width = $scope.SP_widget.widget_CP_width;
    $scope.widget.guiprops.dhVisual.CP_offset_top = $scope.SP_widget.widget_CP_offset_top;
    $scope.widget.guiprops.image.width = $scope.SP_widget.img_width;
    $scope.widget.guiprops.image.height = $scope.SP_widget.img_height;

    console.log("TWO ", $scope.widget.guiprops.dhVisual.widget_width_all);
    addCouponsId();
    mapFormExtFieldId();
    var errorsList = runValidators();
    l.start();
    for (var i = 0; i < $scope.validators.length; i++) {
      errorsList = errorsList.concat($scope.validators[i].call(this));
    }

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

