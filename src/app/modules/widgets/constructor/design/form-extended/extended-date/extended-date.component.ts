import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-date',
  templateUrl: './extended-date.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-date.component.scss']
})
export class ExtendedDateComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
