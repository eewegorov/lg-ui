import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  @Input() public coupon;

  constructor() { }

  ngOnInit(): void {
  }

}
