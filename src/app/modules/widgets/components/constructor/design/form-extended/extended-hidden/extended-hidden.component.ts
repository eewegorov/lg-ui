import { Component, Input, OnInit } from '@angular/core';
import { WidgetConstructorService } from '../../../../../services/widget-constructor.service';

@Component({
  selector: 'app-extended-hidden',
  templateUrl: './extended-hidden.component.html',
  styleUrls: ['../../../../../shared/shared.scss', './extended-hidden.component.scss']
})
export class ExtendedHiddenComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;
  @Input() public showErrors: boolean;

  public availItemTypes = [];
  public fieldTypes = [];

  constructor(private widgetConstructorService: WidgetConstructorService) {}

  ngOnInit(): void {
    this.widgetConstructorService.changeArrayOfFormExtTypes.subscribe(() => {
      this.availItemTypes = this.widgetConstructorService.getAvailableTypes();
    });
    this.fieldTypes = this.widgetConstructorService.getExtFormHiddenFieldType();
  }

  public changeFormType(type) {
    this.widgetConstructorService.changeItemFormType.next({ type, index: this.index });
  }

  public selectFieldType(fieldType) {
    this.item.idField = 'field_id_' + fieldType.type;
    this.item.fieldType = fieldType;
    this.item.service = fieldType.label;
  }

  public idFocusOut() {
    this.widgetConstructorService.formExtIdFieldFocusOut.next();
  }

  public isFieldUtmOrRef(type) {
    return (
      type === 'utm_source' ||
      type === 'utm_medium' ||
      type === 'utm_campaign' ||
      type === 'utm_term' ||
      type === 'utm_content' ||
      type === 'referrer'
    );
  }

  public checkIdField(text: string): boolean {
    return /^[0-9A-Za-z:_\-+/*%#@&]+$/.test(text);
  }
}
