import { Component, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-text',
  templateUrl: './extended-text.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-text.component.scss']
})
export class ExtendedTextComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;
  @Input() public idEditable: boolean;
  @Input() public hasPhoneBlock: boolean;

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

  public idFocusOut() {
    this.widgetConstructorService.formExtIdFieldFocusOut.next();
  }

  public blockedUnusedChars() {
    const value = this.item.mask.value;
    const re = /[\\\/\|\[\]\{\}\.,`~@#$%^&?!;_="<>:'a-zA-Zа-яА-Я]/g;

    this.item.mask.value = value.replace(re, '');
  }

}
