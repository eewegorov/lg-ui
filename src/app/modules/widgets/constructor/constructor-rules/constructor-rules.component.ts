import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
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
    this.widgetService.addOnWidgetLoadListener(this.loadListener);
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
    const errors = [];
    const TAB_ID = 'rules';

    if (typeof this.widget.rules === 'undefined') {
      return;
    }
    if (this.widget.rules.pages.enable) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.widget.rules.pages.items.length; i++) {
        if (this.widget.rules.pages.items[i].value.trim().length === 0) {
          errors.push({id: TAB_ID, message: 'Empty page target'});
        }
      }
    }

    if (this.widget.rules.prevPages.enable) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.widget.rules.prevPages.items.length; i++) {
        if (this.widget.rules.prevPages.items[i].value.trim().length === 0) {
          errors.push({id: TAB_ID, message: 'Empty previous page target'});
        }
      }
    }

    if (this.widget.rules.pageNo.enable) {
      if (this.widget.rules.pageNo.items.length === 0) {
        errors.push({id: TAB_ID, message: 'Empty pageno'});
      }
    }

    if (this.widget.rules.days.enable) {
      if (this.widget.rules.days.items.length === 0) {
        errors.push({id: TAB_ID, message: 'Empty days list'});
      }
    }

    if (this.widget.rules.period.enable) {
      if (this.widget.rules.period.startDate == null || this.widget.rules.period.endDate == null) {
        errors.push({id: TAB_ID, message: 'Infinity period range'});
      }
    }

    if (this.widget.autoinvite.pages.enable) {
      if (this.widget.autoinvite.pages.value <= 0) {
        errors.push({id: TAB_ID, message: 'Autoinvite. Pages. Pages less or equal the 0'});
      }
    }

    if (this.widget.autoinvite.seconds.enable) {
      if (this.widget.autoinvite.seconds.value <= 0) {
        errors.push({id: TAB_ID, message: 'Autoinvite. Seconds. Seconds less or equal the 0'});
      }
    }

    if (this.widget.autoinvite.inactive.enable) {
      if (this.widget.autoinvite.inactive.value <= 0) {
        errors.push({id: TAB_ID, message: 'Autoinvite. Inactive. Seconds less or equal the 0'});
      }
    }

    if (this.widget.autoinvite.percent.enable) {
      if (this.widget.autoinvite.percent.value <= 0 || this.widget.autoinvite.percent.value > 100) {
        errors.push({id: TAB_ID, message: 'Autoinvite. Percent. Value less or equal the 0 or great then 100'});
      }
    }

    if (this.widget.autoinvite.click.enable) {
      if (this.widget.autoinvite.click.value.trim().length === 0) {
        errors.push({id: TAB_ID, message: 'Autoinvite. Click. Empty selector'});
      }
    }


    return errors;
  }

  private loadListener() {
    if (typeof this.widget.rules === 'undefined') {
      this.widget.rules = {};
    }

    if (typeof this.widget.rules.pages === 'undefined') {
      this.widget.rules.pages = {
        enable: false,
        items: [{
          state: 0,
          compare: 0,
          type: 0,
          value: ''
        }]
      };
    }

    if (typeof this.widget.rules.prevPages === 'undefined') {
      this.widget.rules.prevPages = {
        enable: false,
        items: [{
          compare: 0,
          type: 0,
          value: ''
        }]
      };
    }

    if (!this.widget.rules.prevPages.items.length) {
      this.widget.rules.prevPages.items.push({
        compare: 0,
        type: 0,
        value: ''
      });
    }

    if (this.widget.rules.pageNo === 'undefined') {
      this.widget.rules.pageNo = {
        enable: false,
        items: []
      };
    }

    if (typeof this.widget.rules.time === 'undefined') {
      this.widget.rules.time = {
        enable: false,
        items: [{
          startTime: 0,
          endTime: this.ONE_HOUR * 24 - this.ONE_MINUTE
        }]
      };
    }

    if (typeof  this.widget.rules.days === 'undefined') {
      this.widget.rules.days = {
        enable: false,
        items: []
      };
    }

    if (typeof this.widget.rules.period === 'undefined') {
      this.widget.rules.period = {
        enable: false,
        startDate: (new Date() as any).format('dd.mm.yyyy'),
        endDate: (new Date() as any).format('dd.mm.yyyy')
      };
    }

    if (this.widget.rules.period.startDate == null || this.widget.rules.period.startDate === '01.01.2000') {
      this.widget.rules.period.startDate = (new Date() as any).format('dd.mm.yyyy');
    }

    if (this.widget.rules.period.endDate == null || this.widget.rules.period.endDate === '01.01.3000') {
      this.widget.rules.period.endDate = (new Date() as any).format('dd.mm.yyyy');
    }

    if (typeof this.widget.autoinvite === 'undefined') {
      this.widget.autoinvite = {};
    }

    if (typeof this.widget.autoinvite.pages === 'undefined') {
      this.widget.autoinvite.pages = {
        enable: false,
        value: 1
      };
    }

    if (typeof this.widget.autoinvite.seconds === 'undefined') {
      this.widget.autoinvite.seconds = {
        enabled: false,
        value: 1
      };
    }

    if (typeof this.widget.autoinvite.inactive === 'undefined') {
      this.widget.autoinvite.inactive = {
        enabled: false,
        value: 1
      };
    }

    if (typeof this.widget.autoinvite.percent === 'undefined') {
      this.widget.autoinvite.percent = {
        enable: false,
        value: 1
      };
    }

    if (typeof this.widget.autoinvite.click === 'undefined') {
      this.widget.autoinvite.click = {
        enable: false,
        value: ''
      };
    }

    if (typeof this.widget.autoinvite.exit === 'undefined') {
      this.widget.autoinvite.exit = {
        enabled: false
      };
    }

    if (typeof this.widget.autoinvite.sound === 'undefined') {
      this.widget.autoinvite.sound = {
        enabled: false
      };
    }

    if (typeof this.widget.autoinvite.ruleLogic === 'undefined') {
      this.widget.autoinvite.ruleLogic = this.autoinviteVariants[0];
    }

    if (typeof this.widget.autoresponder === 'undefined') {
      this.widget.autoresponder = {
        enabled: false,
        subject: '',
        text: ''
      };
    }

    if (typeof this.widget.restrictions === 'undefined') {
      this.widget.restrictions = {
        target: {
          mode: 1,
          gap: 48
        }
      };
    }

    if (typeof this.widget.restrictions.count === 'undefined') {
      this.widget.restrictions.count = {
        enable: false,
        count: 1,
        unit: 'SEC',
        interval: 1
      };
    }

    if (typeof this.widget.restrictions.action === 'undefined') {
      this.widget.restrictions.action = {
        enable: false,
        gap: 24
      };
    }

    if (typeof this.widget.jsInfo === 'undefined') {
      this.widget.jsInfo = {
        onShowScript: {
          enable: false,
          script: null
        },
        onTargetScript: {
          enable: false,
          script: null
        },
        enablePlaceholding: false
      };
    }

    this.prepareControls();
  }

  private prepareControls() {
    ($('#period-rule-start-date-picker') as any).datetimepicker({
      format: 		'DD.MM.YYYY',
      locale        : 'ru',
      showClose     : false,
      defaultDate   : moment(this.widget.rules.period.startDate, 'DD.MM.YYYY')
    }).on('dp.change', () => {
      this.widget.rules.period.startDate = $('#period-rule-start-date-picker').data('DateTimePicker').date().format('DD.MM.YYYY');
    });

    ($('#period-rule-end-date-picker') as any).datetimepicker({
      format: 		'DD.MM.YYYY',
      locale        : 'ru',
      showClose     : false,
      defaultDate   : moment(this.widget.rules.period.endDate, 'DD.MM.YYYY')
    }).on('dp.change', () => {
      this.widget.rules.period.endDate = $('#period-rule-end-date-picker').data('DateTimePicker').date().format('DD.MM.YYYY');
    });
  }

}
