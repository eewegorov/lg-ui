import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('ichecks', { static: true }) ichecks: ElementRef;
  error: string;

  constructor() { }

  ngOnInit(): void {
    ($(this.ichecks.nativeElement) as any).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
  }

}
