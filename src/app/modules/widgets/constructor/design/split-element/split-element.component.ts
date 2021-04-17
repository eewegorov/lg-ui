import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-split-element',
  templateUrl: './split-element.component.html',
  styleUrls: ['./split-element.component.scss']
})
export class SplitElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;
  @Input() public typeClass: string[];
  @Input() public widthHrType: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

}
