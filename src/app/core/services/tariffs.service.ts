import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TariffPlan, TariffPlansResponse } from '../models/tariffPlans';
import { CoreApiService } from './core-api.service';
import { PaymentModalComponent } from '../../shared/components/payment-modal/payment-modal.component';


@Injectable({
  providedIn: 'root'
})
export class TariffsService {

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private coreApiService: CoreApiService
  ) {
  }

  public checkTariffPlans(siteId, title, subscription, siteName?, expTime?) {
    this.getTariffPlans().subscribe((response: TariffPlan[]) => {
      if (response.length) {
        this.showTariffPlansModal(response, siteId, title, subscription, siteName, expTime);
      } else {
        this.toastr.error(this.translate.instant('billing.notify.noPlans'));
      }
    });
  }

  private getTariffPlans(): Observable<TariffPlan[]> {
    return this.coreApiService.getTariffPlans().pipe(
      map((response: TariffPlansResponse) => response.data)
    );
  }

  private showTariffPlansModal(plans, siteId, title, subscription, siteName?, expTime?) {
    const modalRef = this.modalService.open(PaymentModalComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.plans = plans;
    modalRef.componentInstance.siteId = siteId;
    modalRef.componentInstance.siteName = siteName;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.subscription = subscription;
    modalRef.componentInstance.expTime = expTime;

  }
}
