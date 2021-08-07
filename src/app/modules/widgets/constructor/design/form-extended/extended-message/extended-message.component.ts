import { Component, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-message',
  templateUrl: './extended-message.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-message.component.scss']
})
export class ExtendedMessageComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  public availItemTypes = [];
  public availWidthTypes = [];

  constructor(private widgetConstructorService: WidgetConstructorService) { }

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.availWidthTypes = this.widgetConstructorService.getExtFormWidthTypes();
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

}
