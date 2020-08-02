import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartnerShowComponent } from '../partner-show/partner-show.component';
import { ReferralAddComponent } from '../referral-add/referral-add.component';
import { UiService } from '../../../core/services/ui.service';


@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartnerComponent implements OnInit, OnDestroy {
  public partnerUrl = 'https://leadgenic.ru?refid=5e3d68dd0cf202ad4b7abc45';
  public partnerBalance = 0;
  public regUsers = 0;
  public earnedMoney = 0;
  public item = { date: 0, sum: '' };
  public walletId: string;
  public transactions = [];

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.uiService.toggleSidebar(true);
  }

  public showCode(event: Event): void {
    // TODO: Need refactor jquery
    const code = $(event.currentTarget).closest('.ads-container').find('.code').html();
    const modalRef = this.modalService.open(PartnerShowComponent, {
      windowClass: 'animate__animated animate__slideInDown animate__faster',
      size: 'lg'
    });
    modalRef.componentInstance.refCode = code.trim();
  }

  public fbLink(): void {
    const newWin = window.open("https://www.facebook.com/sharer.php?u=" + this.partnerUrl, "Facebook", "width=420,height=230,resizable=yes,scrollbars=yes,status=yes");
    newWin.focus();
  }

  public vkLink(): void {
    const newWin = window.open("https://vk.com/share.php?url=" + this.partnerUrl + "&image=https://static.leadgenic.com/ads/200.jpg", "VK", "width=420,height=230,resizable=yes,scrollbars=yes,status=yes");
    newWin.focus();
  }

  public twLink(): void {
    const newWin = window.open("http://twitter.com/share?url=" + this.partnerUrl, "VK", "width=420,height=300,resizable=yes,scrollbars=yes,status=yes");
    newWin.focus();
  }

  public createRef(): void {
    const modalRef = this.modalService.open(ReferralAddComponent, {
      windowClass: 'animate__animated animate__slideInDown animate__faster',
      size: 'lg'
    });

    modalRef.result.then((result) => {
      setTimeout(() => {
        if (result && result.success) {
          this.toastr.success(this.translate.instant('partner.add.done.desc'), this.translate.instant('partner.add.done.title'));
        }
      }, 100);
    });
  }

  public setWallet() {

  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.uiService.toggleSidebar(false);
  }

}
