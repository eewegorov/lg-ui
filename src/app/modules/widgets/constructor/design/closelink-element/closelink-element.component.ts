import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Coupon } from '../../../../../core/models/coupons';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-closelink-element',
  templateUrl: './closelink-element.component.html',
  styleUrls: ['./closelink-element.component.scss']
})
export class CloselinkElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public placePopup: string[];
  @Input() public widthBtn: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<number>();
  @Output() private setBtn = new EventEmitter<{type: string, item: Record<string, string | number>}>();

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.initPicker();
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public setBtnStyle(type: string, item: Record<string, string | number>): void {
    this.setBtn.emit({type, item});
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.widget.guiprops.exit.font);
      });

      ($('#font-picker-button-l' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.widget.guiprops.exit.button.font);
      });

      $('#font-picker' + this.index).trigger('setFont', this.widget.guiprops.exit.font.name);
      $('#font-picker-button-l' + this.index).trigger('setFont', this.widget.guiprops.exit.button.font.name);
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
