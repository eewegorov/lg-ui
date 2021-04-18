import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AudienceGroup, FullWidget } from '../../../../core/models/widgets';

@Component({
  selector: 'app-constructor-audiences',
  templateUrl: './constructor-audiences.component.html',
  styleUrls: ['./constructor-audiences.component.scss']
})
export class ConstructorAudiencesComponent implements OnInit {
  @Input() public wid: string;
  @Input() public widget: FullWidget;
  @Input() public audiences: AudienceGroup[];

  public MODE_LIST = 0;
  public MODE_ITEM = 1;
  public audienceMode: number;
  public audience: any;

  constructor(private translate: TranslateService) {
    this.audienceMode = this.MODE_LIST;
  }

  ngOnInit(): void {
  }

  public addNewAudience() {
    this.audience = {
      name       : '',
      description: '',
      groups: [],
      sites: [],
      widgetId: this.wid
    };
    this.audienceMode = this.MODE_ITEM;
  }

  public editAudience(item) {
    this.audience = item;
    this.audienceMode = this.MODE_ITEM;
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

}
