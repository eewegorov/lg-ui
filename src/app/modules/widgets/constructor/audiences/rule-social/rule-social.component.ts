import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';
import { AUDIENCES_VALS } from '../../../../../configs/audiences';

@Component({
  selector: 'app-rule-social',
  templateUrl: './rule-social.component.html',
  styleUrls: ['./rule-social.component.scss']
})
export class RuleSocialComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  @Output() private remove = new EventEmitter<{groupId: number, itemId: number, index: number}>();
  @Output() private add = new EventEmitter<AudienceGroupItem>();

  public vals = AUDIENCES_VALS;

  constructor() { }

  ngOnInit(): void {
  }

  public removeSubItem(groupId: number, itemId: number, index: number): void {
    this.remove.emit({groupId, itemId, index});
  }

  public addSubItem(item: AudienceGroupItem): void {
    this.add.emit(item);
  }

}
