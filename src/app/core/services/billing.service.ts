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
export class BillingService {

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private coreApiService: CoreApiService
  ) { }

  public checkTariffPlans(siteId, title, subscription, siteName?, expTime?) {
    this.getTariffPlans().subscribe((response: TariffPlan[]) => {
      if (response.length) {
        const inputs = {
          plans: response,
          siteId,
          siteName,
          title,
          subscription,
          expTime
        };
        this.showTariffPlansModal(inputs);
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

  private showTariffPlansModal(inputs) {
    const modalRef = this.modalService.open(PaymentModalComponent);
    modalRef.componentInstance.inputs = inputs;
  }
}
