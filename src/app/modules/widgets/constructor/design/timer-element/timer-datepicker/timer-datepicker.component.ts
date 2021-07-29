import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer-datepicker',
  templateUrl: './timer-datepicker.component.html',
  styleUrls: ['./timer-datepicker.component.scss']
})
export class TimerDatepickerComponent implements OnInit {
  @Input() public item: any;

  constructor() { }

  ngOnInit(): void {
    ($ as any).datetimepicker.setLocale('ru');
    setTimeout(() => {
      this.enableDatePicker($('body').find('.timer-datepicker-block'));
    }, 500);
  }

  private enableDatePicker(jqItem) {
    jqItem.datetimepicker({
      value: this.item.date,
      useCurrent: true,
      allowInputToggle: true,
      format: 'D MMMM YYYY HH:mm',
      locale: 'ru',
      lang: 'ru',
      minDate: new Date(),
      maxDate: this.addDays(new Date(), 99),
      widgetPositioning: {vertical: 'bottom'},
      onSelectDate: e => {
        this.item.date = e.date._d;
      }
    });
  }

  private addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

}
