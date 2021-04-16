import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-social-element',
  templateUrl: './social-element.component.html',
  styleUrls: ['./social-element.component.scss']
})
export class SocialElementComponent implements OnInit {
  @Input() public index: number;
  @Input() public widget: FullWidget;

  @Output() private removeElement = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  public removeElementFromElementsList(index: number): void {
    this.removeElement.emit(index);
  }

}
