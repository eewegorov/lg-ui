import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../../core/models/widgets';

@Component({
  selector: 'app-form-extended',
  templateUrl: './form-extended.component.html',
  styleUrls: ['../../../../shared/shared.scss', './form-extended.component.scss']
})
export class FormExtendedComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Input() public item: Record<string, any>;

  public optionsRound: Options = {
    floor: 0,
    ceil: 50,
    step: 1
  };

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  constructor() { }

  ngOnInit(): void {
  }

  public trackByIndex(index) {
    return index;
  }

}
