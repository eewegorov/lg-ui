import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-padding-element',
  templateUrl: './padding-element.component.html',
  styleUrls: ['../../../shared/shared.scss', './padding-element.component.scss']
})
export class PaddingElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;

  @Output() private removeElement = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

}
