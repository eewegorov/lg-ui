import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-phone',
  templateUrl: './extended-phone.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-phone.component.scss']
})
export class ExtendedPhoneComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
