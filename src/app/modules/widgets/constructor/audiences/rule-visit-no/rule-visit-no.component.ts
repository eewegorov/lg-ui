import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-visit-no',
  templateUrl: './rule-visit-no.component.html',
  styleUrls: ['./rule-visit-no.component.scss']
})
export class RuleVisitNoComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
