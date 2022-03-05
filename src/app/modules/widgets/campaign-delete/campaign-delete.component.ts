import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SitesService } from '../../sites/services/sites.service';
import { WidgetService } from '../services/widget.service';
import { CompanyShort } from '../../../core/models/widgets';

@Component({
  selector: 'app-company-delete',
  templateUrl: './campaign-delete.component.html',
  styleUrls: ['./campaign-delete.component.scss']
})
export class CampaignDeleteComponent implements OnInit {
  @Input() public companies;
  @Input() public deletedCompany;
  public currentCompany;
  public company;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private sitesService: SitesService,
    private widgetService: WidgetService
  ) {
  }

  ngOnInit(): void {
    this.companies = this.companies.filter((item) => {
      return item.id !== this.deletedCompany.id && !item.default;
    });

    this.currentCompany = this.companies[0];
  }

  public changeCompany(company) {
    this.currentCompany = company;
  }

  public performDeleteCompany(mode) {
    const deletedCompany = {
      mode,
      recipientCompanyId: (mode === 'MOVE_WIDGETS') ? this.currentCompany.id : ''
    };

    this.widgetService.deleteCompany(this.sitesService.getCurrentSiteId(), this.deletedCompany.id, deletedCompany)
      .subscribe((response: boolean) => {
        if (response) {
          this.toastr.success(this.translate.instant('widgetsList.company.delete.desc'), this.translate.instant('global.done'));
          this.activeModal.close(this.deletedCompany.id);
        } else {
          this.toastr.error(this.translate.instant('widgetsList.company.delete.error'), '');
        }
      });
  }

}
