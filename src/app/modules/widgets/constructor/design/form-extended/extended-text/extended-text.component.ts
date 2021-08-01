import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-text',
  templateUrl: './extended-text.component.html',
  styleUrls: ['../../../../shared/shared.scss', './extended-text.component.scss']
})
export class ExtendedTextComponent implements OnInit {
  @Input() public index: number;
  @Input() public item: Record<string, any>;

  constructor() { }

  ngOnInit(): void {
  }

}
