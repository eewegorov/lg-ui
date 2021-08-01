import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-hidden',
  templateUrl: './extended-hidden.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-hidden.component.scss']
})
export class ExtendedHiddenComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
