import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Company } from '../../../core/models/widgets';
import { ContainerCodeComponent } from '../container-code/container-code.component';
import { ContainerizedAddComponent } from '../containerized-add/containerized-add.component';
import { ContainerizedWidgetService } from '../services/containerized-widget.service';

@Component({
  selector: 'app-containerized-container',
  templateUrl: './containerized-container.component.html',
  styleUrls: ['./containerized-container.component.scss']
})
export class ContainerizedContainerComponent implements OnInit {
  @Input() public container = {};
  @Input() public site;
  @Input() private currentCompany: Company;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
  }

  ngOnInit(): void {
  }

  public updateContainer(data) {
    if (!data) {
      return false;
    }
    this.containerizedWidgetService.updateWContainer(this.site.id, this.container.id, data, this.container.description);
  }

  public updateDescription() {
    this.containerizedWidgetService.updateWContainer(this.site.id, this.container.id, this.container.name, this.container.description);
  }

  public openContainerCodeModal() {
    const modalRef = this.modalService.open(ContainerCodeComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.currentSiteId = this.site.id;
    modalRef.componentInstance.containerId = this.container.id;
  }

  public removeContainer() {
    Swal.fire({
      title: this.translate.instant('widgetsList.widget.delete.title'),
      text: this.translate.instant('containerized.container.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('widgetsList.widget.delete.confirm'),
      cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel')
    }).then((isConfirm) => {
      if (isConfirm) {
        this.containerizedWidgetService.deleteWContainer(this.site.id, this.container.id).then(function() {
          EventsService.publish(EVENTS.updateWidgetsList, scope.site.id);
          toastr["success"]($translate.instant("containerized.container.delete.desc"), $translate.instant("widgetsList.widget.delete.done"));
        });
      }
    });
  }

  public getAllCount(type) {
    let allValue = 0;
    this.container.widgets.forEach((item) => {
      if (!item.widgetConversion) { return };
      allValue = allValue + item.widgetConversion[type];
    });
    return allValue;
  }

  public getAllCConversion() {
    return $filter("number")(((100 * scope.getAllCount('target')) / scope.getAllCount('shows')), 2) + "%";
  }

  public addVariant() {
    const modalRef = this.modalService.open(ContainerizedAddComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.currentSiteId = this.site.id;
    modalRef.componentInstance.containerId = this.container.id;
    modalRef.componentInstance.currentCompany = this.currentCompany;
    modalRef.componentInstance.template = this.container.widgets[0].template;
    modalRef.componentInstance.type = this.container.widgets[0].type;
  }

}
