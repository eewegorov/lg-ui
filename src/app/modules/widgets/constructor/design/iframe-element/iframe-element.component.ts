import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-iframe-element',
  templateUrl: './iframe-element.component.html',
  styleUrls: ['./iframe-element.component.scss']
})
export class IframeElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;
  @Input() public widthHrType: string[];
  @Input() public widgwidthBtn: string[];
  @Input() public floatBtn: string[];

  @Output() private removeElement = new EventEmitter<number>();
  @Output() private buildIframeElement = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

  public getCodeForIframe(item) {
    this.buildIframeElement.emit(item);
  }

}
