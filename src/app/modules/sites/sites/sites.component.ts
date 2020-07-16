import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public openModalForCreatingNewSite() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
    ModalService.showModal({
      templateUrl: "../js/site/create-site-modal/create-site-modal-template.html",
      controller: "CreateSiteModalController",
      inputs: {
        hidePhone: $scope.hidePhoneFieldInModal
      }
    }).then(function (modal) {
      modal.element.modal();
      modal.close.then(function (result) {
        $("body").removeClass("modal-open");
      });
    });
  }
}
