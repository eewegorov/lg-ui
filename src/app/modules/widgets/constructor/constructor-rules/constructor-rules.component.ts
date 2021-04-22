import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FullWidget } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { WidgetConstructorService } from '../../services/widget-constructor.service';

@Component({
  selector: 'app-constructor-rules',
  templateUrl: './constructor-rules.component.html',
  styleUrls: ['./constructor-rules.component.scss']
})
export class ConstructorRulesComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public isContainerized: boolean;

  @Output() private addValidator = new EventEmitter<() => void>();

  public weekDays = [];
  public loop = Array.from({length: 20}, (_, i) => i + 1);
  public autoinviteVariants = ['при соблюдении ВСЕХ активированных правил', 'при соблюдении ЛЮБОГО ИЗ активированных правил'];
  public restrictionsGaps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 20, 24, 36, 48, 72];
  public units = {
    SEC: this.translate.instant('global.unit.seconds'),
    MIN: this.translate.instant('global.unit.minutes'),
    HOU: this.translate.instant('global.unit.hours'),
    DAY: this.translate.instant('global.unit.days')
  };

  private ONE_MINUTE = 1000 * 60;
  private ONE_HOUR   = this.ONE_MINUTE * 60;

  constructor(
    private translate: TranslateService,
    private widgetService: WidgetService,
    private widgetConstructorService: WidgetConstructorService
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
  }

  ngOnInit(): void {
    this.widgetService.addValidator(this.validator);
    this.widgetService.addOnWidgetLoadListener(loadListener);
  }

  public getPageStateName(item) {
    if (item.state === 0) {
      return this.translate.instant('widgetsList.editor.rules.pageTargeting.hide');
    } else {
      return this.translate.instant('widgetsList.editor.rules.pageTargeting.show');
    }
  }

  public getPageCompareName(item) {
    switch (item.compare) {
      case 0:
        return this.translate.instant('widgetsList.editor.rules.pageTargeting.contain');
      case 1:
        return this.translate.instant('widgetsList.editor.rules.pageTargeting.notcontain');
      case 2:
        return this.translate.instant('widgetsList.editor.rules.pageTargeting.equals');
      case 3:
        return this.translate.instant('widgetsList.editor.rules.pageTargeting.starts');
      case 4:
        return this.translate.instant('widgetsList.editor.rules.pageTargeting.ends');
      default:
        return 'error';
    }
  }

  public getPageTypeName(item) {
    if (item.type === 0) {
      return this.translate.instant('widgetsList.editor.rules.pageTargeting.url');
    } else {
      return this.translate.instant('widgetsList.editor.rules.pageTargeting.title');
    }
  }

  public addPageRuleItem() {
    this.widget.rules.pages.items.push({
      state: 0,
      compare: 0,
      value: '',
      type: 0
    });
  }

  public removePageRuleItem(index) {
    this.widget.rules.pages.items = this.widgetConstructorService.removeFromArray(this.widget.rules.pages.items, index);
  }

  public addPrevPageRuleItem() {
    this.widget.rules.prevPages.items.push({
      compare: 0,
      value: '',
      type: 0
    });
  }

  public removePrevPageRuleItem(index) {
    this.widget.rules.prevPages.items = this.widgetConstructorService.removeFromArray(this.widget.rules.prevPages.items, index);
  }

  public onRestrictionModeChange() {
    this.onChangePayment((this.widget.restrictions.target.mode !== 1));
  }

  public onChangePayment(enabled) {
    this.widgetService.onChangePayment.next(enabled);
  }

  public getStringFromTime(val) {
    const hours = parseInt(String(val / this.ONE_HOUR), 10);
    const minutes = (val - this.ONE_HOUR * hours) / this.ONE_MINUTE;
    return '' + ((hours < 10) ? '0' : '') + hours + ':' + ((minutes < 10) ? '0' : '') + minutes;
  }

  public getTimeList() {
    const timeList = [];
    const TIMER_THRESHOLD = this.ONE_MINUTE * 30;

    for (let  i = 0; i < this.ONE_HOUR * 24; i += TIMER_THRESHOLD) {
      timeList.push({
        name: this.getStringFromTime(i),
        value: i
      });
    }

    return timeList;
  }

  public addTimeRuleItem() {
    this.widget.rules.time.items.push({
      startTime: 0,
      endTime: this.ONE_HOUR * 24 - this.ONE_MINUTE
    });
  }

  public removeTimeRuleItem(index) {
    this.widget.rules.time.items = this.widgetConstructorService.removeFromArray(this.widget.rules.time.items, index);
  }

  public getUnitsKeys() {
    return Object.keys(this.units);
  }

  private validator() {
    var errors = [];
    if (typeof $scope.widget.rules === "undefined") {
      return;
    }
    if ($scope.widget.rules['pages'].enable) {
      for (var i = 0; i < $scope.widget.rules['pages'].items.length; i++) {
        if ($scope.widget.rules['pages'].items[i].value.trim().length == 0) {
          errors.push({id:TAB_ID, message:"Empty page target"});
        }
      }
    }

    if ($scope.widget.rules['prevPages'].enable) {
      for (var i = 0; i < $scope.widget.rules['prevPages'].items.length; i++) {
        if ($scope.widget.rules['prevPages'].items[i].value.trim().length == 0) {
          errors.push({id:TAB_ID, message:"Empty previous page target"});
        }
      }
    }

    if ($scope.widget.rules['pageNo'].enable) {
      if ($scope.widget.rules['pageNo'].items.length == 0) {
        errors.push({id:TAB_ID, message:"Empty pageno"});
      }
    }

    if ($scope.widget.rules['days'].enable) {
      if ($scope.widget.rules['days'].items.length == 0) {
        errors.push({id:TAB_ID, message:"Empty days list"});
      }
    }

    if ($scope.widget.rules['period'].enable) {
      if ($scope.widget.rules.period.startDate == null || $scope.widget.rules.period.endDate == null) {
        errors.push({id:TAB_ID, message:"Infinity period range"});
      }
    }

    if ($scope.widget.autoinvite['pages'].enable) {
      if ($scope.widget.autoinvite['pages'].value <= 0) {
        errors.push({id:TAB_ID, message:"Autoinvite. Pages. Pages less or equal the 0"});
      }
    }

    if ($scope.widget.autoinvite['seconds'].enable) {
      if ($scope.widget.autoinvite['seconds'].value <= 0) {
        errors.push({id:TAB_ID, message:"Autoinvite. Seconds. Seconds less or equal the 0"});
      }
    }

    if ($scope.widget.autoinvite['inactive'].enable) {
      if ($scope.widget.autoinvite['inactive'].value <= 0) {
        errors.push({id:TAB_ID, message:"Autoinvite. Inactive. Seconds less or equal the 0"});
      }
    }

    if ($scope.widget.autoinvite['percent'].enable) {
      if ($scope.widget.autoinvite['percent'].value <= 0 || $scope.widget.autoinvite['percent'].value > 100) {
        errors.push({id:TAB_ID, message:"Autoinvite. Percent. Value less or equal the 0 or great then 100"});
      }
    }

    if ($scope.widget.autoinvite['click'].enable) {
      if ($scope.widget.autoinvite['click'].value.trim().length == 0) {
        errors.push({id:TAB_ID, message:"Autoinvite. Click. Empty selector"});
      }
    }


    return errors;
  }

}
