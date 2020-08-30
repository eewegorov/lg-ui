import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abtest-add',
  templateUrl: './abtest-add.component.html',
  styleUrls: ['./abtest-add.component.scss']
})
export class AbtestAddComponent implements OnInit {
  public type;

  constructor() { }

  ngOnInit(): void {
  }

}
