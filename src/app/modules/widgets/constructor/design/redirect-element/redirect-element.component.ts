import { Component, Input, OnInit } from '@angular/core';
import { FullWidget } from '../../../../../core/models/widgets';

@Component({
  selector: 'app-redirect-element',
  templateUrl: './redirect-element.component.html',
  styleUrls: ['./redirect-element.component.scss']
})
export class RedirectElementComponent implements OnInit {
  @Input() public widget: FullWidget;

  constructor() { }

  ngOnInit(): void {
  }

}
