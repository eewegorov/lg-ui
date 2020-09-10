import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../site-add/site-add.component';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../services/sites.service';
import { Site } from '../../../core/models/sites';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit, OnDestroy {
  public sites: Site[] = [];
  public timezone: string;
  public isSitesListLoaded = true;
  private userPhone: string;
  private hidePhoneFieldInModal = false;
  private sitesSub: SubscriptionLike;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private sitesService: SitesService
  ) { }

  ngOnInit(): void {
    this.getMeInfo();
  }

  public openModalForCreatingNewSite(): void {
    const modalRef = this.modalService.open(SiteAddComponent, {
        size: 'lg',
        windowClass: 'animate__animated animate__slideInDown animate__faster'
      });
    modalRef.componentInstance.hidePhone = this.hidePhoneFieldInModal;
  }

  private getMeInfo() {
    this.userService.getMeInfo().subscribe((response: User) => {
      this.timezone = response.timeZone;
      if (response.phone) {
        this.hidePhoneFieldInModal = true;
      }
      this.getSites();
    });
  }

  private getSites(): void {
    this.sitesSub = this.sitesService.getSites().subscribe((response: Site[]) => {
      this.isSitesListLoaded = true;
      this.sites = this.sitesService.sites = response;
      if (this.sites.length) {
        setTimeout(() => {
          /*window.showPhoneCollector();*/
        }, 2000);
      } else {
        this.openModalForCreatingNewSite();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sitesSub) {
      this.sitesSub.unsubscribe();
    }
  }

}
