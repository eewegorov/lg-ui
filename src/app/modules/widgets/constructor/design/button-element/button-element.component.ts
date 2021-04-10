import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-button-element',
  templateUrl: './button-element.component.html',
  styleUrls: ['./button-element.component.scss']
})
export class ButtonElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;
  @Output() private removeElement = new EventEmitter<{index: number, elem: object}>();

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

  public removeElementFromElementsList(index: number, elem: object): void {
    this.removeElement.emit({index, elem});
  }
}
