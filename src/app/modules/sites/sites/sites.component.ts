import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../site-add/site-add.component';
import { UserService } from '../../user/services/user.service';
import { SitesService } from '../services/sites.service';
import { Site, SiteShort } from '../../../core/models/sites';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit, OnDestroy {
  public sites: Site[] = [];
  public timezone: string;
  public isSitesListLoaded = false;
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
    modalRef.componentInstance.updateSites.subscribe(() => {
      this.getSites();
    });
  }

  private getMeInfo() {
    /*this.userService.getMeInfo().subscribe((response: User) => {*/
    const response = {
      "login": "user@example.com",
      "id": "5a6e4fefc9f6afaff395fdff",
      "timeZone": "Asia/Vladivostok",
      "phone": "+15968977523598",
      "wallet": "78994596648"
    };
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
    /*});*/
  }

  private getSites(): void {
    /*this.sitesSub = this.sitesService.getSites().subscribe((response: Site[]) => {*/
    const response = [{
      "id": "5a6e51b4c9f6afb093583e0b",
      "name": "Сайт 1",
      "url": "site1.ru",
      "tariffName": "Партнерский",
      "tariffExp": 1641798721000,
      "actions": [
        {
          "date": 1516647600000,
          "value": 0
        },
        {
          "date": 1516734000000,
          "value": 0
        },
        {
          "date": 1516820400000,
          "value": 0
        },
        {
          "date": 1516906800000,
          "value": 1
        },
        {
          "date": 1516993200000,
          "value": 0
        },
        {
          "date": 1517079600000,
          "value": 0
        },
        {
          "date": 1517166000000,
          "value": 0
        }
      ],
      "emails": [
        {
          "date": 1516647600000,
          "value": 1
        },
        {
          "date": 1516734000000,
          "value": 0
        },
        {
          "date": 1516820400000,
          "value": 1
        },
        {
          "date": 1516906800000,
          "value": 0
        },
        {
          "date": 1516993200000,
          "value": 1
        },
        {
          "date": 1517079600000,
          "value": 0
        },
        {"date": 1517166000000,
          "value": 1
        }
      ],
      "leads": [
        {
          "date": 1516647600000,
          "value": 0
        },
        {
          "date": 1516734000000,
          "value": 1
        },
        {
          "date": 1516820400000,
          "value": 0
        },
        {
          "date": 1516906800000,
          "value": 0
        },
        {
          "date": 1516993200000,
          "value": 0
        },
        {
          "date": 1517079600000,
          "value": 0
        },
        {
          "date": 1517166000000,
          "value": 1
        }
      ]
    }];
      this.isSitesListLoaded = true;
      this.sites = this.sitesService.sites = response;
      if (this.sites.length) {
        setTimeout(() => {
          /*window.showPhoneCollector();*/
        }, 2000);
      } else {
        this.openModalForCreatingNewSite();
      }
    /*});*/
  }

  ngOnDestroy(): void {
    if (this.sitesSub) {
      this.sitesSub.unsubscribe();
    }
  }

}
