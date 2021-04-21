import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-type',
  templateUrl: './rule-type.component.html',
  styleUrls: ['./rule-type.component.scss']
})
export class RuleTypeComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

}
