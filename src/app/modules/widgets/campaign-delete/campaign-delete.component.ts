import { Component, Input, OnInit } from '@angular/core';
import { SitesService } from '../../sites/services/sites.service';
import { WidgetService } from '../services/widget.service';

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
    private sitesService: SitesService,
    private widgetService: WidgetService
  ) {
    this.companies = this.companies.filter((item) => {
      return item.id !== this.deletedCompany.id && !item.default;
    });

    this.currentCompany = this.companies[0];
  }

  ngOnInit(): void {
  }

  public changeCompany(company) {
    this.currentCompany = company;
  }

  public performDeleteCompany(mode) {
    const deleted = {
      mode,
      recipientCompanyId: (mode === 'MOVE_WIDGETS') ? this.currentCompany.id : ''
    };
    this.widgetService.deleteCompany(this.sitesService.getCurrentSiteId(), this.deletedCompany.id, deleted).then((response) => {
      if (response.code === 200) {
        toastr["success"](notifyMessages.deleteDesc, notifyMessages.deleteDone);
        close($scope.deletedCompany.id, 500); // close, but give 500ms for bootstrap to animate
      } else {
        this.sitesService.parseError(response);
        toastr["error"]("Internal server error", "");
      }
    });
  }

}
