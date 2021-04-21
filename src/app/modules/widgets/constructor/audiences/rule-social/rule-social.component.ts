import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-social',
  templateUrl: './rule-social.component.html',
  styleUrls: ['./rule-social.component.scss']
})
export class RuleSocialComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

}
