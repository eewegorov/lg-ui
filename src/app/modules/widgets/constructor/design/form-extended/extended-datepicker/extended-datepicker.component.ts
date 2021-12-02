import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-datepicker',
  templateUrl: './extended-datepicker.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-datepicker.component.scss']
})
export class ExtendedDatepickerComponent implements OnInit, OnChanges {
  @Input() public dateType: string;
  @Input() public placeholder: string;
  @Input() public st: Record<string, any>;

  public isFilled = false;

  public options: object = {
    useCurrent: true,
    format: 'DD.MM.YYYY',
    locale: 'ru',
    widgetPositioning: { vertical: 'bottom' },
    widgetParent: '.widget-visual-block'
  };

  constructor() { }

  ngOnInit(): void {
  }

  public change($event): void {
    if ($event) {
      this.isFilled = true;
    }
  }

  ngOnChanges(): void {
    this.options = {
      ...this.options,
      format: this.dateType
    };
  }

}
