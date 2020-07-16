import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteAddComponent } from '../site-add/site-add.component';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  private hidePhoneFieldInModal = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public openModalForCreatingNewSite() {
    const modalRef = this.modalService.open(SiteAddComponent);
    modalRef.componentInstance.hidePhone = this.hidePhoneFieldInModal;
  }
}
