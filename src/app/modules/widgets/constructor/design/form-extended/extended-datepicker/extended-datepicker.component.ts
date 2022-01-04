import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-datepicker',
  templateUrl: './extended-datepicker.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-datepicker.component.scss']
})
export class ExtendedDatepickerComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() public dateType: string;
  @Input() public placeholder: string;
  @Input() public index: number;
  @Input() public st: Record<string, any>;

  public isFilled = false;

  public options: object = {
    useCurrent: true,
    format: 'DD.MM.YYYY',
    locale: 'ru',
    widgetPositioning: { vertical: 'bottom' },
    widgetParent: 'body'
  };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $('#datetimepicker' + this.index).on('click', (event) => {
      $('.bootstrap-datetimepicker-widget').css({
        top: $('#datetimepicker' + this.index).offset().top + 50,
        left: $('#datetimepicker' + this.index).offset().left
      });
    });
  }

  ngOnChanges(): void {
    this.options = {
      ...this.options,
      format: this.dateType
    };
  }

  public change($event): void {
    if ($event) {
      this.isFilled = true;
    }
  }

}
