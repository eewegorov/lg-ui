import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '@core/models/widgets';
import { AUDIENCES_VALS } from '../../../../../../configs/audiences';

@Component({
  selector: 'app-rule-devices',
  templateUrl: './rule-devices.component.html',
  styleUrls: ['../../../../shared/shared.scss', './rule-devices.component.scss']
})
export class RuleDevicesComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;
  public vals = AUDIENCES_VALS;
  @Output() private remove = new EventEmitter<{ groupId: number; itemType: string; index: number }>();
  @Output() private add = new EventEmitter<AudienceGroupItem>();

  constructor() {}

  ngOnInit(): void {}

  public removeSubItem(groupId: number, itemType: string, index: number, event: Event): void {
    if (this.item.subitems.length <= 1) {
      event.preventDefault();
      return;
    }
    this.remove.emit({ groupId, itemType, index });
  }

  public addSubItem(item: AudienceGroupItem, value: string): void {
    this.add.emit(item);
    this.item.subitems[this.item.subitems.length - 1].value = value;
  }

  public checkSelected(value: string): number {
    return this.item.subitems.findIndex(subitem => subitem.value === value);
  }
}
