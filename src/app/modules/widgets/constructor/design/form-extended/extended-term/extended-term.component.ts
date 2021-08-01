import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-term',
  templateUrl: './extended-term.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-term.component.scss']
})
export class ExtendedTermComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
