import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegrationAddComponent } from '../integration-add/integration-add.component';
import Swal from 'sweetalert2';
import { IntegrationItem } from '../../../core/models/sites';
import { SitesService } from '../services/sites.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-integration-item',
  templateUrl: './integration-item.component.html',
  styleUrls: ['./integration-item.component.scss']
})
export class IntegrationItemComponent implements OnInit {
  @Input() public widget;
  @Input() private siteId: string;
  @Output() private updateIntegrations = new EventEmitter<boolean>();

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private sitesService: SitesService
  ) { }

  ngOnInit(): void {
  }

  public updateWidgetName(data) {
    if (!data) {
      return false;
    }
    this.sitesService.getSiteIntegration(this.siteId, this.widget.id).subscribe((response: IntegrationItem) => {
      this.widget = response;
      this.widget.name = data;
      this.sitesService.updateSiteIntegration(this.siteId, this.widget.id, this.widget);
    });
  }

  public startStopItem(isStart: boolean) {
    this.sitesService.startStopSiteIntegration(this.siteId, this.widget.id, isStart).subscribe((response: boolean) => {
      if (response) {
        this.widget.active = isStart;
      }
    });
  }

  public setupItem() {
    const modalRef = this.modalService.open(IntegrationAddComponent, {
      windowClass: 'animate__animated animate__slideInDown animate__faster',
    });
    modalRef.componentInstance.siteId = this.siteId;
    modalRef.componentInstance.integrationId = null;

    modalRef.result.then((result) => {
      if (result && result.success) {
        this.updateIntegrations.emit(true);
      }
    });
  }

  public removeItem() {
    Swal.fire({
      title: this.translate.instant('settings.site.integration.delete.title'),
      text: this.translate.instant('settings.site.integration.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('widgetsList.widget.delete.confirm'),
      cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel'),
    }).then((isConfirm) => {
      if (isConfirm) {
        this.sitesService.deleteSiteIntegration(this.siteId, this.widget.id).subscribe((response: boolean) => {
          if (response) {
            this.toastr.success(this.translate.instant('settings.site.integration.deleted'), this.translate.instant('global.done'));
            this.updateIntegrations.emit(true);
          }
        });
      }
    });
  }

}
