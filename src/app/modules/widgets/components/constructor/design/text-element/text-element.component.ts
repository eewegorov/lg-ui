import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '@core/models/widgets';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['../../../../shared/shared.scss', './text-element.component.scss']
})
export class TextElementComponent implements OnInit, AfterViewInit {
  @Input() public index: number;
  @Input() public item: any;
  @Input() public widget: FullWidget;

  public optionsOpacity: Options = {
    floor: 0.0,
    ceil: 1.0,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };

  public optionsSharpness: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

  constructor(private widgetConstructorService: WidgetConstructorService) {}

  ngAfterViewInit(): void {
    this.initPicker();
  }

  ngOnInit(): void {}

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker' + this.index) as any)
        .fontselect({
          lazyLoad: false,
          placeholder: 'Выберите шрифт',
          placeholderSearch: 'Поиск...',
          systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
          googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
        })
        .on('change', change => {
          this.setNewFont(change.target.value, this.item.font);
        });

      $('#font-picker' + this.index).trigger('setFont', this.item.font.name);
    }, 500);
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
