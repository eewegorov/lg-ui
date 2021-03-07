import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SitesService } from '../../../sites/services/sites.service';
import { ContainerizedWidgetService } from '../../services/containerized-widget.service';

@Component({
  selector: 'app-container-code',
  templateUrl: './container-code.component.html',
  styleUrls: ['./container-code.component.scss']
})
export class ContainerCodeComponent implements OnInit {
  @Input() private currentSiteId: string;
  @Input() private containerId: string;

  public codeSiteId: string;
  public codeContainerId: string;

  constructor(
    private activeModal: NgbActiveModal,
    private sitesService: SitesService,
    private containerizedWidgetService: ContainerizedWidgetService
  ) {
    this.codeSiteId = this.sitesService.generatePath(this.currentSiteId, true);
    this.codeContainerId = this.containerizedWidgetService.getContainerInstallCode(this.containerId);
  }

  ngOnInit(): void {
  }

  public closeModal(result) {
    this.activeModal.close(result);
  }

}
