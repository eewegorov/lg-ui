import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../site-add/site-add.component';
import { SitesService } from '../services/sites.service';
import { Site } from '../models/sites';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit, OnDestroy {
  public sites: Site[]
  public isSitesListLoaded = false;
  private hidePhoneFieldInModal = false;
  private sitesSub: SubscriptionLike;

  constructor(
    private modalService: NgbModal,
    private sitesService: SitesService
  ) { }

  ngOnInit(): void {
    this.getSites();
  }

  public openModalForCreatingNewSite() {
    const modalRef = this.modalService.open(SiteAddComponent);
    modalRef.componentInstance.hidePhone = this.hidePhoneFieldInModal;
  }

  private getSites() {
    this.sitesSub = this.sitesService.getSites().subscribe((response: Site[]) => {
      this.sites = response;
    });
  }

  ngOnDestroy(): void {
    if (this.sitesSub) {
      this.sitesSub.unsubscribe();
    }
  }

}
