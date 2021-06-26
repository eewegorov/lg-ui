import { Directive, ElementRef, Input } from '@angular/core';
import { Audience } from '../../core/models/widgets';

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
            name: 'testgroup',
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
      name: rule.attr('data-title'),
      type: rule.attr('data-code'),
      subitems: []
    };

    baseObj.subitems.push(this.getSubItemTemplate(baseObj.type));
    return baseObj;
  }

  private getSubItemTemplate(type) {
    const subObj = {} as any;

    if (type === 'url') {
      subObj.condition        = 0;
      subObj.paramCompareType = 0;
      subObj.param = '';
      subObj.valueCompareType = 0;
      subObj.value = '';
    } else if (type === 'refer' || type === 'search') {
      subObj.valueCompareType = 0;
      subObj.value = '';
    } else if (type === 'type' || type === 'visit') {
      subObj.value = 0;
    } else if (type === 'visitno') {
      subObj.valueCompareType = 0;
      subObj.value = 1;
    } else if (type === 'devices' || type === 'social') {
      subObj.value = 0;
    }
    return subObj;
  }

}
