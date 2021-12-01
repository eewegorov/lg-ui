import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-extended-datepicker',
  templateUrl: './extended-datepicker.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-datepicker.component.scss']
})
export class ExtendedDatepickerComponent implements OnInit {
  @Input() public item: Record<string, any>;
  @Input() public st: Record<string, any>;

  public isFilled = false;

  public options: object = {
    widgetParent: '.max-h-100',
    locale: moment.locale('ru'),
    showClose: false
  };

  constructor() { }

  ngOnInit(): void {
    this.options = {
      ...this.options,
      format: this.item.dateType.value
    };
  }

  public change(): void {
    this.isFilled = true;
  }

}
