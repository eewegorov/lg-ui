import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-datepicker',
  templateUrl: './extended-datepicker.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-datepicker.component.scss']
})
export class ExtendedDatepickerComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;
  @Input() public st: Record<string, any>;


  constructor() { }

  ngOnInit(): void {
  }

}
