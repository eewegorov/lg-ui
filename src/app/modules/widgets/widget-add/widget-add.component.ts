import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-add',
  templateUrl: './widget-add.component.html',
  styleUrls: ['./widget-add.component.scss']
})
export class WidgetAddComponent implements OnInit {
  @Input() public currentSite;
  @Input() public companies;
  @Input() public currentCompany;
  type = { name: '', description: '', previewLink: '' };
  template = { name: '', description: '', previewLink: '' };
  editableWidget = { company: '' };
  company = { name: '' };

  constructor() { }

  ngOnInit(): void {
  }

}
