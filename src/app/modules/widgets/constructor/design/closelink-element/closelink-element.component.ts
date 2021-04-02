import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-closelink-element',
  templateUrl: './closelink-element.component.html',
  styleUrls: ['./closelink-element.component.scss']
})
export class CloselinkElementComponent implements OnInit {
  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  constructor() { }

  ngOnInit(): void {
  }

}
