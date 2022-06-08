import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, SubscriptionLike } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../../components/site-add/site-add.component';
import { SiteShort } from '@core/models/sites';
import { User } from '@core/models/user';
import { UserService } from '../../../user/services/user.service';
import { CoreSitesService } from '@core/services/core-sites.service';
import { SitesService } from '../../services/sites.service';

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

  private readonly sub: Subscription;

  constructor(
    private readonly modalService: NgbModal,
    private readonly userService: UserService,
    private readonly coreSitesService: CoreSitesService,
    private readonly sitesService: SitesService
  ) {
    this.sub = new Subscription();
  }

  ngOnInit(): void {
    this.getMeInfo();
  }

  // TODO: Get rid of nested subscriptions
  public openModalForCreatingNewSite(): void {
    const modalRef = this.modalService.open(SiteAddComponent, {
      size: 'xl',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.hidePhone = this.hidePhoneFieldInModal;
    modalRef.componentInstance.updateSites.subscribe(() => {
      this.getSites();
    });
  }

  private getMeInfo() {
    this.userService.user$.subscribe((user: User) => {
      this.timezone = user.timeZone;
      if (!user.phone) {
        this.userService.userPhone = null;
      } else {
        this.hidePhoneFieldInModal = true;
      }
      if (user.phone) {
        this.hidePhoneFieldInModal = true;
      }
      this.getSites();
    });
  }

  private getSites(): void {
    const sitesSub: SubscriptionLike = this.sitesService.getSites().subscribe((response: SiteShort[]) => {
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
    this.sub.add(sitesSub);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
