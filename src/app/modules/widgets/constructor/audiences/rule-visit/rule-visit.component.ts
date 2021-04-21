import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-visit',
  templateUrl: './rule-visit.component.html',
  styleUrls: ['./rule-visit.component.scss']
})
export class RuleVisitComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
