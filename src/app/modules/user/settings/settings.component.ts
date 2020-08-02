import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('password', { static: true }) private password: ElementRef;
  public user = {
    notificated: true,
    needStatsNotifications: true,
    phone: '21414234234',
    email: 'aaa@aaa.com'
  };

  constructor() { }

  ngOnInit(): void {
  }



  public togglePasswordVisibility(type: 'password' | 'text') {
    this.password.nativeElement.setAttribute('type', type);
  }

}
