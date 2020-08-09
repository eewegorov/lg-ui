import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abtests-archive',
  templateUrl: './abtests-archive.component.html',
  styleUrls: ['./abtests-archive.component.scss']
})
export class AbtestsArchiveComponent implements OnInit {
  public currSite;
  public site = {
    name: 'dfdsfs'
  };
  public test = {
    id: 'dfsdfds12',
    name: 'dsfsfsf',
    description: 'dsfsfdsf'
  };
  public item = {
    name: 'dfdsfds',
    target: 2,
    shows: 3,
    conversion: 23
  };

  constructor() { }

  ngOnInit(): void {
  }

  public getSiteName(site) {

  }

  public getCroppedString(siteName, count, end) {

  }

}
