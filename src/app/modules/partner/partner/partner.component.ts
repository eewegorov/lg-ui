import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionLike } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PartnerShowComponent } from '../partner-show/partner-show.component';
import { ReferralAddComponent } from '../referral-add/referral-add.component';
import { MAIN_URL } from '../../../configs/urls';
import { User } from '../../../core/models/user';
import { IncomeBalance, Registrations, Transaction } from '../../../core/models/partner';
import { UiService } from '../../../core/services/ui.service';
import { UserService } from '../../user/services/user.service';
import { PartnerService } from '../services/partner.service';


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
  public walletId: string;
  public transactions: Transaction[] = [];
  public loadingTransaction = false;
  public allTransactionsLoaded = false;
  private transactionsParams = {
    limit: 10,
    offset: 0
  };
  private meInfoSub: SubscriptionLike;
  private earnedMoneySub: SubscriptionLike;
  private partnerBalanceSub: SubscriptionLike;
  private registrationsSub: SubscriptionLike;
  private transactionsSub: SubscriptionLike;
  private walletSub: SubscriptionLike;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private uiService: UiService,
    private userService: UserService,
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
    this.uiService.toggleSidebar(true);

    this.meInfoSub = this.userService.getMeInfo().subscribe((response: User) => {
        this.partnerUrl = MAIN_URL + '?refid=' + response.id;
        this.walletId = response.wallet;
    });

    this.earnedMoneySub = this.partnerService.getEarnedMoney().subscribe((response: IncomeBalance) => {
      this.earnedMoney = response.sum;
    });

    this.partnerBalanceSub = this.partnerService.getPartnerBalance().subscribe((response: IncomeBalance) => {
      this.partnerBalance = response.sum;
    });

    this.registrationsSub = this.partnerService.getRegistrations().subscribe((response: Registrations) => {
      this.regUsers = response.count;
    });

    this.getTransactions(this.transactionsParams);
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
    const newWin =
      window.open(
        'https://www.facebook.com/sharer.php?u=' + this.partnerUrl,
        'Facebook',
        'width=420,height=230,resizable=yes,scrollbars=yes,status=yes'
      );
    newWin.focus();
  }

  public vkLink(): void {
    const newWin =
      window.open(
        'https://vk.com/share.php?url=' + this.partnerUrl + '&image=https://static.leadgenic.com/ads/200.jpg',
        'VK',
        'width=420,height=230,resizable=yes,scrollbars=yes,status=yes'
      );
    newWin.focus();
  }

  public twLink(): void {
    const newWin = window.open(
      'http://twitter.com/share?url=' + this.partnerUrl,
      'VK',
      'width=420,height=300,resizable=yes,scrollbars=yes,status=yes'
    );
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
          this.toastr.success(this.translate.instant('partner.add.done'), this.translate.instant('global.done'));
        }
      }, 100);
    })
      .catch(() => {});
  }

  public setWallet() {
    this.walletSub = this.partnerService.setWallet(this.walletId).subscribe((response: boolean) => {
      if (response) {
        this.toastr.success(this.translate.instant('partner.wallet.save'), this.translate.instant('global.done'));
      } else {
        this.toastr.error(this.translate.instant('partner.wallet.error.yandex'), this.translate.instant('global.error'));
      }
    });
  }

  public loadMore() {
    this.getTransactions(this.transactionsParams);
  }

  public trackById(index, item) {
    return item.id;
  }

  private getTransactions(params) {
    this.loadingTransaction = true;
    this.transactionsSub = this.partnerService.getTransactions(params).subscribe((response: Transaction[]) => {
      this.transactions = this.transactions.concat(response);
      if (response.length < 10) {
        this.allTransactionsLoaded = true;
      }
      this.transactionsParams.offset += response.length;
      this.loadingTransaction = false;
    });
  }

  ngOnDestroy(): void {
    this.uiService.toggleSidebar(false);
    if (this.meInfoSub) {
      this.meInfoSub.unsubscribe();
    }
    if (this.earnedMoneySub) {
      this.earnedMoneySub.unsubscribe();
    }
    if (this.partnerBalanceSub) {
      this.partnerBalanceSub.unsubscribe();
    }
    if (this.registrationsSub) {
      this.registrationsSub.unsubscribe();
    }
    if (this.transactionsSub) {
      this.transactionsSub.unsubscribe();
    }
    if (this.walletSub) {
      this.walletSub.unsubscribe();
    }
  }

}
