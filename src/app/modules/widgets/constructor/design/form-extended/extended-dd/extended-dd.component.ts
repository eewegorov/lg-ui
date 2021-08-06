import { Component, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-dd',
  templateUrl: './extended-dd.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-dd.component.scss']
})
export class ExtendedDdComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  public availItemTypes = [];
  public availWidthTypes = [];
  public unmappedVariants = [];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
    this.unmappedVariants = this.mappedCoupons(this.item.variants);
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

}
