import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Coupon } from '../../../../../core/models/coupons';
import { CouponService } from '../../../../coupons/services/coupon.service';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';

@Component({
  selector: 'app-coupon-element',
  templateUrl: './coupon-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './coupon-element.component.scss']
})
export class CouponElementComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() public index: number;
  @Input() public coupons: Coupon[];
  @Input() public item: Record<string, any>;
  @Input() public widthBtn: string[];
  @Input() public floatBtn: string[];

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    animate: false,
    showSelectionBar: true
  };

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

  constructor(
    private couponService: CouponService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngAfterViewInit(): void {
    this.refreshCouponsList();
    this.initPicker();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item && (changes.item.currentValue !== changes.item.previousValue)) {
      $('#font-picker' + this.index).trigger('setFont', this.item.font.name);
      $('#font-picker-title' + this.index).trigger('setFont', this.item.title.font.name);
    }
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
        this.setNewFont(change.target.value, this.item.font);
      });

      ($('#font-picker-title' + this.index) as any).fontselect({
        placeholder: 'Выберите шрифт',
        placeholderSearch: 'Поиск...',
        systemFonts: this.widgetConstructorService.getSystemFontListPicker(),
        googleFonts: this.widgetConstructorService.getGoogleFontListPicker()
      }).on('change', (change) => {
        this.setNewFont(change.target.value, this.item.title.font);
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
