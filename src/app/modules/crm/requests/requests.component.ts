import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public item = {
    widgetName: 'fsdf',
    date: '1231231',
    state: 'sdfsf',
    status: 'asdasda'
  };
  public periodStart;

  constructor() { }

  ngOnInit(): void {
  }

  public showYesterdayDate() {

  }

}
