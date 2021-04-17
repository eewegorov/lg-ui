import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: any;
  @Input() public widget: FullWidget;

  @Output() private removeElement = new EventEmitter<number>();

  public optionsOpacity: Options = {
    floor: 0.00,
    ceil: 1.00,
    step: 0.1
  };

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

}
