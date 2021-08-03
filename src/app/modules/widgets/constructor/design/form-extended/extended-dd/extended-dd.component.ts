import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-dd',
  templateUrl: './extended-dd.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-dd.component.scss']
})
export class ExtendedDdComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;
  @Input() public st: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
