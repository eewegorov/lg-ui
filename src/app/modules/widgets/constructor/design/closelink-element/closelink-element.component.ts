import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Coupon } from '../../../../../core/models/coupons';
import { FullWidget } from '../../../../../core/models/widgets';

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

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public setBtnStyle(type: string, item: Record<string, string | number>): void {
    this.setBtn.emit({type, item});
  }

}
