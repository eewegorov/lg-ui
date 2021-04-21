import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-url',
  templateUrl: './rule-url.component.html',
  styleUrls: ['./rule-url.component.scss']
})
export class RuleUrlComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
