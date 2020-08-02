import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';

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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  public saveGeneral() {
    /*const settings = {};
    settings.phone = this.user.phone.trim();
    settings.email = $("input#email").val().trim();
    settings.notifications = controls.notifications.checked;
    settings.isNeedStatsNotifications = controls.isNeedStatsNotifications.checked;
    $(this).prop("disabled", "true");

    $.post(openapi.getUrl("user/generalsave"), settings, function(response) {
      if (response != null && response.rows.length > 0) {
        $("#saveGeneral").removeAttr("disabled");
        if (response.rows[0].code == 200) {
          swal({
            title: $("#locale-settings").val(),
            text: "",
            type: "success"
          });
        } else {
          validate(response.rows[0]);
        }
      }
    });*/
  }

  public changePassword() {
    /*var pass = {};
    pass.oldpas = $("input#oldpas").val();
    pass.newpas = $("input#newpas").val();
    $(this).prop("disabled", "true");

    $.post(openapi.getUrl("user/passchange"), pass, function(response) {
      if (response != null && response.rows.length > 0) {
        $("#changePas").removeAttr("disabled");
        if (response.rows[0].code == 200) {
          $("input#oldpas").val("");
          $("input#newpas").val("");
          swal({
            title: $("#locale-pass1").val(),
            text: "",
            type: "success"
          });
        } else {
          validate(response.rows[0]);
        }
      }
    });*/
  }

  public togglePasswordVisibility(type: 'password' | 'text') {
    this.password.nativeElement.setAttribute('type', type);
  }

}
