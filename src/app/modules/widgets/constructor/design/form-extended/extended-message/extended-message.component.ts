import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-message',
  templateUrl: './extended-message.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-message.component.scss']
})
export class ExtendedMessageComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
