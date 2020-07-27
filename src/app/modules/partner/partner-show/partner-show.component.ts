import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-partner-show',
  templateUrl: './partner-show.component.html',
  styleUrls: ['./partner-show.component.scss']
})
export class PartnerShowComponent implements OnInit {
  @Input() public refCode: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.activeModal.close();
  }

}
