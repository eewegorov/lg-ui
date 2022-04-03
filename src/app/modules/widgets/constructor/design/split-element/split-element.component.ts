import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-split-element',
  templateUrl: './split-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './split-element.component.scss']
})
export class SplitElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;
  @Input() public typeClass: string[];
  @Input() public widthHrType: string[];
  @Input() public floatBtn: string[];

  public optionsThickness: Options = {
    floor: 1.0,
    ceil: 5.0,
    step: 0.5,
    animate: false,
    showSelectionBar: true
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
