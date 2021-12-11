import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';
import { AUDIENCES_VALS } from '../../../../../configs/audiences';

@Component({
  selector: 'app-rule-type',
  templateUrl: './rule-type.component.html',
  styleUrls: ['../../../shared/shared.scss', './rule-type.component.scss']
})
export class RuleTypeComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  @Output() private remove = new EventEmitter<{groupId: number, itemType: string, index: number}>();
  @Output() private add = new EventEmitter<AudienceGroupItem>();

  public vals = AUDIENCES_VALS;

  constructor() { }

  ngOnInit(): void {
  }

  public removeSubItem(groupId: number, itemType: string, index: number, event: Event): void {
    if (this.item.subitems.length <= 1) { event.preventDefault(); return; }
    this.remove.emit({groupId, itemType, index});
  }

  public addSubItem(item: AudienceGroupItem, index: number): void {
    this.add.emit(item);
    this.item.subitems[this.item.subitems.length - 1].value = index;
  }

  public checkSelected(index: number): number {
    return this.item.subitems.findIndex(subitem => subitem.value === index);
  }

}
