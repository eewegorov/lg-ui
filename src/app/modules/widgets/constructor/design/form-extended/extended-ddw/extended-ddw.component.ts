import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-ddw',
  templateUrl: './extended-ddw.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-ddw.component.scss']
})
export class ExtendedDdwComponent implements OnInit {
  @Input() public item: Record<string, any>;
  @Input() public st: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
