import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  public title = '';
  public planLabels = {};

  constructor() { }

  ngOnInit(): void {
  }

}
