import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-line',
  templateUrl: './color-line.component.html',
  styleUrls: ['./color-line.component.scss']
})
export class ColorLineComponent implements OnInit {
  @Input() type: 'core' | 'modals' = 'core';

  constructor() { }

  ngOnInit(): void {
  }

}
