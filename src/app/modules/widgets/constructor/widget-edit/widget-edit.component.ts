import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WidgetInfo } from '../../../../core/models/widgets';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit {
  public weekDays = [];
  public renamedWidget = { id: '', name: '' };
  public widget: WidgetInfo;
  public isMockup = false;

  private readonly sid: string;
  private currentActiveTab = 'design';
  private validators = [];
  private formExtIdsErrorFlag = false;
  private formExtNeedButton = false;
  private formExtRedirectFieldEmpty = false;

  constructor(
    private translate: TranslateService,
    private containerizedWidgetService: ContainerizedWidgetService,
    private widgetService: WidgetService
  ) {
    this.weekDays = [
      { id: 0, name: this.translate.instant('global.week.monday') },
      { id: 1, name: this.translate.instant('global.week.tuesday') },
      { id: 2, name: this.translate.instant('global.week.wednesday') },
      { id: 3, name: this.translate.instant('global.week.thursday') },
      { id: 4, name: this.translate.instant('global.week.friday') },
      { id: 5, name: this.translate.instant('global.week.saturday') },
      { id: 6, name: this.translate.instant('global.week.sunday') }
    ];

    this.sid = $('input#sid').val() as string;

    this.isMockup = (($('#ismockup') as any).size() > 0);
  }

  ngOnInit(): void {
  }

  public startRenameWidget(widget) {
    this.renamedWidget = {
      id: widget.id,
      name: widget.name
    };
  }

  public getCroppedString(str: string, count: number, addedSymbol: string): string {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }
    return str;
  }

  public isCurrentActiveTab(tab) {
    return this.currentActiveTab === tab;
  }

  public setActiveTab(newTab) {
    this.currentActiveTab = newTab;
  }

  public isTabHasError(tabId) {
    const errors = this.runValidators();
    for (const item of errors) {
      if ((typeof item !== 'undefined') && item.id === tabId) {
        return true;
      }
    }

    return false;
  }

  public isTabHasErrorForFormExt() {
    return this.formExtIdsErrorFlag || this.formExtNeedButton || this.formExtRedirectFieldEmpty;
  }

  public resetRenaming() {
    this.renamedWidget = {
      id: '',
      name: ''
    };
  }

  public renameWidget() {
    this.widget.name = this.renamedWidget.name;
    this.resetRenaming();
    this.checkWidgetRenameTitle();
    if (this.widget.containerId) {
      this.containerizedWidgetService.rename(this.sid, this.widget.id, this.widget.name);
    } else {
      this.widgetService.rename(this.sid, this.widget.id, this.widget.name);
    }
  }

  private checkWidgetRenameTitle() {
    ($('#renameWidgetBtn') as any).tooltip('destroy');
    if (this.widget.name.length > 35) {
      ($('#renameWidgetBtn') as any).attr('title', this.widget.name);
      ($('#renameWidgetBtn') as any).tooltip();
    }
  }

  private runValidators() {
    let errorsList = [];
    this.validators.forEach(item => {
      errorsList = errorsList.concat(item.call(this));
    });

    return errorsList;
  }

}
