import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-title',
  templateUrl: './extended-title.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-title.component.scss']
})
export class ExtendedTitleComponent implements OnInit, AfterViewInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;
  @Input() public isTerm: boolean;

  public availItemTypes = [];
  public availWidthTypes = [];

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
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

  constructor(private widgetConstructorService: WidgetConstructorService) {
  }

  ngAfterViewInit(): void {
    this.initPicker();
  }

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker-ext-form' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.target.value, this.item.font);
      });

      $('#font-picker-ext-form' + this.index).trigger('setFont', this.item.font.name);
    }, 500);
  }

  private setNewFont(value, data) {
    let font = value.replace(/\+/g, ' ');

    // Split font into family and weight
    font = font.split(':');
    const fontFamily = font[0];

    data.name = fontFamily;
    data.fontFamily = '\'' + fontFamily + '\'';
  }

}
