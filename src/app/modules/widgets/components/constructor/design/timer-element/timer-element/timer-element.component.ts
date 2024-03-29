import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { TranslateService } from '@ngx-translate/core';
import { FullWidget } from '@core/models/widgets';
import { WidgetConstructorService } from '../../../../../services/widget-constructor.service';

@Component({
  selector: 'app-timer-element',
  templateUrl: './timer-element.component.html',
  styleUrls: ['../../../../../shared/shared.scss', './timer-element.component.scss']
})
export class TimerElementComponent implements OnInit, OnChanges {
  @Input() public index: number;
  @Input() public item: any;
  @Input() public widget: FullWidget;
  @Input() public showErrors: boolean;

  public alignValues = [];
  public timerTypes = [];
  public expTypes = [];

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

  public optionsOpacity: Options = {
    floor: 0.0,
    ceil: 1.0,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };

  constructor(private translate: TranslateService, private widgetConstructorService: WidgetConstructorService) {}

  ngOnInit(): void {
    this.alignValues = this.widgetConstructorService.getTimerAlignTypes();
    this.timerTypes = this.widgetConstructorService.getTimerCountdownTypes();
    this.expTypes = this.widgetConstructorService.getTimerExpTypes();

    setTimeout(() => {
      this.initPicker('number', 'font');

      setTimeout(() => {
        this.initPicker('label', 'fontLabel');
      }, 50);
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      if (changes.item.currentValue?.design.font.name !== changes.item.previousValue?.design.font.name) {
        $('#font-picker-number-timer' + this.index).trigger('setFont', changes.item.currentValue.design.font.name);
      }

      if (changes.item.currentValue?.design.fontLabel.name !== changes.item.previousValue?.design.fontLabel.name) {
        $('#font-picker-label-timer' + this.index).trigger('setFont', changes.item.currentValue.design.fontLabel.name);
      }
    }
  }

  public setNullData(key) {
    this.item.design.nullData[key] = Boolean(this.item.design.nullData[key]);
  }

  private initPicker(idKey, modelKey) {
    const selector = $('#font-picker-' + idKey + '-timer' + this.index);
    const fontselect = (selector as any).fontselect({
      placeholder: this.translate.instant('widgets.timerDirective.design.font.choose'),
      placeholderSearch: this.translate.instant('sitelist.table.filter.search') + '...',
      systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
      googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
    });

    fontselect.on('change', change => {
      this.setNewFont(change.target.value, this.item.design[modelKey]);
    });

    selector.trigger('setFont', this.item.design[modelKey].name);
  }

  private setNewFont(value, data) {
    let font = value.replace(/\+/g, ' ');

    // Split font into family and weight
    font = font.split(':');
    const fontFamily = font[0];

    data.name = fontFamily;
    data.fontFamily = "'" + fontFamily + "'";
  }
}
