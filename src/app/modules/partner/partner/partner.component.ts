import { Component, OnDestroy, OnInit } from '@angular/core';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit, OnDestroy {
  public partnerUrl;
  public partnerBalance;
  public regUsers;
  public earnedMoney;
  public item = { date: 0, sum: '' };

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.toggleSidebar(true);
  }

  ngOnDestroy(): void {
    this.uiService.toggleSidebar(false);
  }

}
