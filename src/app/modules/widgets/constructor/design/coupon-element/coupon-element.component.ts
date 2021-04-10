import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Coupon } from '../../../../../core/models/coupons';

@Component({
  selector: 'app-coupon-element',
  templateUrl: './coupon-element.component.html',
  styleUrls: ['./coupon-element.component.scss']
})
export class CouponElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public coupons: Coupon[];

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

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

}
