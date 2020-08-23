import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { CrmService } from '../services/crm.service';
import { LeadById, LeadByIdWithIndex } from '../../../core/models/crm';

@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss']
})
export class LeadInfoComponent implements OnInit, OnDestroy {
  public leadInfo: LeadById = null;
  public field;
  public history;
  public isOpen = false;
  private openLeadInfoSidebarSub: SubscriptionLike;

  constructor(private crmService: CrmService) { }

  ngOnInit(): void {
    this.openLeadInfoSidebarSub = this.crmService.openLeadInfoSidebar.subscribe((response: LeadByIdWithIndex) => {
      this.leadInfo = response.data;
    });
  }

  ngOnDestroy(): void {
    if (this.openLeadInfoSidebarSub) {
      this.openLeadInfoSidebarSub.unsubscribe();
    }
  }

}
