import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Coupon } from '../../../../../core/models/coupons';
import { CouponService } from '../../../../coupons/services/coupon.service';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-coupon-element',
  templateUrl: './coupon-element.component.html',
  styleUrls: ['./coupon-element.component.scss']
})
export class CouponElementComponent implements OnInit, OnChanges {
  @Input() public index: number;
  @Input() public coupons: Coupon[];
  @Input() public item: Record<string, any>;
  @Input() public widthBtn: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<number>();

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  constructor(
    private couponService: CouponService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngOnInit(): void {
    this.initPicker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item.currentValue !== changes.item.previousValue) {
      $('#font-picker' + this.index).trigger('setFont', this.item.currentValue.font.name);
      $('#font-picker-title' + this.index).trigger('setFont', this.item.currentValue.title.font.name);
    }
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public refreshCouponsList() {
    this.couponService.updateCouponsList.next();
  }

  private initPicker() {
    setTimeout(() => {
      ($('#font-picker' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.item.font);
      });

      ($('#font-picker-title' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.value, this.item.title.font);
      });

      $('#font-picker' + this.index).trigger('setFont', this.item.font.name);
      $('#font-picker-title' + this.index).trigger('setFont', this.item.title.font.name);
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
