import { Component, Input, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
