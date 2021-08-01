import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-variants',
  templateUrl: './extended-variants.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-variants.component.scss']
})
export class ExtendedVariantsComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
