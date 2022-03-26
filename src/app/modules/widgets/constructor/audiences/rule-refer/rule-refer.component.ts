import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';
import { AUDIENCES_VALS } from '../../../../../configs/audiences';

@Component({
  selector: 'app-rule-refer',
  templateUrl: './rule-refer.component.html',
  styleUrls: ['../../../shared/shared.scss', './rule-refer.component.scss']
})
export class RuleReferComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;
  public vals = AUDIENCES_VALS;
  @Output() private remove = new EventEmitter<{ groupId: number, itemType: string, index: number }>();
  @Output() private add = new EventEmitter<AudienceGroupItem>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public removeSubItem(groupId: number, itemType: string, index: number): void {
    this.remove.emit({ groupId, itemType, index });
  }

  public addSubItem(item: AudienceGroupItem): void {
    this.add.emit(item);
  }

}
