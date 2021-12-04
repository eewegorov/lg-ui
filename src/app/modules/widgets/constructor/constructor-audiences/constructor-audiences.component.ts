import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Audience, AudienceGroup, AudienceGroupItem, FullWidget } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { WidgetConstructorService } from '../../services/widget-constructor.service';

declare var require: any;
const $ = require('jquery');
import 'jquery-ui/ui/widgets/draggable.js';


@Component({
  selector: 'app-constructor-audiences',
  templateUrl: './constructor-audiences.component.html',
  styleUrls: ['../../shared/shared.scss', './constructor-audiences.component.scss']
})
export class ConstructorAudiencesComponent implements OnInit, AfterViewInit {
  @Input() public widget: FullWidget;
  @Input() public isMockup: boolean;

  constructor(
    private router: Router,
    private widgetService: WidgetService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngOnInit(): void {
    this.widget.audience.groups = this.widget.audience.groups.map((group: AudienceGroup, i: number) => ({
      ...group,
      id: i,
      items: group.items.map((item: AudienceGroupItem, j: number) => ({ ...item, id: j }))
    }));
  }

  ngAfterViewInit(): void {
    (jQuery('.info-link') as any).tooltip({
      container: 'body'
    });

    ($('.audience-rule') as any).draggable({
      helper: 'clone',
      revert: false,
      appendTo: '#audiences-item',
      drag(e, ui) {
        ui.position.top = e.pageY - 30;
        ui.position.left = e.pageX - 70;
      }
    });

    $(window).scroll(() => {
      if ($(window).scrollTop() > 300) {
        $('.rules-templates-list').css('top', $(window).scrollTop() - 300);
      } else {
        $('.rules-templates-list').css('top', 0);
      }
    });
  }

  public getCroppedString(str, count, addedSymbol) {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }

    return str;
  }

  public removeItem(groupId, index) {
    for (let i = 0; i < this.widget.audience.groups.length; i++) {
      if (this.widget.audience.groups[i].id === groupId) {
        this.widget.audience.groups[i].items = this.widgetConstructorService.removeFromArray(this.widget.audience.groups[i].items, index);

        if (this.widget.audience.groups[i].items.length === 0) {
          this.widget.audience.groups = this.widgetConstructorService.removeFromArray(this.widget.audience.groups, i);
        }
        return;
      }
    }
  }

  public removeSubItem(groupId: number, itemId: number, index: number): void {
    for (const item of this.widget.audience.groups) {
      if (item.id === groupId) {

        for (let j = 0; j < item.items.length; j++) {
          if (item.items[j].id === itemId) {
            item.items[j].subitems =
              this.widgetConstructorService.removeFromArray(item.items[j].subitems, index);

            if (item.items[j].subitems.length === 0) {
              this.removeItem(item.id, j);
            }

            return;
          }
        }

        return;
      }
    }
  }

  public addSubItem(item: AudienceGroupItem): void {
    item.subitems.push(this.getSubItemTemplate(item.type));
  }

  public onChangePayment(enabled) {
    this.widgetService.onChangePayment.next(enabled);
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
