import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UiService } from '../../../core/services/ui.service';
import { PartnerShowComponent } from '../partner-show/partner-show.component';


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

  constructor(
    private modalService: NgbModal,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.uiService.toggleSidebar(true);
  }

  public showCode(event: Event): void {
    // TODO: Need refactor jquery
    const code = $(event.currentTarget).closest(".ads-container").find(".code").html();
    const modalRef = this.modalService.open(PartnerShowComponent, {
      size: 'sm',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.refCode = code.trim();
  }

  ngOnDestroy(): void {
    this.uiService.toggleSidebar(false);
  }

}
