import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SitesService } from '../../../../sites/services/sites.service';
import { ContainerizedWidgetService } from '../../../services/containerized-widget.service';

@Component({
  selector: 'app-container-code',
  templateUrl: './container-code.component.html',
  styleUrls: ['./container-code.component.scss']
})
export class ContainerCodeComponent implements OnInit {
  public codeSiteId: string;
  public codeContainerId: string;
  @Input() private currentSiteId: string;
  @Input() private containerId: string;

  constructor(
    private activeModal: NgbActiveModal,
    private sitesService: SitesService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {}

  ngOnInit(): void {
    this.codeSiteId = this.sitesService.generatePath(this.currentSiteId, true);
    this.codeContainerId = this.containerizedWidgetService.getContainerInstallCode(this.containerId);
  }

  public closeModal(result) {
    this.activeModal.close(result);
  }
}
