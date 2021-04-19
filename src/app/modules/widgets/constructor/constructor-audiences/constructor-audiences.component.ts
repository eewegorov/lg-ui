import { Component, Input, OnInit } from '@angular/core';
import { Audience, AudienceGroup, FullWidget } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { Router } from '@angular/router';

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
    private widgetService: WidgetService
  ) {
  }

  ngOnInit(): void {
    this.audience.groups = this.audience.groups.map((group: AudienceGroup, i: number) => ({ ...group, id: i }));
  }

  public goToTest() {
    this.router.navigate([`/abtests/active?testIdNum-${this.widget.abtestInfo.id}`]).then();
  }

  public getCroppedString(str, count, addedSymbol) {
    if (str.length > count) {
      return str.substring(0, count) + addedSymbol;
    }

    return str;
  }

  public removeItem(group, index) {
    for (let i = 0; i < this.audience.groups.length; i++) {
      if (this.audience.groups[i].$$hashKey === group) {
        this.audience.groups[i].items = removeFromArray(this.audience.groups[i].items, index);

        if (this.audience.groups[i].items.length === 0) {
          this.audience.groups = removeFromArray(this.audience.groups, i);
        }
        return;
      }
    }
  }

  public removeSubItem(groupId, itemId, index) {
    for (let i = 0; i < this.audience.groups.length; i++) {
      if (this.audience.groups[i].$$hashKey === groupId) {

        for (let j = 0; j < this.audience.groups[i].items.length; j++) {
          if (this.audience.groups[i].items[j].$$hashKey === itemId) {
            this.audience.groups[i].items[j].subitems = removeFromArray(this.audience.groups[i].items[j].subitems, index);

            if (this.audience.groups[i].items[j].subitems.length === 0) {
              this.removeItem(this.audience.groups[i].$$hashKey, j);
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
