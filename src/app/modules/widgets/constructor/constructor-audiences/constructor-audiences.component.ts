import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Audience, AudienceGroup, AudienceGroupItem, FullWidget } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { WidgetConstructorService } from '../../services/widget-constructor.service';

@Component({
  selector: 'app-constructor-audiences',
  templateUrl: './constructor-audiences.component.html',
  styleUrls: ['./constructor-audiences.component.scss']
})
export class ConstructorAudiencesComponent implements OnInit {
  @Input() public widget: FullWidget;
  @Input() public audience: Audience;
  @Input() public isMockup: boolean;

  constructor(
    private router: Router,
    private widgetService: WidgetService,
    private widgetConstructorService: WidgetConstructorService
  ) {
  }

  ngOnInit(): void {
    this.audience.groups = this.audience.groups.map((group: AudienceGroup, i: number) => ({
      ...group,
      id: i,
      items: group.items.map((item: AudienceGroupItem, j: number) => ({ ...item, id: j }))
    }));
  }

  public getCroppedString(str, count, addedSymbol) {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }

    return str;
  }

  public removeItem(group, index) {
    for (let i = 0; i < this.audience.groups.length; i++) {
      if (this.audience.groups[i].id === group.id) {
        this.audience.groups[i].items = this.widgetConstructorService.removeFromArray(this.audience.groups[i].items, index);

        if (this.audience.groups[i].items.length === 0) {
          this.audience.groups = this.widgetConstructorService.removeFromArray(this.audience.groups, i);
        }
        return;
      }
    }
  }

  public removeSubItem(groupId, itemId, index) {
    for (const item of this.audience.groups) {
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

  public onChangePayment(enabled) {
    this.widgetService.onChangePayment.next(enabled);
  }

}
