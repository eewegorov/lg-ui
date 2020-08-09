import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {
  public item = {
    id: '213131',
    name: 'qwasfasf',
    email: 'aaa@aaa.com'
  };
  public periodStart;
  public periodEnd;
  public overallStats = {
    allCount: 2131,
    periodCount: 112,
    periodAvg: 110
  };
  public site = {
    name: 'asdad',
    count: 2
  }

  constructor() { }

  ngOnInit(): void {
  }

}
