import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';
import { AUDIENCES_VALS } from '../../../../../configs/audiences';

@Component({
  selector: 'app-rule-url',
  templateUrl: './rule-url.component.html',
  styleUrls: ['../../../shared/shared.scss', './rule-url.component.scss']
})
export class RuleUrlComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  @Output() private remove = new EventEmitter<{groupId: number, itemType: string, index: number}>();
  @Output() private add = new EventEmitter<AudienceGroupItem>();

  public vals = AUDIENCES_VALS;

  constructor() { }

  ngOnInit(): void {
  }

  public removeSubItem(groupId: number, itemType: string, index: number): void {
    this.remove.emit({groupId, itemType, index});
  }

  public addSubItem(item: AudienceGroupItem): void {
    this.add.emit(item);
  }

}
