import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnChanges {
  @Input() public coupon;
  public couponCodeToPaste: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.couponCodeToPaste = `[coupon_${this.coupon.code}]`;
  }

}
