import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-position-control',
  templateUrl: './position-control.component.html',
  styleUrls: ['./position-control.component.scss']
})
export class PositionControlComponent implements OnInit {
  @Input() positions: string[];
  @Input() currentPosition: string;

  @Output() changePosition = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  public setNewPosition(position: string): void {
    this.changePosition.emit(position);
  }

}
