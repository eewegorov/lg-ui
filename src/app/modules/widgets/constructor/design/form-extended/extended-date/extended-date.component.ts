import { Component, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-date',
  templateUrl: './extended-date.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-date.component.scss']
})
export class ExtendedDateComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  public availItemTypes = [];
  public availWidthTypes = [];
  public availItemDateTypes = [];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
    this.availItemDateTypes = this.widgetConstructorService.getExtFormDateTypes();
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

  public idFocusOut() {
    this.widgetConstructorService.formExtIdFieldFocusOut.next();
  }

}
