import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-padding-element',
  templateUrl: './padding-element.component.html',
  styleUrls: ['../../../../shared/shared.scss', './padding-element.component.scss']
})
export class PaddingElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public modelName: any;

  constructor() {}

  ngOnInit(): void {}
}
