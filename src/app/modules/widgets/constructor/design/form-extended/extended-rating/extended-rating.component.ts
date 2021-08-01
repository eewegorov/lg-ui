import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-rating',
  templateUrl: './extended-rating.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-rating.component.scss']
})
export class ExtendedRatingComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
