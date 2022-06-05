import { Component, Input, OnInit } from "@angular/core";
import { FullWidget } from "@core/models/widgets";
import { ContainerizedWidgetService } from "@modules/widgets/services/containerized-widget.service";
import { WidgetService } from "@modules/widgets/services/widget.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-constructor-header',
  templateUrl: './constructor-header.component.html',
  styleUrls: ['./constructor-header.component.scss']
})
export class ConstructorHeaderComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public isLoading = false;
  @Input() public isContainerized: boolean;
  @Input() private sid: string;

  public renamedWidget = { id: '', name: '' };

  constructor(
    private router: Router,
    private translate: TranslateService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) { }

  ngOnInit(): void {
    this.checkWidgetRenameTitle();
  }

  public goToTest(widget) {
    this.router.navigate([`/abtests/active`], { queryParams: { testIdNum: widget.abtestInfo.id } }).then();
  }

  /*public saveAsMockup() {
    let errorsList = this.runValidators();
    this.widgetService.validators.forEach(validator => {
      errorsList = errorsList.concat(validator.call(this));
    });

    if (errorsList.length !== 0) {
      this.toastr.error(this.translate.instant('widgetsList.editor.save.validation.desc'), this.translate.instant('widgetsList.editor.save.validation.title'));
    } else {
      ($('#saveAsMockupModal') as any).modal('show');
    }
  }*/

  public saveWidget() {
    this.showErrors = true;

    /*if (this.isMockup) {
      this.saveMockupItem();
    } else {
      this.saveWidgetItem();
    }*/

    this.saveWidgetItem();
  }

  public switchWidget(widget, newValue) {
    $('[role="tooltip"]').remove();
    if (widget.active === newValue) {
      return false;
    }
    if (this.isContainerized) {
      this.containerizedWidgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) {
          return false;
        }
        this.widget.active = newValue;
      });
    } else {
      this.widgetService.switch(this.sid, widget.id, newValue).subscribe((response: boolean) => {
        if (!response) {
          return false;
        }
        this.widget.active = newValue;
      });
    }
  }

  public closeWidget(): void {
    const difference = this.difference(this.oldWidget, this.widget);
    delete difference.sendCrm;

    if (isEmpty(difference)) {
      this.router.navigate(['/widgets/']);
    } else {
      const exitConfirm = window.confirm(this.translate.instant('widgetsList.widget.error'));

      if (exitConfirm) {
        this.router.navigate(['/widgets/']);
      }
    }
  }

  public startRenameWidget(widget) {
    ($('#renameWidgetBtn span') as any).tooltip('hide');
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');

    this.renamedWidget = {
      id: widget.id,
      name: widget.name
    };

    setTimeout(() => {
      $('.widget-rename-control').trigger('focus');
    }, 0);
  }

  public resetRenaming() {
    this.renamedWidget = {
      id: '',
      name: ''
    };
  }

  public checkKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.renameWidget();
    }
  }

  public renameWidget() {
    setTimeout(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
    }, 0);

    this.widget.name = this.renamedWidget.name;
    this.resetRenaming();
    this.checkWidgetRenameTitle();
    if (this.widget.containerId) {
      this.containerizedWidgetService.rename(this.sid, this.widget.id, this.widget.name).subscribe();
    } else {
      this.widgetService.rename(this.sid, this.widget.id, this.widget.name).subscribe();
    }
  }

  private checkWidgetRenameTitle() {
    ($('#renameWidgetBtn') as any).tooltip('destroy');
    if (this.widget?.name?.length > 35) {
      ($('#renameWidgetBtn') as any).attr('title', this.widget.name);
      ($('#renameWidgetBtn') as any).tooltip({ trigger: 'hover' });
    }
  }

  private difference(object: FullWidget, base: FullWidget): Partial<FullWidget> {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    function changes(object, base) {
      return transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
          result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
        }
      });
    }

    return changes(object, base);
  }

}
