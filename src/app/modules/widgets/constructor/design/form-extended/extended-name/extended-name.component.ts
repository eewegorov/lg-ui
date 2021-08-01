import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-name',
  templateUrl: './extended-name.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-name.component.scss']
})
export class ExtendedNameComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
