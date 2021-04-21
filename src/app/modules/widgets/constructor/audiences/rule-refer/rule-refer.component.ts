import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-refer',
  templateUrl: './rule-refer.component.html',
  styleUrls: ['./rule-refer.component.scss']
})
export class RuleReferComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
