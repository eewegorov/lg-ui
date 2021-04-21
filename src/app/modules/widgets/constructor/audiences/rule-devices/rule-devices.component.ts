import { Component, Input, OnInit } from '@angular/core';
import { AudienceGroup, AudienceGroupItem } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-rule-devices',
  templateUrl: './rule-devices.component.html',
  styleUrls: ['./rule-devices.component.scss']
})
export class RuleDevicesComponent implements OnInit {
  @Input() public item: AudienceGroupItem;
  @Input() public group: AudienceGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
