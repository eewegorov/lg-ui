import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-extended-button',
  templateUrl: './extended-button.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-button.component.scss']
})
export class ExtendedButtonComponent implements OnInit {
  @Input() public index: number;
  @Input() public containerId: string;
  @Input() public item: Record<string, any>;

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  constructor() { }

  ngOnInit(): void {
  }

}
