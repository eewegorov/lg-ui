import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-delete',
  templateUrl: './campaign-delete.component.html',
  styleUrls: ['./campaign-delete.component.scss']
})
export class CampaignDeleteComponent implements OnInit {
  @Input() public companies;
  @Input() public deletedCompany;
  public currentCompany;
  public company;

  constructor() { }

  ngOnInit(): void {
  }

}
