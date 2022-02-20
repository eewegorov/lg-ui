import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../site-add/site-add.component';
import { SiteShort } from '../../../core/models/sites';
import { User } from '../../../core/models/user';
import { UserService } from '../../user/services/user.service';
import { CoreSitesService } from '../../../core/services/core-sites.service';
import { SitesService } from '../services/sites.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit, OnDestroy {
  public sites: SiteShort[] = [];
  public timezone: string;
  public isSitesListLoaded = false;
  private hidePhoneFieldInModal = false;
  private sitesSub: SubscriptionLike;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private coreSitesService: CoreSitesService,
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
    modalRef.componentInstance.updateSites.subscribe(() => {
      this.getSites();
    });
  }

  private getMeInfo() {
    this.userService.getMeInfo().subscribe((response: User) => {
      this.timezone = response.timeZone;
      if (!response.phone) {
        this.userService.userPhone = null;
      } else {
        this.hidePhoneFieldInModal = true;
      }
      if (response.phone) {
        this.hidePhoneFieldInModal = true;
      }
      this.getSites();
    });
  }

  private getSites(): void {
    this.sitesSub = this.sitesService.getSites().subscribe((response: SiteShort[]) => {
      this.isSitesListLoaded = true;
      this.sites = this.coreSitesService.sites = response;
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
