import { Component, Input, OnInit } from '@angular/core';
import { Smartpoint, Smartpoints } from '@core/models/sites';
import { WidgetService } from '../services/widget.service';

@Component({
  selector: 'app-smartpoints-control',
  templateUrl: './smartpoints-control.component.html',
  styleUrls: ['../shared/shared.scss', './smartpoints-control.component.scss']
})
export class SmartpointsControlComponent implements OnInit {
  @Input() public siteId: string;

  public smWidgets = {
    CALLBACK: { enabled: true, autoinvite: true, pos: 'RIGHT_DOWN', type: 'CALLBACK' },
    INVITE: { enabled: true, autoinvite: true, pos: 'RIGHT_DOWN', type: 'INVITE' },
    INSTANT_POPUP: { enabled: false, autoinvite: true, pos: 'RIGHT_DOWN', type: 'INSTANT_POPUP' },
    POPUP: { enabled: false, autoinvite: true, pos: 'RIGHT_DOWN', type: 'POPUP' },
    EXIT_INTENT: { enabled: false, autoinvite: true, pos: 'RIGHT_DOWN', type: 'EXIT_INTENT' },
    MOBILE: { enabled: true, autoinvite: true, pos: 'RIGHT_DOWN', type: 'MOBILE' }
  };

  public positions = [
    {
      pos: 'RIGHT_DOWN',
      text: 'settings.widgets.invite.position.rcorner'
    },
    {
      pos: 'RIGHT_EDGE',
      text: 'settings.widgets.invite.position.rside'
    },
    {
      pos: 'LEFT_DOWN',
      text: 'settings.widgets.invite.position.lcorner'
    },
    {
      pos: 'LEFT_EDGE',
      text: 'settings.widgets.invite.position.lside'
    }
  ];

  constructor(private widgetService: WidgetService) {}

  @Input() set smartPoints(smartPoints: Smartpoints) {
    if (smartPoints && smartPoints.list.length) {
      smartPoints.list.forEach((item: Smartpoint) => {
        this.smWidgets[item.type] = item;
      });
    }
  }

  ngOnInit(): void {}

  public getPositionText(position: string) {
    if (position === 'RIGHT_DOWN') {
      return 'settings.widgets.invite.position.rcorner';
    } else if (position === 'RIGHT_EDGE') {
      return 'settings.widgets.invite.position.rside';
    } else if (position === 'LEFT_DOWN') {
      return 'settings.widgets.invite.position.lcorner';
    } else if (position === 'LEFT_EDGE') {
      return 'settings.widgets.invite.position.lside';
    }
  }

  public prepareSmartpointForSave(smartpoint) {
    if (smartpoint.type) {
      this.widgetService.saveSmartpointType(this.siteId, smartpoint).subscribe();
    }
  }

  public setPosition(smartpoint, position) {
    smartpoint.pos = position;
    this.prepareSmartpointForSave(smartpoint);
  }
}
