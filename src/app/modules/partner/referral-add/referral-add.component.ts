import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-referral-add',
  templateUrl: './referral-add.component.html',
  styleUrls: ['./referral-add.component.scss']
})
export class ReferralAddComponent implements OnInit {
  public refMail: string;

  constructor(
    private activeModal: NgbActiveModal,
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public createRef(): void {
    this.partnerService.addNewRef(this.refMail).subscribe((response: string) => {
      if (!response) return;
      this.closeModal();
    });

  }
}
