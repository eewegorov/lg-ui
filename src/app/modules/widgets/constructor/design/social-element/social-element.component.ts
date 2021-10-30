import { Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';
import { WidgetConstructorService } from '../../../services/widget-constructor.service';
import { Coupon } from '../../../../../core/models/coupons';

@Component({
  selector: 'app-social-element',
  templateUrl: './social-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './social-element.component.scss']
})
export class SocialElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public coupons: Coupon[];
  @Input() public placePopup: string[];
  @Input() public floatBtn: string[];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
  }

  public setSocialBtn(element, item) {
    if (!element) {
      for (let i = 0; i < this.widget.guiprops.social.items.length; i++) {
        if (this.widget.guiprops.social.items[i].name === item) {
          this.widget.guiprops.social.items = this.widgetConstructorService.removeFromArray(this.widget.guiprops.social.items, i);
        }
      }
    } else {
      this.widget.guiprops.social.items.push({
        name: element
      });
    }
  }

}
