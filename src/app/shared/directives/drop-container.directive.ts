import { Directive, ElementRef, Input } from '@angular/core';
import { Audience } from '../../core/models/widgets';
import { AUDIENCES_VALS } from '../../configs/audiences';

declare var require: any;
const $ = require('jquery');
import 'jquery-ui/ui/widgets/droppable.js';

@Directive({
  selector: '[appDropContainer]'
})
export class DropContainerDirective {
  @Input() private audience: Audience;
  @Input() private type: 'AND' | 'OR';
  @Input() private index: number;

  constructor(private el: ElementRef) {
    ($(el.nativeElement) as any).droppable({
      hoverClass: 'rule-droppable-hover',
      drop: (event, ui) => {
        const rule = ui.draggable;

        if (this.type === 'AND') {
          this.audience.groups.push({
            items: [this.getItemTemplate(rule)]
          });
        } else {
          this.audience.groups[this.index].items.push(this.getItemTemplate(rule));
        }
      }
    });
  }

  private getItemTemplate(rule) {
    const baseObj = {
      type: rule.attr('data-code'),
      subitems: []
    };

    baseObj.subitems.push(this.getSubItemTemplate(baseObj.type));
    return baseObj;
  }

  private getSubItemTemplate(type) {
    const subObj = {} as any;

    if (type === 'URL') {
      subObj.condition        = AUDIENCES_VALS.conditionsEnum[0];
      subObj.paramCompareType = AUDIENCES_VALS.compareTypesEnum[0];
      subObj.param = '';
      subObj.valueCompareType = AUDIENCES_VALS.compareTypesEnum[0];
      subObj.value = '';
    } else if (type === 'REFER' || type === 'SEARCH') {
      subObj.valueCompareType = AUDIENCES_VALS.compareTypesEnum[0];
      subObj.value = '';
    } else if (type === 'TYPE') {
      subObj.value = AUDIENCES_VALS.trafficTypesEnum[0];
    } else if (type === 'VISIT') {
      subObj.value = AUDIENCES_VALS.visitsTypeEnum[0];
    } else if (type === 'VISIT_NO') {
      subObj.valueCompareType = AUDIENCES_VALS.arifmethicEnum[0];
      subObj.value = 1;
    } else if (type === 'DEVICES') {
      subObj.value = AUDIENCES_VALS.deviceListEnum[0];
    } else if (type === 'SOCIAL') {
      subObj.value = AUDIENCES_VALS.socialNetsEnum[0];
    }

    return subObj;
  }

}
