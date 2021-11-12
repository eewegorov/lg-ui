import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-timer-datepicker',
  templateUrl: './timer-datepicker.component.html',
  styleUrls: ['./timer-datepicker.component.scss']
})
export class TimerDatepickerComponent implements OnInit {
  @Input() public item: any;

  public options: object = {
    useCurrent: true,
    format: 'D MMMM YYYY HH:mm',
    locale: 'ru',
    minDate: new Date(),
    maxDate: this.addDays(new Date(), 99),
    widgetPositioning: {vertical: 'bottom'}
  };

  public value: any;

  constructor() { }

  ngOnInit(): void {
    ($.fn as any).datetimepicker.Constructor.Default = $.extend({}, ($.fn as any).datetimepicker.Constructor.Default, {
      icons: {
        time: 'fa fa-clock',
        date: 'fa fa-calendar',
        up: 'fa fa-arrow-up',
        down: 'fa fa-arrow-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-calendar-check-o',
        clear: 'fa fa-trash',
        close: 'fa fa-times'
      }
    });

    this.value = this.item.date;

    this.options = {
      ...this.options,
      date: this.value,
      allowInputToggle: true
    };
  }

  public update() {
    this.item.date = this.value._d;
  }

  private addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

}
