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

  public getInvoiceAndGoToWallet(siteId, tariffId) { // ned to fix for create order
    // TODO: old API
    $.ajax({
      type: "POST",
      async: false,
      url: openapi.getUrl("site/getInvoice"),
      data: {siteid: siteId, tarrifid: tariffId},
      success: function(map) {
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("target", "_blank");
        form.setAttribute("action", "https://wl.walletone.com/checkout/checkout/Index");

        for (var key in map) {
          if (map.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", map[key]);

            form.appendChild(hiddenField);
          }
        }

        document.body.appendChild(form);
        form.submit();
      }
    });
  }

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
