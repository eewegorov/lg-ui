import { AfterViewInit, Component, DoCheck, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-extended-term',
  templateUrl: './extended-term.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-term.component.scss']
})
export class ExtendedTermComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  public availItemTypes = [];
  public availWidthTypes = [];

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1,
    animate: false,
    showSelectionBar: true
  };

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngAfterViewInit(): void {
    this.initPicker();
  }

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
  }

  ngDoCheck(): void {
    if (this.item.font.name) {
      $('#font-picker-ext-form' + this.index).trigger('setFont', this.item.font.name);
    }
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
        this.setNewFont(change.target.value, this.item.font.name);
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
