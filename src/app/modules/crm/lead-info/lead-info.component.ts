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
  private openLeadInfoSidebarSub: SubscriptionLike;

  constructor(private crmService: CrmService) {
  }

  ngOnInit(): void {
    this.openLeadInfoSidebarSub = this.crmService.openLeadInfoSidebar.subscribe((response: LeadByIdWithIndex) => {
      if (this.isOpen && (this.index === response.index)) {
        return;
      }
      this.leadInfo = response.data;
      this.status = response.data.state;
      this.index = response.index;
      setTimeout(() => {
        this.isOpen = true;
      }, 0);
    });
  }

  public closeLeadInfo() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

  public updateState(event: string) {
    this.crmService.updateLeadState(this.leadInfo.id, { state: event }).subscribe(() => {
      this.crmService.updateLeadInfo.next({ index: this.index, state: event });
    });
  }

  public updateComment() {
    this.crmService.updateLeadComment(this.leadInfo.id, { comment: this.leadInfo.userComment }).subscribe(
      (response: boolean) => {
        if (response) {
          this.isUserCommentUpdated = true;
          setTimeout(() => {
            this.isUserCommentUpdated = false;
          }, 1000);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.openLeadInfoSidebarSub) {
      this.openLeadInfoSidebarSub.unsubscribe();
    }
  }

}
