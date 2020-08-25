import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { LeadById, LeadByIdWithIndex } from '../../../core/models/crm';
import { CrmService } from '../services/crm.service';


@Component({
  selector: 'app-lead-info',
  templateUrl: './lead-info.component.html',
  styleUrls: ['./lead-info.component.scss']
})
export class LeadInfoComponent implements OnInit, OnDestroy {
  public leadInfo: LeadById = null;
  public index: number;
  public status;
  public isUserCommentUpdated = false;
  public isOpen = false;
  public focused = false;
  private openLeadInfoSidebarSub: SubscriptionLike;

  constructor(private crmService: CrmService) { }

  ngOnInit(): void {

    this.openLeadInfoSidebarSub = this.crmService.openLeadInfoSidebar.subscribe((response: LeadByIdWithIndex) => {
      this.leadInfo = response.data;
      this.index = response.index;
      this.isOpen = true;
    });
  }

  public closeLeadInfo() {
    this.isOpen = false;
  }

  public onFocusCommentField() {
    this.focused = true;
  };

  public updateComment() {
    this.focused = false;
    this.crmService.updateLeadComment(this.leadInfo.id, { comment: this.leadInfo.userComment }).subscribe(
      (response: boolean) => {
        if (response) {
          this.isUserCommentUpdated = true;
          setTimeout(() => {
            this.isUserCommentUpdated = false;
            }, 1000);
        }
      });
  };

  ngOnDestroy(): void {
    if (this.openLeadInfoSidebarSub) {
      this.openLeadInfoSidebarSub.unsubscribe();
    }
  }

}
