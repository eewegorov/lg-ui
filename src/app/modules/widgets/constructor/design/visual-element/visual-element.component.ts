import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-visual-element',
  templateUrl: './visual-element.component.html',
  styleUrls: ['./visual-element.component.scss']
})
export class VisualElementComponent implements OnInit {
  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  public optionsThickness: Options = {
    floor: 0.00,
    ceil: 10.00,
    step: 1
  };

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  constructor() { }

  ngOnInit(): void {
  }

}
