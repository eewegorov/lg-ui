import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-email',
  templateUrl: './extended-email.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-email.component.scss']
})
export class ExtendedEmailComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
