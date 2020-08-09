import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abtests-active',
  templateUrl: './abtests-active.component.html',
  styleUrls: ['./abtests-active.component.scss']
})
export class AbtestsActiveComponent implements OnInit {
  public currSite;
  public site = {
    name: 'dfdsfs'
  };
  public test = {
    id: 'dfsdfds12',
    name: 'dsfsfsf',
    description: 'dsfsfdsf'
  }
  public item = {
    name: 'dfdsfds',
    convInfo: {
      n: 2,
      s: 3,
      conversion: 23
    }
  }
  public type = {
    type: 'asddad',
    title: 'dsfdsfds'
  };
  public mckp = {
    preview: 'dfdsfsfs',
    name: 'dfdsfsf',
    description: 'dsfsffds'
  };
  public grp = {
    name: 'sdfsf'
  };
  public cat = {
    name: 'dsfsdf'
  }

  constructor() { }

  ngOnInit(): void {
  }

  public getSiteName(site) {

  }

  public getCroppedString(siteName, count, end) {

  }

}
