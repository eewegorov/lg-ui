import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Company, Container, WidgetInfo } from '../../../../core/models/widgets';
import { WidgetService } from '../../services/widget.service';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';
import { ContainerCodeComponent } from '../container-code/container-code.component';
import { ContainerizedAddComponent } from '../containerized-add/containerized-add.component';

@Component({
  selector: 'app-containerized-container',
  templateUrl: './containerized-container.component.html',
  styleUrls: ['../../shared/shared.scss', './containerized-container.component.scss'],
  providers: [DecimalPipe]
})
export class ContainerizedContainerComponent implements OnInit {
  @Input() public container: Container;
  @Input() public site;
  @Input() private currentCompany: Company;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private decimalPipe: DecimalPipe,
    private widgetService: WidgetService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
  }

  ngOnInit(): void {
    this.widgetService.updateCurrentContainer.subscribe((data: string) => {
      if (data === this.container.id) {
        this.containerizedWidgetService.getWContainerInfo(this.site.id, data).subscribe((response: Container) => {
          this.container = response;
        });
      }
    });
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
        this.containerizedWidgetService.deleteWContainer(this.site.id, this.container.id).subscribe((response: boolean) => {
          if (response) {
            this.widgetService.updateWidgetsList.next(this.site.id);
            this.toastr.success(this.translate.instant('containerized.container.delete.desc'), this.translate.instant('global.done'));
          }
        });
      }
    });
  }

  public getAllCount(type) {
    let allValue = 0;
    this.container.widgets.forEach((item: WidgetInfo) => {
      if (!item.widgetConversion) { return; }
      allValue = allValue + item.widgetConversion[type];
    });
    return allValue;
  }

  public getAllCConversion() {
    return (this.decimalPipe.transform(((100 * this.getAllCount('target')) / this.getAllCount('shows')), '1.0-2')) + '%';
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
