import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-coupon-element',
  templateUrl: './coupon-element.component.html',
  styleUrls: ['./coupon-element.component.scss']
})
export class CouponElementComponent implements OnInit {
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

}
