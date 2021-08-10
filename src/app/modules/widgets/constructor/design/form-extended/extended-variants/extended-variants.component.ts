import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-variants',
  templateUrl: './extended-variants.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-variants.component.scss']
})
export class ExtendedVariantsComponent implements OnInit, DoCheck {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  public availItemTypes = [];
  public availWidthTypes = [];
  public unmappedVariants = [];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.initPicker();

    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
    this.unmappedVariants = this.mappedCoupons(this.item.variants);
  }

  ngDoCheck(): void {
    if (this.item.font.name) {
      $('#font-picker-ext-form' + this.index).trigger('setFont', this.item.font.name);
    }
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

  public unmappedValue() {
    this.item.variants = this.unmappedCoupons(this.unmappedVariants);
  }

  public idFocusOut() {
    this.widgetConstructorService.formExtIdFieldFocusOut.next();
  }

  private unmappedCoupons(list) {
    return list.split('\n');
  }

  private mappedCoupons(list) {
    return list.join('\n');
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker-ext-form' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.item.font.name);
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
