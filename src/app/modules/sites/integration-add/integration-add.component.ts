import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-integration-add',
  templateUrl: './integration-add.component.html',
  styleUrls: ['./integration-add.component.scss']
})
export class IntegrationAddComponent implements OnInit {
  @Input() private siteId: string;
  @Input() private integrationId: string;
  public item;
  public site;
  public defIntegrationServiceName;
  public currentIntegrationService;
  public newCurrentIntegration;
  public currentIntegrationSite;
  public defIntegrationSiteName;
  public currentIntegrationSiteService;
  public editableIntegration;
  public editableIntegrationServiceName;


  constructor() { }

  ngOnInit(): void {
  }

}
