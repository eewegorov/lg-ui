import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer-datepicker',
  templateUrl: './timer-datepicker.component.html',
  styleUrls: ['./timer-datepicker.component.scss']
})
export class TimerDatepickerComponent implements OnInit {
  @Input() public item: any;

  constructor() { }

  ngOnInit(): void {
  }

}
