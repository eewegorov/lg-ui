import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-title',
  templateUrl: './extended-title.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-title.component.scss']
})
export class ExtendedTitleComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
