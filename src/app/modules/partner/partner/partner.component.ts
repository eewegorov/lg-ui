import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
  public partnerUrl;
  public partnerBalance;
  public regUsers;
  public earnedMoney;
  public item;

  constructor() { }

  ngOnInit(): void {
  }

}
